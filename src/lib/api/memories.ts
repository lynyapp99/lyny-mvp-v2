import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type FeedItem = {
  id: string;
  memoryId: string;
  uploaderId: string | null;
  kind: "note" | "photo" | "video";
  text: string | null;
  mediaUrl: string | null;
  storagePath: string | null;
  createdAt: string;
};

export const useTimelineMemories = (timelineId: string | undefined) => {
  return useQuery({
    queryKey: ["memories", timelineId],
    enabled: !!timelineId,
    queryFn: async (): Promise<FeedItem[]> => {
      const { data, error } = await supabase
        .from("memories")
        .select("id, user_id, description, kind, created_at, memory_media(user_id, kind, public_url, storage_path, position)")
        .eq("timeline_id", timelineId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const items: FeedItem[] = [];
      for (const m of data ?? []) {
        if (m.kind === "note") {
          items.push({
            id: m.id,
            memoryId: m.id,
            uploaderId: m.user_id,
            kind: "note",
            text: m.description,
            mediaUrl: null,
            storagePath: null,
            createdAt: m.created_at,
          });
        } else {
          const media = (m.memory_media ?? []).sort((a: any, b: any) => a.position - b.position);
          for (const mm of media) {
            items.push({
              id: `${m.id}:${mm.storage_path}`,
              memoryId: m.id,
              uploaderId: mm.user_id ?? m.user_id,
              kind: mm.kind === "video" ? "video" : "photo",
              text: m.description,
              mediaUrl: mm.public_url,
              storagePath: mm.storage_path,
              createdAt: m.created_at,
            });
          }
        }
      }
      return items;
    },
  });
};

export const useCreateNote = (timelineId: string) => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (text: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("memories").insert({
        user_id: user.id,
        timeline_id: timelineId,
        kind: "note",
        description: text,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["memories", timelineId] }),
  });
};

export type UploadProgress = {
  id: string;
  name: string;
  progress: number;
  kind: "photo" | "video";
};

export const uploadTimelineMedia = async (params: {
  userId: string;
  timelineId: string;
  file: File;
  kind: "photo" | "video";
  onProgress?: (pct: number) => void;
}) => {
  const { userId, timelineId, file, kind, onProgress } = params;
  const ext = file.name.split(".").pop() ?? (kind === "photo" ? "jpg" : "mp4");
  const folder = kind === "photo" ? "photos" : "videos";
  const path = `${timelineId}/${folder}/${crypto.randomUUID()}.${ext}`;

  // 1. Insert memory row
  const { data: memory, error: memErr } = await supabase
    .from("memories")
    .insert({ user_id: userId, timeline_id: timelineId, kind: "media" })
    .select()
    .single();
  if (memErr) throw memErr;

  try {
    // 2. Upload file (supabase-js v2 não tem callback de progresso real; simulamos início/fim)
    onProgress?.(10);
    const { error: upErr } = await supabase.storage
      .from("memories")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) throw upErr;
    onProgress?.(90);

    const { data: pub } = supabase.storage.from("memories").getPublicUrl(path);

    // 3. Insert memory_media row
    const { error: mmErr } = await supabase.from("memory_media").insert({
      memory_id: memory.id,
      user_id: userId,
      storage_path: path,
      public_url: pub.publicUrl,
      kind: kind === "photo" ? "image" : "video",
      size_bytes: file.size,
    });
    if (mmErr) throw mmErr;
    onProgress?.(100);
  } catch (e) {
    // rollback
    await supabase.from("memories").delete().eq("id", memory.id);
    throw e;
  }
};
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";

export type SectorRow = Database["public"]["Tables"]["sectors"]["Row"];
export type TimelineRow = Database["public"]["Tables"]["timelines"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type MemoryRow = Database["public"]["Tables"]["memories"]["Row"];
export type MemoryMediaRow = Database["public"]["Tables"]["memory_media"]["Row"];

export const useProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<ProfileRow | null> => {
      if (!user) return null;
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

export const useSectors = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["sectors", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<SectorRow[]> => {
      const { data, error } = await supabase.from("sectors").select("*").order("position", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useTimelines = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["timelines", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<TimelineRow[]> => {
      const { data, error } = await supabase.from("timelines").select("*").order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useCreateSector = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: { name: string; emoji: string; color: SectorRow["color"] }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("sectors")
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sectors"] }),
  });
};

export const useDeleteSector = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sectors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sectors"] }),
  });
};

export const useCreateTimeline = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: { sector_id: string | null; title: string; subtitle?: string; cover_url?: string; privacy?: TimelineRow["privacy"] }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("timelines")
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["timelines"] }),
  });
};

export const useSharedTimelines = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["shared-timelines", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<TimelineRow[]> => {
      if (!user) return [];
      const { data: memberships, error: memErr } = await supabase
        .from("timeline_members")
        .select("timeline_id")
        .eq("user_id", user.id);
      if (memErr) throw memErr;
      const ids = (memberships ?? []).map((m) => m.timeline_id);
      if (ids.length === 0) return [];
      const { data, error } = await supabase
        .from("timelines")
        .select("*")
        .in("id", ids)
        .neq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
};
export type TimelineMember = {
  userId: string;
  role: "owner" | "contributor" | "viewer";
  displayName: string | null;
  username: string | null;
  avatarUrl: string | null;
};

export const useTimelineMembers = (timelineId: string | undefined) => {
  return useQuery({
    queryKey: ["timeline-members", timelineId],
    enabled: !!timelineId,
    queryFn: async (): Promise<TimelineMember[]> => {
      if (!timelineId) return [];
      const [{ data: timeline, error: tErr }, { data: members, error: mErr }] = await Promise.all([
        supabase.from("timelines").select("user_id").eq("id", timelineId).maybeSingle(),
        supabase.from("timeline_members").select("user_id, role").eq("timeline_id", timelineId),
      ]);
      if (tErr) throw tErr;
      if (mErr) throw mErr;

      const ownerId = timeline?.user_id;
      const ids = new Set<string>();
      if (ownerId) ids.add(ownerId);
      (members ?? []).forEach((m) => ids.add(m.user_id));
      if (ids.size === 0) return [];

      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("id, display_name, username, avatar_url")
        .in("id", Array.from(ids));
      if (pErr) throw pErr;

      const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
      const result: TimelineMember[] = [];
      if (ownerId) {
        const p = profileMap.get(ownerId);
        result.push({
          userId: ownerId,
          role: "owner",
          displayName: p?.display_name ?? null,
          username: p?.username ?? null,
          avatarUrl: p?.avatar_url ?? null,
        });
      }
      (members ?? []).forEach((m) => {
        if (m.user_id === ownerId) return;
        const p = profileMap.get(m.user_id);
        const role = (m.role === "contributor" || m.role === "viewer" || m.role === "owner")
          ? (m.role as TimelineMember["role"])
          : "viewer";
        result.push({
          userId: m.user_id,
          role,
          displayName: p?.display_name ?? null,
          username: p?.username ?? null,
          avatarUrl: p?.avatar_url ?? null,
        });
      });
      return result;
    },
  });
};

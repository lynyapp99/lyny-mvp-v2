import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads a timeline cover image to the public `memories` bucket
 * under the path `{userId}/covers/{uuid}.{ext}` and returns its public URL.
 */
export const uploadTimelineCover = async (userId: string, file: File): Promise<string> => {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${userId}/covers/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("memories")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });
  if (error) throw error;
  const { data } = supabase.storage.from("memories").getPublicUrl(path);
  return data.publicUrl;
};

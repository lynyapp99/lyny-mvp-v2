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
    mutationFn: async (input: { sector_id: string; title: string; subtitle?: string; cover_url?: string; privacy?: TimelineRow["privacy"] }) => {
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
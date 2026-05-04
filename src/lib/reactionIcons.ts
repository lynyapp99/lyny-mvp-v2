import { Heart, Laugh, Sparkles, ThumbsUp, type LucideIcon } from "lucide-react";

export type ReactionType = "love" | "laugh" | "wow" | "like";

export const REACTION_ICONS: Record<ReactionType, { icon: LucideIcon; label: string; tone: string }> = {
  love: { icon: Heart, label: "Amei", tone: "text-primary" },
  laugh: { icon: Laugh, label: "Risada", tone: "text-foreground" },
  wow: { icon: Sparkles, label: "Uau", tone: "text-foreground" },
  like: { icon: ThumbsUp, label: "Curti", tone: "text-foreground" },
};

export const REACTION_ORDER: ReactionType[] = ["love", "laugh", "wow", "like"];
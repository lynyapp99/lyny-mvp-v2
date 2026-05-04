import {
  Heart,
  Users,
  Home,
  Briefcase,
  PartyPopper,
  Coffee,
  GraduationCap,
  Plane,
  Music,
  Star,
  Shield,
  Flame,
  type LucideIcon,
} from "lucide-react";

export const RELATIONSHIP_ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  users: Users,
  home: Home,
  family: Home,
  work: Briefcase,
  briefcase: Briefcase,
  party: PartyPopper,
  squad: PartyPopper,
  coffee: Coffee,
  study: GraduationCap,
  travel: Plane,
  music: Music,
  star: Star,
  shield: Shield,
  flame: Flame,
};

export const RELATIONSHIP_ICON_OPTIONS: Array<{ key: string; icon: LucideIcon; label: string }> = [
  { key: "heart", icon: Heart, label: "Coração" },
  { key: "users", icon: Users, label: "Grupo" },
  { key: "home", icon: Home, label: "Família" },
  { key: "briefcase", icon: Briefcase, label: "Trabalho" },
  { key: "party", icon: PartyPopper, label: "Festa" },
  { key: "coffee", icon: Coffee, label: "Café" },
  { key: "study", icon: GraduationCap, label: "Estudo" },
  { key: "travel", icon: Plane, label: "Viagem" },
  { key: "music", icon: Music, label: "Música" },
  { key: "star", icon: Star, label: "Favorito" },
  { key: "shield", icon: Shield, label: "Seguro" },
  { key: "flame", icon: Flame, label: "Energia" },
];

const FALLBACK_ICONS: LucideIcon[] = [Heart, Users, Home, Briefcase, PartyPopper, Coffee, Star, Flame];

export const getRelationshipIcon = (key?: string): LucideIcon => {
  if (!key) return Users;
  const normalized = key.toLowerCase();
  if (RELATIONSHIP_ICONS[normalized]) return RELATIONSHIP_ICONS[normalized];
  // Fallback by hashing the key so legacy emoji values still resolve to a stable icon.
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) hash = (hash + normalized.charCodeAt(i)) % FALLBACK_ICONS.length;
  return FALLBACK_ICONS[hash];
};
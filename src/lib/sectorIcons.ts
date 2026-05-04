import {
  Heart,
  Users,
  Home,
  Rocket,
  Sparkles,
  Folder,
  type LucideIcon,
} from "lucide-react";

export const getSectorIcon = (emoji?: string): LucideIcon => {
  switch (emoji) {
    case "💛":
    case "❤️":
      return Heart;
    case "🎉":
    case "👥":
      return Users;
    case "🏡":
      return Home;
    case "🚀":
      return Rocket;
    case "⚡":
      return Sparkles;
    default:
      return Folder;
  }
};
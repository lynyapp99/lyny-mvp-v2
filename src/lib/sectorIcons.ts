import {
  Heart,
  Users,
  Home,
  Rocket,
  Sparkles,
  Folder,
  Plane,
  Briefcase,
  Camera,
  Music,
  BookOpen,
  Gamepad2,
  Palette,
  Star,
  Flame,
  type LucideIcon,
} from "lucide-react";

export const getSectorIcon = (emoji?: string): LucideIcon => {
  switch (emoji) {
    case "heart":
    case "💛":
    case "❤️":
    case "💕":
      return Heart;
    case "users":
    case "🎉":
    case "👥":
      return Users;
    case "home":
    case "🏡":
      return Home;
    case "rocket":
    case "🚀":
      return Rocket;
    case "sparkles":
    case "⚡":
    case "✨":
      return Sparkles;
    case "plane":
    case "✈️":
      return Plane;
    case "briefcase":
    case "💼":
      return Briefcase;
    case "camera":
    case "📷":
      return Camera;
    case "music":
    case "🎵":
      return Music;
    case "book":
    case "📚":
      return BookOpen;
    case "game":
    case "🎮":
      return Gamepad2;
    case "palette":
    case "🎨":
      return Palette;
    case "star":
    case "🌟":
      return Star;
    case "flame":
    case "🔥":
      return Flame;
    default:
      return Folder;
  }
};

export const SECTOR_ICON_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "folder", label: "Pasta" },
  { value: "heart", label: "Coração" },
  { value: "users", label: "Pessoas" },
  { value: "home", label: "Casa" },
  { value: "plane", label: "Viagem" },
  { value: "briefcase", label: "Trabalho" },
  { value: "camera", label: "Foto" },
  { value: "music", label: "Música" },
  { value: "book", label: "Livro" },
  { value: "game", label: "Jogo" },
  { value: "palette", label: "Arte" },
  { value: "star", label: "Estrela" },
  { value: "sparkles", label: "Brilho" },
  { value: "rocket", label: "Foguete" },
  { value: "flame", label: "Chama" },
];
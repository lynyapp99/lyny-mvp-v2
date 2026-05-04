import { ExternalLink, Play, Music, MapPin, Share, Heart, MessageCircle, Copy, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface EmbedData {
  url: string;
  provider: "youtube" | "instagram" | "tiktok" | "twitter" | "spotify" | "google-maps" | "generic";
  title: string;
  description?: string;
  thumbnail?: string;
  embedHtml?: string;
}

interface EmbedCardProps {
  embed: EmbedData;
  caption?: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  reactions: { userId: string; type: "love" | "laugh" | "wow" | "like" }[];
  onReaction?: (type: "love" | "laugh" | "wow" | "like") => void;
  onComment?: () => void;
  onShare?: () => void;
}

const EmbedCard = ({
  embed,
  caption,
  authorName,
  authorAvatar,
  createdAt,
  reactions,
  onReaction,
  onComment,
  onShare,
}: EmbedCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getProviderIcon = () => {
    switch (embed.provider) {
      case "youtube":
        return <Play size={16} className="text-red-500" />;
      case "spotify":
        return <Music size={16} className="text-green-500" />;
      case "google-maps":
        return <MapPin size={16} className="text-blue-500" />;
      case "instagram":
        return <div className="w-4 h-4 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-sm" />;
      case "tiktok":
        return <div className="w-4 h-4 bg-black dark:bg-white rounded-sm" />;
      case "twitter":
        return <div className="w-4 h-4 bg-blue-400 rounded-sm" />;
      default:
        return <ExternalLink size={16} className="text-muted-foreground" />;
    }
  };

  const getProviderColor = () => {
    switch (embed.provider) {
      case "youtube":
        return "border-red-500/20 bg-red-500/5";
      case "spotify":
        return "border-green-500/20 bg-green-500/5";
      case "google-maps":
        return "border-blue-500/20 bg-blue-500/5";
      case "instagram":
        return "border-pink-500/20 bg-pink-500/5";
      case "tiktok":
        return "border-slate-500/20 bg-slate-500/5";
      case "twitter":
        return "border-blue-400/20 bg-blue-400/5";
      default:
        return "border-border bg-card";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} sem atrás`;
    return date.toLocaleDateString("pt-BR");
  };

  const handleOpenEmbed = () => {
    window.open(embed.url, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(embed.url);
      // Could add toast notification here
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden transition-all duration-200 hover:shadow-lg">
      {/* Author Header */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <img
          src={authorAvatar}
          alt={authorName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-foreground">{authorName}</h4>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{formatDate(createdAt)}</span>
          </div>
          {caption && (
            <p className="text-sm text-muted-foreground mt-1">{caption}</p>
          )}
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal size={16} />
        </Button>
      </div>

      {/* Embed Content */}
      <div className={`mx-4 mb-4 rounded-xl border transition-all duration-200 overflow-hidden ${getProviderColor()}`}>
        {/* Thumbnail/Preview */}
        <div className="relative">
          {embed.thumbnail && (
            <>
              <img
                src={embed.thumbnail}
                alt={embed.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                <Button
                  onClick={handleOpenEmbed}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                  size="sm"
                >
                  <ExternalLink size={16} className="mr-2" />
                  Abrir
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Embed Info */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {getProviderIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-foreground line-clamp-2 mb-1">
                {embed.title}
              </h5>
              {embed.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {embed.description}
                </p>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground capitalize">
                  {embed.provider === "google-maps" ? "Google Maps" : embed.provider}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <button
                  onClick={handleOpenEmbed}
                  className="text-xs text-primary hover:underline"
                >
                  Abrir link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onReaction?.("love")}
            className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Heart
              size={16}
              className={reactions.some(r => r.type === "love") ? "fill-current text-red-500" : ""}
            />
            <span className="text-sm">
              {reactions.filter(r => r.type === "love").length || ""}
            </span>
          </button>
          
          <button
            onClick={onComment}
            className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors"
          >
            <MessageCircle size={16} />
            <span className="text-sm">Comentar</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 text-muted-foreground hover:text-green-500 transition-colors"
          >
            <Copy size={16} />
            <span className="text-sm">Link</span>
          </button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          className="h-8"
        >
          <Share size={14} className="mr-2" />
          Compartilhar
        </Button>
      </div>
    </div>
  );
};

export default EmbedCard;
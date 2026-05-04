import { X, Heart, MapPin, Calendar } from "lucide-react";
import { IOSButton } from "@/components/ui/ios-button";
import { Button } from "@/components/ui/button";
import { type TimelineMemory } from "@/data/timelineMemories";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TimelineMapCardProps {
  memory: TimelineMemory;
  onClose: () => void;
  onOpen: () => void;
}

const TimelineMapCard = ({ memory, onClose, onOpen }: TimelineMapCardProps) => {
  const coverImage = memory.content.photos?.[0];
  const totalReactions = memory.reactions.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="fixed inset-x-4 bottom-4 z-20 max-w-md mx-auto animate-slide-in-bottom">
      <div className="bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="relative">
          {coverImage && (
            <div className="h-40 overflow-hidden">
              <img
                src={coverImage}
                alt="Memory"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <X size={16} />
          </button>

          {memory.milestone && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-500/90 backdrop-blur-sm rounded-full text-xs font-medium text-white flex items-center gap-1">
              ⭐ Marco
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Author */}
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={memory.authorAvatar} />
              <AvatarFallback>
                {memory.authorName.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{memory.authorName}</h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar size={12} />
                {formatDate(memory.createdAt)}
              </div>
            </div>
          </div>

          {/* Text content */}
          {memory.content.text && (
            <p className="text-sm text-foreground mb-3 line-clamp-2">
              {memory.content.text}
            </p>
          )}

          {/* Location */}
          {memory.content.location && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 p-2 bg-muted/30 rounded-lg">
              <MapPin size={14} className="text-primary flex-shrink-0" />
              <span className="truncate">{memory.content.location.name}</span>
            </div>
          )}

          {/* Reactions summary */}
          {totalReactions > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Heart size={14} className="text-red-500" />
              <span className="text-xs text-muted-foreground">
                {totalReactions} {totalReactions === 1 ? "reação" : "reações"}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                {memory.comments.length} {memory.comments.length === 1 ? "comentário" : "comentários"}
              </span>
            </div>
          )}

          {/* Action button */}
          <Button
            onClick={onOpen}
            className="w-full"
          >
            Abrir Memória
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimelineMapCard;

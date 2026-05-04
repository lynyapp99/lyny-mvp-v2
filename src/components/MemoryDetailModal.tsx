import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Heart, MessageCircle, X, Crown, Star } from "lucide-react";
import { TimelineMemory, addReactionToMemory, addCommentToMemory } from "@/data/timelineMemories";
import { useState } from "react";
import { REACTION_ORDER, REACTION_ICONS, type ReactionType } from "@/lib/reactionIcons";

interface MemoryDetailModalProps {
  memory: TimelineMemory | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const MemoryDetailModal = ({ memory, isOpen, onClose, onUpdate }: MemoryDetailModalProps) => {
  const [newComment, setNewComment] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!memory) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleReaction = (reactionType: ReactionType) => {
    addReactionToMemory(memory.id, "u1", reactionType);
    onUpdate();
  };

  const handleComment = () => {
    const commentText = newComment.trim();
    if (!commentText) return;

    addCommentToMemory(
      memory.id,
      "u1",
      "Pedro",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      commentText
    );
    
    setNewComment("");
    onUpdate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={memory.authorAvatar} />
                <AvatarFallback>
                  {memory.authorName.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground">{memory.authorName}</h3>
                  {memory.milestone && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                      <Crown size={12} className="text-yellow-600 dark:text-yellow-400" />
                      <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">Milestone</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{formatDate(memory.createdAt)}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-6">
            {/* Location */}
            {memory.content.location && (
              <div className="mb-6 p-4 bg-muted/30 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{memory.content.location.name}</h4>
                    <p className="text-sm text-muted-foreground">{memory.content.location.address}</p>
                  </div>
                </div>
                {memory.content.location.coordinates && (
                  <div className="h-32 bg-muted/50 rounded-lg flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Map would be displayed here</p>
                  </div>
                )}
              </div>
            )}

            {/* Photos */}
            {memory.content.photos && memory.content.photos.length > 0 && (
              <div className="mb-6">
                <div className="relative">
                  <img
                    src={memory.content.photos[selectedImageIndex]}
                    alt={`Memory photo ${selectedImageIndex + 1}`}
                    className="w-full h-80 object-cover rounded-xl"
                  />
                  {memory.content.photos.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {memory.content.photos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === selectedImageIndex ? "bg-white" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {memory.content.photos.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {memory.content.photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === selectedImageIndex ? "border-primary" : "border-transparent"
                        }`}
                      >
                        <img
                          src={photo}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Text Content */}
            {memory.content.text && (
              <div className="mb-6">
                <p className="text-foreground leading-relaxed text-lg">{memory.content.text}</p>
              </div>
            )}

            {/* Tags */}
            {memory.tags && memory.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {memory.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Reactions */}
            <div className="flex items-center justify-between mb-6 p-4 bg-surface-2 rounded-xl">
              <div className="flex items-center gap-2">
                {REACTION_ORDER.map((type) => {
                  const { icon: Icon, label, tone } = REACTION_ICONS[type];
                  const count = memory.reactions.filter(r => r.type === type).length;
                  return (
                    <button
                      key={type}
                      onClick={() => handleReaction(type)}
                      aria-label={label}
                      className="flex items-center gap-2 hover:bg-surface px-3 py-2 rounded-lg transition-colors"
                    >
                      <Icon className={`w-5 h-5 ${tone}`} strokeWidth={1.75} />
                      {count > 0 && (
                        <span className="text-sm text-muted-foreground font-medium">{count}</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle size={16} />
                <span>{memory.comments.length} comentários</span>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Comments</h4>
              {memory.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={comment.userAvatar} />
                    <AvatarFallback className="text-xs">
                      {comment.userName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted/50 rounded-2xl px-4 py-3">
                      <p className="font-medium text-sm text-foreground mb-1">{comment.userName}</p>
                      <p className="text-sm text-foreground">{comment.text}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 pl-4">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Add Comment */}
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
                  <AvatarFallback className="text-xs">P</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleComment()}
                    className="flex-1 bg-muted/50 border-0 rounded-full"
                  />
                  <Button
                    onClick={handleComment}
                    disabled={!newComment.trim()}
                    className="rounded-full"
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MemoryDetailModal;
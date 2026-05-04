import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, MoreVertical, MapPin, Camera, Plus, Filter, Star, Crown, Map as MapIcon, Utensils, Pizza, Fish, Plane, Link2, ZoomIn } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { IOSButton } from "@/components/ui/ios-button";
import { SpringAnimation } from "@/components/ui/spring-animation";
import { mockTimelines } from "@/data/mockData";
import { getMemoriesForTimeline, addReactionToMemory, addCommentToMemory, type TimelineMemory } from "@/data/timelineMemories";
import { useToast } from "@/hooks/use-toast";
import MemoryDetailModal from "@/components/MemoryDetailModal";
import EmbedCard from "@/components/EmbedCard";
import TimelineMapView from "@/components/TimelineMapView";
import ImageLightbox from "@/components/ImageLightbox";
import InviteMemberModal from "@/components/InviteMemberModal";
import { REACTION_ORDER, REACTION_ICONS } from "@/lib/reactionIcons";

const TimelineDetail = () => {
  const { timelineId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [memories, setMemories] = useState<TimelineMemory[]>([]);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [selectedMemory, setSelectedMemory] = useState<TimelineMemory | null>(null);
  const [filterType, setFilterType] = useState<"all" | "italian" | "japanese" | "travel" | "embeds">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"feed" | "map">("feed");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const timeline = mockTimelines.find(t => t.id === timelineId);

  useEffect(() => {
    if (timelineId) {
      let timelineMemories = getMemoriesForTimeline(timelineId);
      
      // Apply filters
      if (filterType !== "all") {
        timelineMemories = timelineMemories.filter(memory => {
          switch (filterType) {
            case "italian":
              return memory.tags?.some(tag => tag.includes("italian"));
            case "japanese":
              return memory.tags?.some(tag => tag.includes("japanese"));
            case "travel":
              return memory.tags?.some(tag => ["travel", "milestone"].includes(tag));
            case "embeds":
              return memory.type === "embed";
            default:
              return true;
          }
        });
      }
      
      setMemories(timelineMemories);
    }
  }, [timelineId, filterType]);

  if (!timeline) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Timeline not found</h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? "s" : ""} ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
    });
  };

  const handleReaction = (memoryId: string, reactionType: "love" | "laugh" | "wow" | "like") => {
    addReactionToMemory(memoryId, "u1", reactionType);
    setMemories(getMemoriesForTimeline(timelineId!));
    toast({
      title: "Reaction added",
      description: `You ${reactionType}d this memory`,
    });
  };

  const handleComment = (memoryId: string) => {
    const commentText = newComment[memoryId]?.trim();
    if (!commentText) return;

    addCommentToMemory(
      memoryId,
      "u1",
      "You",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      commentText
    );
    
    setMemories(getMemoriesForTimeline(timelineId!));
    setNewComment(prev => ({ ...prev, [memoryId]: "" }));
    setShowComments(prev => ({ ...prev, [memoryId]: true }));
    
    toast({
      title: "Comment added",
      description: "Your comment has been posted",
    });
  };

  const toggleComments = (memoryId: string) => {
    setShowComments(prev => ({ ...prev, [memoryId]: !prev[memoryId] }));
  };

  const filterOptions = [
    { key: "all" as const, label: "Todas", icon: Utensils },
    { key: "italian" as const, label: "Italiana", icon: Pizza },
    { key: "japanese" as const, label: "Japonesa", icon: Fish },
    { key: "travel" as const, label: "Viagens", icon: Plane },
    { key: "embeds" as const, label: "Links", icon: Link2 },
  ];

  // If map view is active, show the map component
  if (viewMode === "map") {
    return (
      <TimelineMapView
        memories={memories}
        onMemoryClick={setSelectedMemory}
        onBack={() => setViewMode("feed")}
        timelineTitle={timeline.title}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <GlassCard className="sticky top-0 z-40 border-0 border-b border-border/50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
              <IOSButton
                variant="ghost"
                size="icon"
                onClick={() => {
                  if ("vibrate" in navigator) navigator.vibrate(10);
                  navigate(-1);
                }}
                className="rounded-xl min-w-[44px] min-h-[44px]"
                aria-label="Voltar"
              >
                <ArrowLeft size={20} className="text-muted-foreground" />
              </IOSButton>
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-foreground">{timeline.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {timeline.members} membros • {timeline.items} memórias
                </p>
              </div>
              <IOSButton 
                variant="ghost" 
                size="icon" 
                className="rounded-xl min-w-[44px] min-h-[44px]"
                onClick={() => {
                  if ("vibrate" in navigator) navigator.vibrate(10);
                  setViewMode("map");
                }}
                aria-label="Visualização em mapa"
              >
                <MapIcon size={20} className="text-muted-foreground" />
              </IOSButton>
              <IOSButton 
                variant="ghost" 
                size="icon" 
                className="rounded-xl min-w-[44px] min-h-[44px]"
                onClick={() => {
                  if ("vibrate" in navigator) navigator.vibrate(10);
                  setIsInviteModalOpen(true);
                }}
                aria-label="Mais opções"
              >
                <MoreVertical size={20} className="text-muted-foreground" />
              </IOSButton>
          </div>
        </div>
      </GlassCard>

      {/* Timeline Cover */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={timeline.cover}
          alt={timeline.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-white text-xl font-bold mb-1">{timeline.title}</h2>
          <p className="text-white/90 text-sm">{timeline.subtitle}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-card rounded-xl border border-border">
            <div className="text-lg font-bold text-primary">{memories.length}</div>
            <div className="text-xs text-muted-foreground">Memórias</div>
          </div>
          <div className="text-center p-3 bg-card rounded-xl border border-border">
            <div className="text-lg font-bold text-primary">{timeline.members}</div>
            <div className="text-xs text-muted-foreground">Membros</div>
          </div>
          <div className="text-center p-3 bg-card rounded-xl border border-border">
            <div className="text-lg font-bold text-primary">
              {memories.reduce((sum, m) => sum + m.reactions.length, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Reações</div>
          </div>
        </div>

        {/* Milestones Section */}
        {memories.some(m => m.milestone) && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Crown size={16} className="text-yellow-500" />
              Marcos
            </h3>
            <div className="space-y-2">
              {memories.filter(m => m.milestone).map((milestone) => (
                <div 
                  key={milestone.id}
                  onClick={() => setSelectedMemory(milestone)}
                  className="p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-800/30 rounded-xl cursor-pointer hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-center gap-3">
                    {milestone.content.photos?.[0] && (
                      <img 
                        src={milestone.content.photos[0]} 
                        alt="Milestone" 
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Star size={14} className="text-yellow-500" />
                        <span className="text-sm font-medium text-foreground">
                          {milestone.content.location?.name}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(milestone.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Categorias</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                if ("vibrate" in navigator) navigator.vibrate(10);
                setShowFilters(!showFilters);
              }}
              className="flex items-center gap-2 min-h-[44px]"
              aria-label="Filtrar"
            >
              <Filter size={14} />
              Filtrar
            </Button>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {filterOptions.map((filter) => {
              const Icon = filter.icon;
              const isActive = filterType === filter.key;
              return (
                <button
                  key={filter.key}
                  onClick={() => {
                    if ("vibrate" in navigator) navigator.vibrate(10);
                    setFilterType(filter.key);
                  }}
                  className={`px-3 py-1.5 min-h-[44px] rounded-full text-xs font-medium transition-all duration-150 flex items-center gap-1.5 active:scale-95 touch-manipulation ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface-2 text-muted-foreground hover:bg-surface-2/80"
                  }`}
                  aria-label={`Filtrar por ${filter.label}`}
                  aria-pressed={isActive}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add Memory Button */}
        <IOSButton className="w-full mb-6 flex items-center gap-2 min-h-[48px]">
          <Plus size={16} />
          Adicionar Memória
        </IOSButton>

        {/* Memories Feed */}
        <div className="space-y-6">
          {memories.map((memory) => {
            // Special handling for embed memories
            if (memory.type === "embed" && memory.content.embed) {
              return (
                <EmbedCard
                  key={memory.id}
                  embed={memory.content.embed}
                  caption={memory.content.text}
                  authorName={memory.authorName}
                  authorAvatar={memory.authorAvatar}
                  createdAt={memory.createdAt}
                  reactions={memory.reactions}
                  onReaction={(type) => handleReaction(memory.id, type)}
                  onComment={() => toggleComments(memory.id)}
                  onShare={() => console.log("Share embed")}
                />
              );
            }
            
            // Regular memory rendering
            return (
              <div 
                key={memory.id} 
                className={`bg-card rounded-2xl border overflow-hidden cursor-pointer hover:shadow-lg transition-all ${
                  memory.milestone 
                    ? "border-yellow-200 dark:border-yellow-800/50 shadow-yellow-100 dark:shadow-yellow-900/20" 
                    : "border-border"
                }`}
                onClick={() => setSelectedMemory(memory)}
              >
              {/* Memory Header */}
              <div className="p-4 flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={memory.authorAvatar} />
                  <AvatarFallback>
                    {memory.authorName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground">{memory.authorName}</h4>
                    {memory.milestone && (
                      <Crown size={14} className="text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{formatDate(memory.createdAt)}</p>
                </div>
                {memory.content.location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    <span className="truncate max-w-24">{memory.content.location.name}</span>
                  </div>
                )}
              </div>

              {/* Memory Content */}
              <div className="px-4 pb-4">
                {memory.content.text && (
                  <p className="text-foreground mb-3 leading-relaxed">{memory.content.text}</p>
                )}

                {/* Photos */}
                {memory.content.photos && memory.content.photos.length > 0 && (
                  <div className={`mb-4 ${memory.content.photos.length === 1 ? "" : "grid grid-cols-2 gap-2"}`}>
                    {memory.content.photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          if ("vibrate" in navigator) navigator.vibrate(10);
                          setLightboxImages(memory.content.photos || []);
                          setLightboxIndex(index);
                          setLightboxOpen(true);
                        }}
                        className={`relative overflow-hidden rounded-xl active:scale-95 transition-all duration-150 touch-manipulation ${
                          memory.content.photos!.length === 1 ? "aspect-[4/3]" : "aspect-square"
                        }`}
                        aria-label={`Ver imagem ${index + 1} em tela cheia`}
                      >
                        <img
                          src={photo}
                          alt={`Memória ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Zoom indicator */}
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                          <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                            <ZoomIn className="w-5 h-5 text-white" strokeWidth={2} />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Location Info */}
                {memory.content.location && (
                  <div className="mb-4 p-3 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={16} className="text-primary" />
                      <span className="font-medium text-foreground">{memory.content.location.name}</span>
                    </div>
                    {memory.content.location.address && (
                      <p className="text-sm text-muted-foreground pl-6">{memory.content.location.address}</p>
                    )}
                  </div>
                )}

                {/* Tags */}
                {memory.tags && memory.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {memory.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Reactions Bar */}
              <div className="px-4 py-3 border-t border-divider">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {REACTION_ORDER.map((type) => {
                      const { icon: Icon, label, tone } = REACTION_ICONS[type];
                      const count = memory.reactions.filter(r => r.type === type).length;
                      return (
                        <button
                          key={type}
                          onClick={(e) => {
                            e.stopPropagation();
                            if ("vibrate" in navigator) navigator.vibrate(10);
                            handleReaction(memory.id, type);
                          }}
                          className="flex items-center gap-1 hover:bg-surface-2 px-2 py-1 min-h-[36px] rounded-lg transition-all duration-150 active:scale-95 touch-manipulation"
                          aria-label={`Reagir com ${label}`}
                        >
                          <Icon className={`w-4 h-4 ${tone}`} strokeWidth={1.75} />
                          {count > 0 && (
                            <span className="text-sm text-muted-foreground">{count}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if ("vibrate" in navigator) navigator.vibrate(10);
                      toggleComments(memory.id);
                    }}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[36px] px-2 rounded-lg hover:bg-muted/50 touch-manipulation"
                    aria-label={`${showComments[memory.id] ? 'Ocultar' : 'Mostrar'} comentários`}
                  >
                    <MessageCircle size={16} />
                    {memory.comments.length > 0 && <span>{memory.comments.length}</span>}
                  </button>
                </div>

                {/* Comments Section */}
                {(showComments[memory.id] || memory.comments.length > 0) && (
                  <div className="space-y-3">
                    {memory.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.userAvatar} />
                          <AvatarFallback className="text-xs">
                            {comment.userName.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-muted/50 rounded-2xl px-3 py-2">
                            <p className="font-medium text-sm text-foreground">{comment.userName}</p>
                            <p className="text-sm text-foreground">{comment.text}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 pl-3">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Add Comment */}
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
                        <AvatarFallback className="text-xs">You</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex gap-2">
                        <Input
                          placeholder="Adicionar comentário..."
                          value={newComment[memory.id] || ""}
                          onChange={(e) => setNewComment(prev => ({ ...prev, [memory.id]: e.target.value }))}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              if ("vibrate" in navigator) navigator.vibrate(10);
                              handleComment(memory.id);
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 bg-muted/50 border-0 rounded-full min-h-[44px]"
                          aria-label="Campo de comentário"
                        />
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if ("vibrate" in navigator) navigator.vibrate(10);
                            handleComment(memory.id);
                          }}
                          disabled={!newComment[memory.id]?.trim()}
                          className="rounded-full min-h-[44px] px-4"
                        >
                          Enviar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            );
          })}
        </div>

        {/* Memory Detail Modal */}
        <MemoryDetailModal
          memory={selectedMemory}
          isOpen={!!selectedMemory}
          onClose={() => setSelectedMemory(null)}
          onUpdate={() => {
            setMemories(getMemoriesForTimeline(timelineId!));
          }}
        />

        {/* Empty State */}
        {memories.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={24} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Nenhuma memória ainda</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Comece adicionando fotos, notas e localizações
            </p>
            <Button 
              className="flex items-center gap-2 min-h-[48px]"
              onClick={() => {
                if ("vibrate" in navigator) navigator.vibrate(10);
              }}
            >
              <Plus size={16} />
              Adicionar Primeira Memória
            </Button>
          </div>
        )}
      </div>
      
      {/* Image Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
      
      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        timelineId={timelineId || ""}
        timelineName={timeline.title}
      />
    </div>
  );
};

export default TimelineDetail;
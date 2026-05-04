import { useState, useEffect } from "react";
import { Clock, Heart, Grid3x3, List, Lock, Users, Calendar, Shield, MoreVertical } from "lucide-react";
import { Timeline } from "@/types/timeline";
import { useTimelines } from "@/lib/api/timelines";
import { timelineFromRow } from "@/lib/api/adapters";
import { cn } from "@/lib/utils";

interface RecentAndFavoritesProps {
  onTimelineClick?: (timeline: Timeline) => void;
  onFavoriteToggle?: (timelineId: string) => void;
}

type FilterType = "all" | "recent" | "favorites" | "protected";
type ViewMode = "list" | "grid";

const RecentAndFavorites = ({ onTimelineClick, onFavoriteToggle }: RecentAndFavoritesProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // Persist view mode preference
    const saved = localStorage.getItem("timeline-view-mode");
    return (saved as ViewMode) || "grid";
  });

  // Persist view mode
  useEffect(() => {
    localStorage.setItem("timeline-view-mode", viewMode);
  }, [viewMode]);
  
  const { data: timelineRows = [] } = useTimelines();
  const allTimelines = timelineRows.map(timelineFromRow);
  const recentTimelines = [...allTimelines]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10);
  const favoriteTimelines = allTimelines.filter(t => t.favorite);
  const protectedTimelines = allTimelines.filter(t => t.isHidden);
  
  // Filter timelines based on active filter
  const getFilteredTimelines = (): Timeline[] => {
    switch (activeFilter) {
      case "recent":
        return recentTimelines;
      case "favorites":
        return favoriteTimelines;
      case "protected":
        return protectedTimelines;
      default:
        return allTimelines;
    }
  };
  
  const currentTimelines = getFilteredTimelines();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays}d`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem`;
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };

  const filters: { id: FilterType; label: string; icon: React.ElementType }[] = [
    { id: "all", label: "Todas", icon: Grid3x3 },
    { id: "recent", label: "Recentes", icon: Clock },
    { id: "favorites", label: "Favoritas", icon: Heart },
    { id: "protected", label: "Protegidas", icon: Shield },
  ];

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
        <Grid3x3 size={28} className="text-muted-foreground/50" />
      </div>
      <h3 className="font-semibold text-foreground/80 mb-2 text-base">
        Nenhuma timeline encontrada
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed">
        {activeFilter === "favorites" 
          ? "Favorite timelines para vê-las aqui"
          : activeFilter === "protected"
          ? "Nenhuma timeline protegida"
          : "Crie sua primeira timeline"
        }
      </p>
    </div>
  );

  // Compact Timeline Card for Grid View
  const TimelineCardGrid = ({ timeline }: { timeline: Timeline }) => (
    <button
      onClick={() => {
        if ("vibrate" in navigator) navigator.vibrate(10);
        onTimelineClick?.(timeline);
      }}
      className="relative w-full h-[172px] rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-all duration-150 active:scale-[0.97] group touch-manipulation"
      aria-label={`Abrir timeline ${timeline.title}`}
    >
      {/* Cover or Gradient */}
      {timeline.cover ? (
        <>
          <img 
            src={timeline.cover} 
            alt={timeline.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
      )}

      {/* Favorite indicator */}
      {timeline.favorite && (
        <div className="absolute top-2 right-2 z-10">
          <Heart size={16} className="text-red-400 fill-red-400" />
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-0 p-3 flex flex-col justify-end">
        <h3 className={cn(
          "font-semibold text-[15px] leading-snug line-clamp-2 mb-1.5 min-h-[40px]",
          timeline.cover ? "text-white" : "text-foreground"
        )}>
          {timeline.title}
        </h3>
        
        {/* Metadata in one line */}
        <div className={cn(
          "flex items-center gap-2 text-xs flex-wrap",
          timeline.cover ? "text-white/90" : "text-muted-foreground"
        )}>
          {timeline.isHidden && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-black/20 backdrop-blur-sm rounded">
              <Shield size={10} />
              <span className="text-[11px]">
                {timeline.authMethod === "biometric" ? "Face ID" : "Senha"}
              </span>
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Users size={11} />
            {timeline.members || 1}
          </span>
          <span>•</span>
          <span>{formatDate(timeline.updatedAt)}</span>
        </div>
      </div>
    </button>
  );

  // Compact Timeline Card for List View
  const TimelineCardList = ({ timeline }: { timeline: Timeline }) => (
    <button
      onClick={() => {
        if ("vibrate" in navigator) navigator.vibrate(10);
        onTimelineClick?.(timeline);
      }}
      className="relative w-full min-h-[80px] rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-all duration-150 active:scale-[0.98] group touch-manipulation flex items-center gap-3 p-3"
      aria-label={`Abrir timeline ${timeline.title}`}
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-muted/30">
        {timeline.cover ? (
          <img 
            src={timeline.cover} 
            alt={timeline.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl">
            📸
          </div>
        )}
        {timeline.isHidden && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center">
            <Shield size={10} className="text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <h3 className="font-semibold text-[15px] text-foreground truncate mb-1">
          {timeline.title}
        </h3>
        
        {/* Metadata in one line */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {timeline.isHidden && (
            <>
              <span className="inline-flex items-center gap-1">
                <Shield size={10} />
                {timeline.authMethod === "biometric" ? "Face ID" : "Senha"}
              </span>
              <span>•</span>
            </>
          )}
          <span className="inline-flex items-center gap-1">
            <Users size={11} />
            {timeline.members || 1}
          </span>
          <span>•</span>
          <span>{formatDate(timeline.updatedAt)}</span>
        </div>
      </div>

      {/* Favorite indicator */}
      {timeline.favorite && (
        <Heart size={14} className="text-red-400 fill-red-400 flex-shrink-0" />
      )}
    </button>
  );

  return (
    <div className="w-full">
      {/* Header with filter chips and view toggle */}
      <div className="mb-4 px-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          {/* Filter chips - scrollable on mobile */}
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2">
              {filters.map((filter) => {
                const Icon = filter.icon;
                const count = filter.id === "all" 
                  ? allTimelines.length
                  : filter.id === "recent"
                  ? recentTimelines.length
                  : filter.id === "favorites"
                  ? favoriteTimelines.length
                  : protectedTimelines.length;

                return (
                  <button
                    key={filter.id}
                    onClick={() => {
                      if ("vibrate" in navigator) navigator.vibrate(10);
                      setActiveFilter(filter.id);
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap touch-manipulation active:scale-95",
                      activeFilter === filter.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                    aria-label={`Filtrar por ${filter.label}`}
                    aria-pressed={activeFilter === filter.id}
                  >
                    <Icon size={14} />
                    <span>{filter.label}</span>
                    {count > 0 && (
                      <span className={cn(
                        "px-1.5 py-0.5 rounded-full text-[10px] font-semibold min-w-[18px] text-center",
                        activeFilter === filter.id
                          ? "bg-white/25 text-white"
                          : "bg-muted/80 text-muted-foreground"
                      )}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center bg-secondary/60 rounded-lg p-0.5 flex-shrink-0">
            <button
              onClick={() => {
                if ("vibrate" in navigator) navigator.vibrate(10);
                setViewMode("list");
              }}
              aria-label="Visualização em lista"
              aria-pressed={viewMode === "list"}
              className={cn(
                "p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded transition-all duration-150 active:scale-95 touch-manipulation",
                viewMode === "list" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => {
                if ("vibrate" in navigator) navigator.vibrate(10);
                setViewMode("grid");
              }}
              aria-label="Visualização em grade"
              aria-pressed={viewMode === "grid"}
              className={cn(
                "p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded transition-all duration-150 active:scale-95 touch-manipulation",
                viewMode === "grid" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Grid3x3 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {currentTimelines.length === 0 ? (
          <EmptyState />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-3">
            {currentTimelines.map((timeline) => (
              <TimelineCardGrid key={timeline.id} timeline={timeline} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {currentTimelines.map((timeline) => (
              <TimelineCardList key={timeline.id} timeline={timeline} />
            ))}
          </div>
        )}
      </div>

      {/* Infinite scroll placeholder - future implementation */}
      {currentTimelines.length > 6 && (
        <div className="px-4 mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Mostrando {currentTimelines.length} timelines
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentAndFavorites;
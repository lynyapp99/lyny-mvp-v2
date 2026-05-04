import { useState, useRef } from "react";
import { Plus, Star, Lock, Circle } from "lucide-react";
import { Timeline } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface TimelineShortcutsProps {
  shortcuts: Timeline[];
  onTimelineClick: (timeline: Timeline) => void;
  onAddShortcut: () => void;
  onRemoveShortcut: (timelineId: string) => void;
  onReorderShortcuts: (fromIndex: number, toIndex: number) => void;
  isEditMode: boolean;
  onEditModeChange: (editMode: boolean) => void;
  isLoading?: boolean;
}

const TimelineShortcuts = ({
  shortcuts,
  onTimelineClick,
  onAddShortcut,
  onRemoveShortcut,
  onReorderShortcuts,
  isEditMode,
  onEditModeChange,
  isLoading = false,
}: TimelineShortcutsProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const touchStartPos = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    if (isEditMode) return;
    
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };

    const timer = setTimeout(() => {
      if ("vibrate" in navigator) {
        navigator.vibrate([10, 10, 10]);
      }
      onEditModeChange(true);
    }, 500);

    setLongPressTimer(timer);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!longPressTimer) return;

    const moveThreshold = 10;
    const dx = Math.abs(e.touches[0].clientX - touchStartPos.current.x);
    const dy = Math.abs(e.touches[0].clientY - touchStartPos.current.y);

    if (dx > moveThreshold || dy > moveThreshold) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    onReorderShortcuts(draggedIndex, dropIndex);
    setDraggedIndex(null);

    if ("vibrate" in navigator) {
      navigator.vibrate([10, 20, 10]);
    }
  };

  const handleRemove = (e: React.MouseEvent, timelineId: string) => {
    e.stopPropagation();
    onRemoveShortcut(timelineId);
  };

  // Usar tamanho padrão (ícone de app) para todos os atalhos

  if (isLoading) {
    return (
      <div className="px-4 mb-8">
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-foreground">Atalhos de Timelines</h2>
          <p className="text-sm text-muted-foreground">Acesso rápido às suas timelines</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(72px,1fr))] gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="w-16 h-16 rounded-[14px]" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 mb-8">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-foreground">Atalhos de Timelines</h2>
        <p className="text-sm text-muted-foreground">Acesso rápido às suas timelines</p>
      </div>

      {shortcuts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 rounded-[14px] bg-muted/30 flex items-center justify-center mb-3">
            <span className="text-2xl">📌</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4 max-w-[200px]">
            Fixe suas timelines favoritas aqui para acesso rápido
          </p>
          <button
            onClick={() => {
              if ("vibrate" in navigator) navigator.vibrate(10);
              onAddShortcut();
            }}
            className="px-4 py-2 min-h-[44px] rounded-pill bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 active:scale-95 transition-all duration-150 touch-manipulation"
            aria-label="Adicionar atalho de timeline"
          >
            Adicionar Atalho
          </button>
        </div>
      ) : (
        <div 
          className="grid grid-cols-[repeat(auto-fit,minmax(72px,1fr))] gap-3"
          style={{
            gridAutoFlow: "dense"
          }}
        >
          {shortcuts.map((timeline, index) => (
            <div
              key={timeline.id}
              className="flex flex-col items-center gap-2"
              draggable={isEditMode}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onTouchStart={(e) => handleTouchStart(e, index)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative">
                <button
                  onClick={() => {
                    if (!isEditMode) {
                      if ("vibrate" in navigator) navigator.vibrate(10);
                      onTimelineClick(timeline);
                    }
                  }}
                  className={cn(
                    "w-16 h-16 rounded-[14px] overflow-hidden relative group transition-all duration-150 active:scale-95 touch-manipulation",
                    "focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2",
                    isEditMode && "animate-wobble cursor-grab active:cursor-grabbing"
                  )}
                  disabled={isEditMode}
                  aria-label={`Abrir timeline ${timeline.title}`}
                >
                  <img
                    src={timeline.cover}
                    alt={timeline.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-1 right-1 flex flex-col gap-1">
                    {timeline.favorite && (
                      <div className="w-4 h-4 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center">
                        <Star className="w-2.5 h-2.5 fill-primary text-primary" />
                      </div>
                    )}
                    {timeline.isHidden && (
                      <div className="w-4 h-4 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center">
                        <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                      </div>
                    )}
                    {timeline.hasNewMemories && (
                      <div className="w-4 h-4 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center">
                        <Circle className="w-2 h-2 fill-primary text-primary" />
                      </div>
                    )}
                  </div>
                </button>

                {/* Remove button */}
                {isEditMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if ("vibrate" in navigator) navigator.vibrate(20);
                      onRemoveShortcut(timeline.id);
                    }}
                    className="absolute -top-1 -right-1 w-6 h-6 min-w-[24px] min-h-[24px] rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs font-bold shadow-md z-10 hover:scale-110 active:scale-100 transition-all duration-150 touch-manipulation"
                    aria-label={`Remover atalho ${timeline.title}`}
                    style={{ padding: '8px' }}
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Label */}
              <span 
                className="text-xs text-foreground line-clamp-1 w-full text-center px-1"
                title={timeline.title}
              >
                {timeline.title}
              </span>
            </div>
          ))}

          {/* Add button - sempre presente */}
          {!isEditMode && (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => {
                  if ("vibrate" in navigator) navigator.vibrate(10);
                  onAddShortcut();
                }}
                className="w-16 h-16 rounded-[14px] border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 active:scale-95 transition-all duration-150 group touch-manipulation"
                aria-label="Adicionar atalho de timeline"
              >
                <Plus className="w-6 h-6 text-muted-foreground/50 group-hover:text-primary/70 transition-colors" />
              </button>
              <span className="text-xs text-muted-foreground text-center">
                Adicionar
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimelineShortcuts;

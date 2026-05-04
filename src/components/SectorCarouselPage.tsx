import { Sector, Timeline } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Lock, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SectorCarouselPageProps {
  sector: Sector;
  timelines: Timeline[];
  onTimelineClick: (timeline: Timeline) => void;
  onAddTimeline: () => void;
  className?: string;
  isActive?: boolean;
  isNeighbor?: boolean;
  currentIndex?: number;
  totalSectors?: number;
  isEditMode?: boolean;
  onRemoveTimeline?: (timelineId: string) => void;
  onDragStart?: (e: React.DragEvent, timelineId: string, sectorId: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, targetSectorId: string) => void;
  onRemoveSector?: (sectorId: string) => void;
}

const SectorCarouselPage = ({ 
  sector, 
  timelines, 
  onTimelineClick, 
  onAddTimeline,
  className,
  isActive = false,
  isNeighbor = false,
  currentIndex = 0,
  totalSectors = 0,
  isEditMode = false,
  onRemoveTimeline,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onRemoveSector,
}: SectorCarouselPageProps) => {
  const colorClasses = {
    pink: "bg-gradient-to-br from-timeline-pink/40 to-timeline-pink/20",
    blue: "bg-gradient-to-br from-timeline-blue/40 to-timeline-blue/20",
    green: "bg-gradient-to-br from-timeline-green/40 to-timeline-green/20",
    yellow: "bg-gradient-to-br from-timeline-yellow/40 to-timeline-yellow/20",
    purple: "bg-gradient-to-br from-timeline-purple/40 to-timeline-purple/20",
    orange: "bg-gradient-to-br from-timeline-orange/40 to-timeline-orange/20",
  };

  const emphasisClass = isActive
    ? "z-10"
    : "opacity-60";

  // Detecta se é setor compacto baseado no número de timelines
  const isCompactSector = timelines.length <= 3;

  return (
    <article 
      role="group"
      aria-label={`Setor ${sector.name}`}
      aria-roledescription="slide do carrossel"
      aria-current={isActive ? "true" : "false"}
      data-sector-card
      data-index={currentIndex}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, sector.id)}
      className={cn(
        "min-w-[90%] max-w-[90%] flex-shrink-0 snap-center scroll-snap-stop-always transform-gpu will-change-transform transition-all duration-300 ease-out relative",
        emphasisClass,
        isEditMode && "animate-wobble",
        className
      )}
    >
      {/* Remove sector button in edit mode */}
      {isEditMode && onRemoveSector && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if ("vibrate" in navigator) navigator.vibrate(20);
            onRemoveSector(sector.id);
          }}
          className="absolute -top-2 -right-2 z-50 w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-destructive text-destructive-foreground shadow-lg flex items-center justify-center hover:scale-110 active:scale-100 transition-all duration-150 touch-manipulation"
          aria-label={`Remover setor ${sector.name}`}
          style={{ padding: '12px' }}
        >
          <span className="text-xl leading-none">×</span>
        </button>
      )}
      
      <div className={cn(
        "w-full rounded-app-xl p-3 pb-8 transition-all duration-300 relative flex flex-col",
        colorClasses[sector.color],
        isActive 
          ? "shadow-2xl ring-2 ring-primary/20" 
          : "shadow-md",
        isCompactSector 
          ? "h-auto min-h-[220px] max-h-[72vh] mb-4" 
          : "h-full"
      )}
      style={!isCompactSector ? {
        minHeight: 'clamp(400px, 52vh, 600px)',
        maxHeight: 'clamp(400px, 58vh, 600px)',
      } : undefined}
      >
        {/* Position Indicator - moved outside for proper stacking */}
        {isActive && totalSectors > 0 && (
          <div className="absolute top-2 right-2 z-20 px-3 py-1.5 bg-foreground/90 backdrop-blur-sm rounded-full shadow-lg">
            <span className="text-xs text-background font-semibold tracking-wide">
              {currentIndex + 1}/{totalSectors}
            </span>
          </div>
        )}

        {/* Sector Header - Compacto */}
        <div className="mb-2 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl" aria-hidden="true">{sector.emoji}</span>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-foreground tracking-tight truncate leading-tight">
                {sector.name} · {timelines.length} {timelines.length === 1 ? 'timeline' : 'timelines'}
              </h2>
            </div>
          </div>
        </div>

        {/* Timelines List - Ocupa altura útil */}
        <div className="flex-1 overflow-y-auto scrollbar-hide scroll-smooth overscroll-none space-y-2 pb-3">
          {timelines.length > 0 ? (
            <>
              {timelines.map((timeline) => (
                <div
                  key={timeline.id}
                  draggable={isEditMode}
                  onDragStart={(e) => onDragStart?.(e, timeline.id, sector.id)}
                  onDragEnd={onDragEnd}
                  className={`relative ${isEditMode ? 'animate-wobble cursor-move' : ''}`}
                >
                  {/* Remove timeline button in edit mode */}
                  {isEditMode && onRemoveTimeline && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if ("vibrate" in navigator) navigator.vibrate(20);
                        onRemoveTimeline(timeline.id);
                      }}
                      className="absolute -top-2 -right-2 z-50 w-9 h-9 min-w-[44px] min-h-[44px] rounded-full bg-destructive text-destructive-foreground shadow-lg flex items-center justify-center hover:scale-110 active:scale-100 transition-all duration-150 touch-manipulation"
                      aria-label={`Remover timeline ${timeline.title}`}
                      style={{ padding: '12px' }}
                    >
                      <span className="text-lg leading-none">×</span>
                    </button>
                  )}
                  <button
                    onClick={isEditMode ? undefined : () => {
                      if ("vibrate" in navigator) navigator.vibrate(10);
                      onTimelineClick(timeline);
                    }}
                    disabled={isEditMode}
                    aria-label={`Abrir timeline ${timeline.title}`}
                    className="w-full text-left rounded-app bg-white/95 backdrop-blur-sm shadow-sm p-2 transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5 hover:bg-white active:scale-[0.97] group touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-100"
                  >
                  <div className="flex items-start gap-2">
                    {/* Thumbnail - Compacto */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted/30 ring-1 ring-black/5">
                        {timeline.cover ? (
                          <img 
                            src={timeline.cover} 
                            alt={`Capa da timeline ${timeline.title}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl" aria-hidden="true">
                            {sector.emoji}
                          </div>
                        )}
                      </div>
                      {timeline.isHidden && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-pill bg-muted/80 flex items-center justify-center shadow-sm">
                          <Lock className="h-2.5 w-2.5 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Content - Densidade alta */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-semibold text-[hsl(var(--accent))] mb-0.5 line-clamp-1 group-hover:brightness-110 transition-all">
                        {timeline.title}
                      </h3>
                      <p className="text-[11px] text-black line-clamp-1 mb-0.5">
                        {timeline.subtitle}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-foreground/60">
                        <span>{timeline.items} memórias</span>
                        <span aria-hidden="true">·</span>
                        <time dateTime={timeline.updatedAt}>
                          {format(new Date(timeline.updatedAt), "d 'de' MMM", { locale: ptBR })}
                        </time>
                      </div>
                    </div>
                  </div>
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-8 px-4" role="status">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted/20 flex items-center justify-center">
                <span className="text-3xl opacity-40" aria-hidden="true">{sector.emoji}</span>
              </div>
              <p className="text-sm font-medium text-foreground/80 mb-1">
                Este setor ainda não tem timelines
              </p>
              <p className="text-xs text-foreground/60">
                Toque no botão abaixo para criar a primeira
              </p>
            </div>
          )}
        </div>

        {/* Floating Add Button - Fixo dentro do setor */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-20" style={{ bottom: 'max(8px, env(safe-area-inset-bottom))' }}>
          <button
            onClick={() => {
              if ("vibrate" in navigator) navigator.vibrate(10);
              onAddTimeline();
            }}
            aria-label="Criar nova timeline"
            className="pointer-events-auto min-w-[48px] min-h-[48px] w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center group touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Plus className="h-6 w-6 group-hover:scale-110 transition-transform" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default SectorCarouselPage;

import { Sector, Timeline } from "@/types/timeline";
import { cn } from "@/lib/utils";
import { Lock, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getSectorIcon } from "@/lib/sectorIcons";

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
    pink: "bg-gradient-to-b from-timeline-pink/25 via-timeline-pink/10 to-background/60",
    blue: "bg-gradient-to-b from-timeline-blue/25 via-timeline-blue/10 to-background/60",
    green: "bg-gradient-to-b from-timeline-green/25 via-timeline-green/10 to-background/60",
    yellow: "bg-gradient-to-b from-timeline-yellow/25 via-timeline-yellow/10 to-background/60",
    purple: "bg-gradient-to-b from-timeline-purple/25 via-timeline-purple/10 to-background/60",
    orange: "bg-gradient-to-b from-timeline-orange/25 via-timeline-orange/10 to-background/60",
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
      <div className={cn(
        "w-full rounded-[28px] p-4 pb-20 transition-all duration-300 relative flex flex-col border border-white/5 backdrop-blur-sm",
        colorClasses[sector.color],
        isActive
          ? "shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
          : "shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)]",
        isCompactSector 
          ? "h-auto min-h-[220px] max-h-[72vh] mb-4" 
          : "h-full"
      )}
      style={!isCompactSector ? {
        minHeight: 'clamp(400px, 52vh, 600px)',
        maxHeight: 'clamp(400px, 58vh, 600px)',
      } : undefined}
      >
        {/* Remove sector button in edit mode — kept inside card bounds */}
        {isEditMode && onRemoveSector && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if ("vibrate" in navigator) navigator.vibrate(20);
              onRemoveSector(sector.id);
            }}
            className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-foreground/85 text-background shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-150 touch-manipulation"
            aria-label={`Remover setor ${sector.name}`}
          >
            <span className="text-base leading-none font-medium">×</span>
          </button>
        )}

        {/* Position Indicator — compact pill */}
        {!isEditMode && isActive && totalSectors > 0 && (
          <div className="absolute top-3 right-3 z-20 px-2 py-0.5 bg-foreground/10 border border-white/10 backdrop-blur-md rounded-full">
            <span className="text-[10px] text-foreground/70 font-medium tracking-wide tabular-nums">
              {currentIndex + 1}/{totalSectors}
            </span>
          </div>
        )}

        {/* Sector Header */}
        <header className="mb-3 flex-shrink-0 pr-14">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-[hsl(var(--accent)/0.12)] border border-[hsl(var(--accent)/0.35)]"
              aria-hidden="true"
            >
              <span
                className="font-dmsans font-semibold leading-none text-[hsl(var(--accent))]"
                style={{ fontSize: "16px" }}
              >
                {(sector.name?.trim()?.charAt(0) || "?").toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-semibold text-foreground tracking-tight truncate leading-tight">
                {sector.name}
              </h2>
              <p className="mt-1.5 text-[11px] font-normal text-foreground/40 tracking-wide leading-none">
                {timelines.length} {timelines.length === 1 ? "timeline" : "timelines"}
              </p>
            </div>
          </div>
        </header>

        {/* Timelines List - Ocupa altura útil */}
        <div className="flex-1 overflow-y-auto scrollbar-hide scroll-smooth overscroll-none space-y-2 pb-2">
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
                      className="absolute top-1.5 right-1.5 z-40 w-7 h-7 rounded-full bg-foreground/85 text-background shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-150 touch-manipulation"
                      aria-label={`Remover timeline ${timeline.title}`}
                    >
                      <span className="text-sm leading-none font-medium">×</span>
                    </button>
                  )}
                  <button
                    onClick={isEditMode ? undefined : () => {
                      if ("vibrate" in navigator) navigator.vibrate(10);
                      onTimelineClick(timeline);
                    }}
                    disabled={isEditMode}
                    aria-label={`Abrir timeline ${timeline.title}`}
                    className="w-full text-left rounded-[20px] bg-foreground/[0.04] hover:bg-foreground/[0.07] border border-white/5 backdrop-blur-sm p-2.5 transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.98] group touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0 disabled:opacity-100 min-h-[72px]"
                  >
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-muted/30 ring-1 ring-white/10">
                        {timeline.cover ? (
                          <img 
                            src={timeline.cover} 
                            alt={`Capa da timeline ${timeline.title}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-foreground/50" aria-hidden="true">
                            {(() => {
                              const Icon = getSectorIcon(sector.emoji);
                              return <Icon className="w-6 h-6" strokeWidth={1.5} />;
                            })()}
                          </div>
                        )}
                      </div>
                      {timeline.isHidden && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-background border border-white/10 flex items-center justify-center shadow-sm">
                          <Lock className="h-2.5 w-2.5 text-foreground/70" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-semibold text-foreground mb-0.5 line-clamp-1 tracking-tight">
                        {timeline.title}
                      </h3>
                      {timeline.subtitle && (
                        <p className="text-[12px] text-foreground/55 line-clamp-1 mb-1">
                          {timeline.subtitle}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 text-[10.5px] text-foreground/45 font-medium">
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
            <div className="text-center py-10 px-4" role="status">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-foreground/5 border border-white/5 flex items-center justify-center text-foreground/40">
                {(() => {
                  const Icon = getSectorIcon(sector.emoji);
                  return <Icon className="w-6 h-6" strokeWidth={1.5} aria-hidden="true" />;
                })()}
              </div>
              <p className="text-[13px] font-medium text-foreground/75 mb-1">
                Este setor ainda não tem timelines
              </p>
              <p className="text-[11px] text-foreground/50">
                Toque em "Nova timeline" abaixo
              </p>
            </div>
          )}
        </div>

        {/* Add timeline — refined pill */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-20" style={{ bottom: 'max(12px, env(safe-area-inset-bottom))' }}>
          <button
            onClick={() => {
              if ("vibrate" in navigator) navigator.vibrate(10);
              onAddTimeline();
            }}
            aria-label="Criar nova timeline"
            className="pointer-events-auto min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-foreground/[0.06] hover:bg-foreground/[0.1] border border-white/10 text-foreground text-[13px] font-medium backdrop-blur-md shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] active:scale-[0.97] transition-all duration-150 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Plus className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
            <span>Nova timeline</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default SectorCarouselPage;

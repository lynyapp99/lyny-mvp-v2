import { cn } from "@/lib/utils";
import { Sector } from "@/types/timeline";

interface CarouselDotsProps {
  total: number;
  activeIndex: number;
  activeColor?: string;
  className?: string;
  sectors?: Sector[];
  onDotClick?: (index: number) => void;
}

const CarouselDots = ({ 
  total, 
  activeIndex, 
  activeColor = "bg-primary", 
  className,
  sectors,
  onDotClick
}: CarouselDotsProps) => {
  const colorMap: Record<string, string> = {
    pink: "hsl(var(--timeline-pink))",
    blue: "hsl(var(--timeline-blue))",
    green: "hsl(var(--timeline-green))",
    yellow: "hsl(var(--timeline-yellow))",
    purple: "hsl(var(--timeline-purple))",
    orange: "hsl(var(--timeline-orange))",
  };

  return (
    <div 
      className={cn("flex items-center justify-center gap-2.5 py-4", className)} 
      role="tablist" 
      aria-label="Navegação do carrossel de setores"
    >
      {Array.from({ length: total }).map((_, index) => {
        const sector = sectors?.[index];
        const isActive = index === activeIndex;
        const dotColor = sector && isActive ? colorMap[sector.color] : undefined;
        
        return (
          <button
            key={index}
            role="tab"
            aria-selected={isActive}
            aria-label={sector ? `Ir para setor ${sector.name}` : `Ir para setor ${index + 1}`}
            aria-controls={sector ? `sector-${sector.id}` : undefined}
            onClick={() => onDotClick?.(index)}
            className={cn(
              "rounded-pill transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              isActive 
                ? "w-10 h-2.5 shadow-sm" 
                : "w-2.5 h-2.5 hover:scale-125 hover:opacity-80 cursor-pointer"
            )}
            style={{
              backgroundColor: isActive && dotColor
                ? dotColor
                : isActive
                  ? "hsl(var(--primary))"
                  : "hsl(var(--muted-foreground) / 0.3)"
            }}
            tabIndex={isActive ? 0 : -1}
          />
        );
      })}
    </div>
  );
};

export default CarouselDots;

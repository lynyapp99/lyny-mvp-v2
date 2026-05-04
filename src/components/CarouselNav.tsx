import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CarouselNavProps {
  onPrev: () => void;
  onNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  className?: string;
}

const CarouselNav = ({ 
  onPrev, 
  onNext, 
  canScrollPrev, 
  canScrollNext,
  className 
}: CarouselNavProps) => {
  return (
    <>
      {/* Previous Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          if ("vibrate" in navigator) navigator.vibrate(10);
          onPrev();
        }}
        disabled={!canScrollPrev}
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 z-10",
          "rounded-pill bg-card/95 backdrop-blur-sm shadow-lg",
          "transition-all duration-150 hover:scale-110 active:scale-95",
          "disabled:opacity-0 disabled:pointer-events-none",
          "focus:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2",
          "min-w-[44px] min-h-[44px] touch-manipulation",
          className
        )}
        aria-label="Ver anterior"
      >
        <ChevronLeft size={20} />
      </Button>

      {/* Next Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          if ("vibrate" in navigator) navigator.vibrate(10);
          onNext();
        }}
        disabled={!canScrollNext}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 z-10",
          "rounded-pill bg-card/95 backdrop-blur-sm shadow-lg",
          "transition-all duration-150 hover:scale-110 active:scale-95",
          "disabled:opacity-0 disabled:pointer-events-none",
          "focus:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2",
          "min-w-[44px] min-h-[44px] touch-manipulation",
          className
        )}
        aria-label="Ver próximo"
      >
        <ChevronRight size={20} />
      </Button>
    </>
  );
};

export default CarouselNav;

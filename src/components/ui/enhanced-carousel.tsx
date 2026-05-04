import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const EnhancedCarousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    snapToCards?: boolean;
    showIndicators?: boolean;
    cardCount?: number;
  }
>(({ className, snapToCards = true, showIndicators = true, cardCount = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative w-full", className)}
    {...props}
  />
))
EnhancedCarousel.displayName = "EnhancedCarousel"

const EnhancedCarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    snapToCards?: boolean;
  }
>(({ className, snapToCards = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex overflow-x-auto scrollbar-hide",
      snapToCards && "snap-x snap-mandatory",
      "scroll-smooth",
      "-ml-2 md:-ml-4",
      className
    )}
    style={{
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}
    {...props}
  />
))
EnhancedCarouselContent.displayName = "EnhancedCarouselContent"

const EnhancedCarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    basis?: string;
    centered?: boolean;
  }
>(({ className, basis = "basis-4/5", centered = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "min-w-0 shrink-0 grow-0 pl-2 md:pl-4",
      basis,
      centered && "snap-center",
      !centered && "snap-start",
      className
    )}
    {...props}
  />
))
EnhancedCarouselItem.displayName = "EnhancedCarouselItem"

const EnhancedCarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg transition-all duration-200",
      "hover:bg-background hover:scale-110 active:scale-95",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only">Previous slide</span>
  </button>
))
EnhancedCarouselPrevious.displayName = "EnhancedCarouselPrevious"

const EnhancedCarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute right-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg transition-all duration-200",
      "hover:bg-background hover:scale-110 active:scale-95",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
    <span className="sr-only">Next slide</span>
  </button>
))
EnhancedCarouselNext.displayName = "EnhancedCarouselNext"

const EnhancedCarouselIndicators = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    count: number;
    activeIndex?: number;
  }
>(({ className, count, activeIndex = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex justify-center gap-1 mt-4", className)}
    {...props}
  >
    {Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        className={cn(
          "w-2 h-2 rounded-full transition-all duration-200",
          index === activeIndex 
            ? "bg-primary scale-110" 
            : "bg-muted hover:bg-muted-foreground/50"
        )}
      />
    ))}
  </div>
))
EnhancedCarouselIndicators.displayName = "EnhancedCarouselIndicators"

export {
  EnhancedCarousel,
  EnhancedCarouselContent,
  EnhancedCarouselItem,
  EnhancedCarouselPrevious,
  EnhancedCarouselNext,
  EnhancedCarouselIndicators,
}
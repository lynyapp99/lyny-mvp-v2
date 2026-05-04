import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  blur?: "sm" | "md" | "lg" | "xl";
  opacity?: "low" | "medium" | "high";
}

const blurClasses = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md", 
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl"
};

const opacityClasses = {
  low: "bg-surface/60 border-divider",
  medium: "bg-surface/80 border-divider", 
  high: "bg-surface/95 border-divider"
};

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, blur = "lg", opacity = "medium", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border backdrop-saturate-150 shadow-md",
          blurClasses[blur],
          opacityClasses[opacity],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
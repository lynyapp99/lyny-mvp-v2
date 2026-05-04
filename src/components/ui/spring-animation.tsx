import * as React from "react";
import { cn } from "@/lib/utils";

interface SpringAnimationProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  trigger?: boolean;
  delay?: number;
  scale?: number;
}

const SpringAnimation = React.forwardRef<HTMLDivElement, SpringAnimationProps>(
  ({ className, children, trigger = true, delay = 0, scale = 1.02, ...props }, ref) => {
    const [isAnimating, setIsAnimating] = React.useState(false);

    React.useEffect(() => {
      if (trigger) {
        const timer = setTimeout(() => {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 200);
        }, delay);
        
        return () => clearTimeout(timer);
      }
    }, [trigger, delay]);

    return (
      <div
        ref={ref}
        className={cn(
          "transition-transform duration-200 ease-out",
          isAnimating && "animate-scale-in",
          className
        )}
        style={{
          transform: isAnimating ? `scale(${scale})` : "scale(1)",
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SpringAnimation.displayName = "SpringAnimation";

export { SpringAnimation };
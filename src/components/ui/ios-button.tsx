import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iosButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-base font-medium transition-all duration-[120ms] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] touch-manipulation",
  {
    variants: {
      variant: {
        primary: "lyny-button-primary",
        secondary: "lyny-button-subtle", 
        ghost: "lyny-button-ghost text-foreground",
        outline: "border border-divider bg-surface text-foreground active:brightness-90",
      },
      size: {
        default: "h-12 px-6 py-3 min-w-[44px] min-h-[44px]",
        sm: "h-10 px-4 py-2 text-sm min-w-[44px] min-h-[44px]",
        lg: "h-14 px-8 py-4 text-lg min-w-[44px] min-h-[44px]",
        icon: "h-12 w-12 min-w-[44px] min-h-[44px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface IOSButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iosButtonVariants> {
  asChild?: boolean;
}

const IOSButton = React.forwardRef<HTMLButtonElement, IOSButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if ("vibrate" in navigator) navigator.vibrate(10);
      onClick?.(e);
    };
    
    return (
      <button
        className={cn(iosButtonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  }
);

IOSButton.displayName = "IOSButton";

export { IOSButton, iosButtonVariants };
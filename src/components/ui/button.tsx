import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap overflow-hidden text-sm font-semibold focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 min-h-[44px] touch-manipulation transition-all duration-[120ms]",
  {
    variants: {
      variant: {
        default: "lyny-button-primary rounded-pill",
        destructive: "bg-destructive text-destructive-foreground shadow-sm active:scale-[0.98] active:brightness-90 rounded-pill",
        outline: "border border-divider bg-surface transition-all active:scale-[0.98] active:brightness-90 rounded-pill text-foreground",
        secondary: "lyny-button-subtle rounded-pill",
        ghost: "lyny-button-ghost rounded-app",
        link: "text-primary underline-offset-4 active:underline transition-all rounded-app",
      },
      size: {
        default: "h-12 px-4 py-3 rounded-pill min-w-[44px]",
        sm: "h-10 px-3 rounded-app-sm min-w-[44px]",
        lg: "h-14 px-6 text-base rounded-pill min-w-[44px]",
        icon: "h-11 w-11 rounded-app min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if ("vibrate" in navigator) navigator.vibrate(10);
      onClick?.(e);
    };
    
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} onClick={asChild ? onClick : handleClick} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

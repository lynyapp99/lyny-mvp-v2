import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 gap-3">
      <div className="w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center mb-1">
        <Icon size={22} className="text-muted-foreground" strokeWidth={1.75} />
      </div>
      <h3 className="font-display font-semibold text-foreground text-lg">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-3">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

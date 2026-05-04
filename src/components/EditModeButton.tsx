import { Edit3, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditModeButtonProps {
  isEditMode: boolean;
  onClick: () => void;
  className?: string;
}

const EditModeButton = ({ isEditMode, onClick, className }: EditModeButtonProps) => {
  return (
    <Button
      size="sm"
      variant={isEditMode ? "default" : "ghost"}
      onClick={() => {
        if ("vibrate" in navigator) navigator.vibrate(isEditMode ? 20 : 10);
        onClick();
      }}
      className={cn(
        "rounded-app w-11 h-11 min-w-[44px] min-h-[44px] p-0 transition-all duration-150",
        isEditMode && "bg-primary text-primary-foreground shadow-lg",
        className
      )}
      aria-label={isEditMode ? "Concluir edição" : "Entrar no modo de edição"}
      aria-pressed={isEditMode}
    >
      {isEditMode ? (
        <Check className="h-5 w-5" />
      ) : (
        <Edit3 className="h-5 w-5" />
      )}
    </Button>
  );
};

export default EditModeButton;

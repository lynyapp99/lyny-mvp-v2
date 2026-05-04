import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddSectorCardProps {
  onClick: () => void;
  isActive: boolean;
  isNeighbor: boolean;
}

const AddSectorCard = ({ onClick, isActive, isNeighbor }: AddSectorCardProps) => {
  return (
    <div
      data-sector-card
      data-index="add"
      className={cn(
        "flex-shrink-0 w-[90%] snap-center transition-all duration-300",
        isActive ? "scale-100 opacity-100" : "scale-95 opacity-60",
        isNeighbor && "scale-[0.97] opacity-80"
      )}
      role="article"
      aria-label="Adicionar novo setor"
    >
      <button
        onClick={() => {
          if ("vibrate" in navigator) navigator.vibrate(10);
          onClick();
        }}
        className={cn(
          "w-full h-full rounded-3xl border-2 border-dashed",
          "border-muted-foreground/30 bg-muted/10",
          "flex flex-col items-center justify-center gap-4",
          "transition-all duration-150",
          "hover:border-primary/50 hover:bg-primary/5",
          "active:scale-[0.97]",
          "focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2",
          "touch-manipulation"
        )}
        style={{
          minHeight: 'clamp(400px, 52vh, 600px)',
          maxHeight: 'clamp(400px, 58vh, 600px)',
        }}
        aria-label="Criar novo setor"
      >
        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
          <Plus className="w-10 h-10 text-muted-foreground" />
        </div>
        
        <div className="text-center px-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Adicionar Setor
          </h3>
          <p className="text-sm text-muted-foreground max-w-[240px]">
            Organize suas timelines criando um novo setor
          </p>
        </div>
      </button>
    </div>
  );
};

export default AddSectorCard;

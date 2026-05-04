import { Star, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FlagshipCalloutProps {
  onViewTimeline?: () => void;
}

const FlagshipCallout = ({ onViewTimeline }: FlagshipCalloutProps) => {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl border border-primary/20">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-primary/20 rounded-xl">
          <Star size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-primary">Timeline em destaque</h3>
          <p className="text-xs text-primary/80">Exemplo de memórias compartilhadas</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-foreground">Nossas aventuras gastronômicas</h4>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users size={14} />
              2 membros
            </span>
            <span>138 memórias</span>
            <span>Timeline de casal em destaque</span>
          </div>
        </div>
        
        {onViewTimeline && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewTimeline}
            className="flex items-center gap-2 text-primary hover:text-primary"
          >
            Ver
            <ArrowRight size={14} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FlagshipCallout;
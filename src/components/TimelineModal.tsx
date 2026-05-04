import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Timeline } from "@/types/timeline";
import { toast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (timeline: Partial<Timeline>) => void;
  editingTimeline?: Timeline | null;
  sectorId?: string | null;
}

const TimelineModal = ({ isOpen, onClose, onSave, editingTimeline, sectorId = null }: TimelineModalProps) => {
  const [title, setTitle] = useState(editingTimeline?.title || "");
  const [subtitle, setSubtitle] = useState(editingTimeline?.subtitle || "");
  const [isHidden, setIsHidden] = useState(editingTimeline?.isHidden || false);
  const [privacy, setPrivacy] = useState<Timeline["privacy"]>(editingTimeline?.privacy || "private");

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Ops! 😊",
        description: "Por favor, dê um título à sua timeline.",
        variant: "destructive",
      });
      return;
    }

    onSave({
      title: title.trim(),
      subtitle: subtitle.trim(),
      sectorId,
      isHidden,
      privacy,
    });

    toast({
      title: "Prontinho! 🎉",
      description: editingTimeline 
        ? "Timeline atualizada com sucesso." 
        : "Timeline criada com carinho.",
    });

    onClose();
    setTitle("");
    setSubtitle("");
    setIsHidden(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] md:max-w-md rounded-app-xl">
        <DialogHeader>
          <DialogTitle className="text-[22px]">
            {editingTimeline ? "Editar Timeline" : "Nova Timeline"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="timeline-title">Título</Label>
            <Input
              id="timeline-title"
              placeholder="Ex: Viagem em Família, Nosso Restaurante..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-app"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline-subtitle">Descrição (opcional)</Label>
            <Textarea
              id="timeline-subtitle"
              placeholder="Uma breve descrição da timeline..."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="rounded-app resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 px-4 rounded-app bg-muted/30">
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Timeline Oculta</p>
                  <p className="text-xs text-muted-foreground">
                    Requer autenticação para acessar
                  </p>
                </div>
              </div>
              <Switch
                checked={isHidden}
                onCheckedChange={setIsHidden}
              />
            </div>

            <div className="space-y-2">
              <Label>Privacidade</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "private", label: "Privado", emoji: "🔒" },
                  { value: "shared", label: "Compartilhado", emoji: "👥" },
                  { value: "public", label: "Público", emoji: "🌍" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPrivacy(option.value as Timeline["privacy"])}
                    className={`
                      py-3 rounded-app transition-lyny text-center
                      ${privacy === option.value 
                        ? "bg-accent text-accent-foreground scale-105 shadow-md" 
                        : "bg-muted/50 hover:bg-muted"}
                    `}
                  >
                    <div className="text-lg">{option.emoji}</div>
                    <div className="text-xs font-medium mt-1">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="rounded-pill">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="rounded-pill">
            {editingTimeline ? "Salvar" : "Criar Timeline"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TimelineModal;

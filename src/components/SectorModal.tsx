import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sector } from "@/types/timeline";
import { toast } from "@/hooks/use-toast";

interface SectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sector: Omit<Sector, "id" | "members" | "timelineIds">) => void;
  editingSector?: Sector | null;
}

const colorOptions: Array<{ value: Sector["color"]; label: string; class: string }> = [
  { value: "pink", label: "Rosa", class: "bg-timeline-pink" },
  { value: "blue", label: "Azul", class: "bg-timeline-blue" },
  { value: "green", label: "Verde", class: "bg-timeline-green" },
  { value: "yellow", label: "Amarelo", class: "bg-timeline-yellow" },
  { value: "purple", label: "Roxo", class: "bg-timeline-purple" },
  { value: "orange", label: "Laranja", class: "bg-timeline-orange" },
];

const emojiOptions = ["💛", "💕", "🎉", "🏡", "🚀", "💼", "🎨", "🎮", "📚", "✨", "🌟", "🔥"];

const SectorModal = ({ isOpen, onClose, onSave, editingSector }: SectorModalProps) => {
  const [name, setName] = useState(editingSector?.name || "");
  const [selectedColor, setSelectedColor] = useState<Sector["color"]>(editingSector?.color || "pink");
  const [selectedEmoji, setSelectedEmoji] = useState(editingSector?.emoji || "💛");

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Ops! 😊",
        description: "Por favor, dê um nome ao seu setor.",
        variant: "destructive",
      });
      return;
    }

    onSave({
      name: name.trim(),
      color: selectedColor,
      emoji: selectedEmoji,
    });

    toast({
      title: "Prontinho! 🎉",
      description: editingSector 
        ? "Setor atualizado com sucesso." 
        : "Setor criado com carinho.",
    });

    onClose();
    setName("");
    setSelectedColor("pink");
    setSelectedEmoji("💛");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] md:max-w-md rounded-app-xl">
        <DialogHeader>
          <DialogTitle className="text-[22px]">
            {editingSector ? "Editar Setor" : "Novo Setor"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="sector-name">Nome do Setor</Label>
            <Input
              id="sector-name"
              placeholder="Nome do setor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-app"
            />
          </div>

          <div className="space-y-2">
            <Label>Ícone</Label>
            <div className="grid grid-cols-6 gap-2">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`
                    h-12 rounded-app text-2xl transition-lyny
                    ${selectedEmoji === emoji 
                      ? "bg-accent scale-110 shadow-md" 
                      : "bg-muted/50 hover:bg-muted"}
                  `}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="grid grid-cols-3 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`
                    h-16 rounded-app transition-lyny ${color.class}
                    ${selectedColor === color.value 
                      ? "ring-2 ring-foreground ring-offset-2 scale-105 shadow-lg" 
                      : "hover:scale-105"}
                  `}
                >
                  <span className="text-sm font-medium text-graphite">
                    {color.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="rounded-pill">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="rounded-pill">
            {editingSector ? "Salvar" : "Criar Setor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SectorModal;

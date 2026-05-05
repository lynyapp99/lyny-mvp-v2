import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sector } from "@/types/timeline";
import { toast } from "@/hooks/use-toast";
import { SECTOR_ICON_OPTIONS, getSectorIcon } from "@/lib/sectorIcons";

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

const SectorModal = ({ isOpen, onClose, onSave, editingSector }: SectorModalProps) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [selectedColor, setSelectedColor] = useState<Sector["color"]>(editingSector?.color || "pink");
  const [selectedIcon, setSelectedIcon] = useState(editingSector?.emoji || "folder");

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      if (nameRef.current) nameRef.current.value = editingSector?.name || "";
      setSelectedColor(editingSector?.color || "pink");
      setSelectedIcon(editingSector?.emoji || "folder");
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, editingSector]);

  const handleSave = () => {
    const name = nameRef.current?.value.trim() ?? "";
    if (!name) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, dê um nome ao seu setor.",
        variant: "destructive",
      });
      return;
    }

    onSave({
      name,
      color: selectedColor,
      emoji: selectedIcon,
    });

    toast({
      title: "Pronto",
      description: editingSector 
        ? "Setor atualizado com sucesso." 
        : "Setor criado com sucesso.",
    });

    onClose();
    if (nameRef.current) nameRef.current.value = "";
    setSelectedColor("pink");
    setSelectedIcon("folder");
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
              ref={nameRef}
              placeholder="Nome do setor"
              defaultValue={editingSector?.name || ""}
              className="rounded-app"
            />
          </div>

          <div className="space-y-2">
            <Label>Ícone</Label>
            <div className="grid grid-cols-6 gap-2">
              {SECTOR_ICON_OPTIONS.map((opt) => {
                const Icon = getSectorIcon(opt.value);
                const isSelected = selectedIcon === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedIcon(opt.value)}
                    aria-label={opt.label}
                    className={`h-12 rounded-app flex items-center justify-center transition-lyny ${
                      isSelected
                        ? "bg-accent text-accent-foreground scale-110 shadow-md"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.75} />
                  </button>
                );
              })}
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

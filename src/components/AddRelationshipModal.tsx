import { useState } from "react";
import { X, Plus, Users, Heart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createRelationship, type Relationship } from "@/data/relationshipData";
import { RELATIONSHIP_ICON_OPTIONS } from "@/lib/relationshipIcons";

interface AddRelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRelationshipAdded?: (relationship: Relationship) => void;
  onSuccess?: (relationshipId: string) => void;
}

const AddRelationshipModal = ({ isOpen, onClose, onRelationshipAdded, onSuccess }: AddRelationshipModalProps) => {
  const [relationshipName, setRelationshipName] = useState("");
  const [selectedType, setSelectedType] = useState<"one-to-one" | "group">("one-to-one");
  const [selectedColor, setSelectedColor] = useState<"pink" | "blue" | "green" | "yellow" | "purple" | "orange">("pink");
  const [selectedIcon, setSelectedIcon] = useState<string>("heart");

  const colors = [
    { value: "pink", label: "Rosa", class: "bg-pink-500" },
    { value: "blue", label: "Azul", class: "bg-blue-500" },
    { value: "green", label: "Verde", class: "bg-green-500" },
    { value: "yellow", label: "Amarelo", class: "bg-yellow-500" },
    { value: "purple", label: "Roxo", class: "bg-purple-500" },
    { value: "orange", label: "Laranja", class: "bg-orange-500" },
  ] as const;

  const relationshipTypes = [
    {
      value: "one-to-one",
      label: "Um-pra-um",
      description: "Relacionamento privado com uma pessoa",
      icon: Heart,
    },
    {
      value: "group",
      label: "Grupo",
      description: "Espaço compartilhado com várias pessoas",
      icon: Users,
    },
  ] as const;

  const handleSubmit = () => {
    if (!relationshipName.trim()) return;

    const newRelationship = createRelationship({
      name: relationshipName,
      type: selectedType,
      members: [], // Will be populated when adding members
      timelineIds: [],
      isPinned: false,
      color: selectedColor,
      emoji: selectedIcon,
      privacy: selectedType === "one-to-one" ? "private" : "shared",
      canEdit: ["u1"],
      canView: ["u1"],
    });

    onRelationshipAdded?.(newRelationship);
    onSuccess?.(newRelationship.id);
    handleClose();
  };

  const handleClose = () => {
    setRelationshipName("");
    setSelectedType("one-to-one");
    setSelectedColor("pink");
    setSelectedIcon("heart");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Novo relacionamento</DialogTitle>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-surface-2 transition-colors"
            >
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Relationship Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nome do relacionamento
            </Label>
            <Input
              id="name"
              placeholder="Ex.: Ana & eu, Família, Time"
              value={relationshipName}
              onChange={(e) => setRelationshipName(e.target.value)}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Relationship Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tipo</Label>
            <div className="grid gap-3">
              {relationshipTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      selectedType === type.value
                        ? "border-primary bg-primary/5"
                        : "border-divider hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      selectedType === type.value ? "bg-primary text-primary-foreground" : "bg-surface-2"
                    }`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{type.label}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        {type.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Color Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Acento</Label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-10 h-10 rounded-xl ${color.class} transition-all ${
                    selectedColor === color.value
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                      : "hover:scale-105"
                  }`}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Ícone</Label>
            <div className="grid grid-cols-6 gap-2">
              {RELATIONSHIP_ICON_OPTIONS.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedIcon(key)}
                  aria-label={label}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    selectedIcon === key
                      ? "bg-primary text-primary-foreground scale-110"
                      : "bg-surface-2 hover:bg-surface-2/80 text-foreground hover:scale-105"
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!relationshipName.trim()}
              className="flex-1"
            >
              <Plus size={16} className="mr-2" />
              Criar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddRelationshipModal;
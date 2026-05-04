import { useState } from "react";
import { MoreVertical, Pin, Edit3, Trash2, Users, Eye, EyeOff, Heart } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type Relationship, toggleRelationshipPin, updateRelationshipName, deleteRelationship } from "@/data/relationshipData";
import { getRelationshipIcon } from "@/lib/relationshipIcons";

interface RelationshipCardProps extends Relationship {
  onUpdate?: () => void;
  onPin?: (id: string) => void;
  onClick?: () => void;
}

const RelationshipCard = ({ 
  id, 
  name, 
  type, 
  members, 
  timelineIds, 
  isPinned, 
  color, 
  emoji, 
  privacy,
  onUpdate, 
  onPin, 
  onClick 
}: RelationshipCardProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(name);
  const RelIcon = getRelationshipIcon(emoji);

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleRelationshipPin(id);
    onPin?.(id);
    onUpdate?.();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (editName.trim() && editName !== name) {
      updateRelationshipName(id, editName.trim());
      onUpdate?.();
    }
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setEditName(name);
    setIsEditingName(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteRelationship(id);
    onUpdate?.();
  };

  return (
    <>
      <div
        onClick={onClick}
        className="bg-surface border border-divider rounded-app-xl p-4 cursor-pointer
                   transition-lyny hover:border-primary/30 hover:-translate-y-[2px]
                   active:scale-[0.99] relative"
      >
        {/* Pin indicator */}
        {isPinned && (
          <div className="absolute top-3 right-3">
            <div className="p-1 rounded-full bg-primary/15">
              <Pin size={12} className="text-primary" fill="currentColor" />
            </div>
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-divider flex items-center justify-center shrink-0">
              <RelIcon className="w-6 h-6 text-foreground" strokeWidth={1.75} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-title text-foreground leading-tight">
                  {name}
                </h3>
                {type === "one-to-one" && (
                  <Heart size={14} className="text-primary" fill="currentColor" />
                )}
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  <span>{members.length} membro{members.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-1">
                  {privacy === "private" ? (
                    <EyeOff size={12} />
                  ) : (
                    <Eye size={12} />
                  )}
                  <span className="capitalize">{privacy === "private" ? "privado" : privacy === "shared" ? "compartilhado" : "público"}</span>
                </div>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full hover:bg-surface-2 transition-colors"
              >
                <MoreVertical size={16} className="text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit3 size={16} className="mr-2" />
                Renomear
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePin}>
                <Pin size={16} className="mr-2" />
                {isPinned ? "Desafixar da Home" : "Fixar na Home"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 size={16} className="mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Members preview */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {members.slice(0, 4).map((member, index) => (
              <img
                key={member.id}
                src={member.avatar}
                alt={member.name}
                className="w-8 h-8 rounded-full border-2 border-surface"
                style={{ zIndex: 4 - index }}
              />
            ))}
            {members.length > 4 && (
              <div className="w-8 h-8 rounded-full bg-surface-2 border-2 border-surface flex items-center justify-center">
                <span className="text-xs font-medium text-foreground">
                  +{members.length - 4}
                </span>
              </div>
            )}
          </div>

          <div className="text-right">
            <div className="text-foreground font-semibold">
              {timelineIds.length}
            </div>
            <div className="text-muted-foreground text-xs">
              timeline{timelineIds.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Name Dialog */}
      <Dialog open={isEditingName} onOpenChange={setIsEditingName}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Renomear Relacionamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Digite o novo nome..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName();
                if (e.key === 'Escape') handleCancelEdit();
              }}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveName}
                disabled={!editName.trim()}
                className="flex-1"
              >
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RelationshipCard;
import { useState } from "react";
import { Search, X, Check } from "lucide-react";
import { Timeline } from "@/types/timeline";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AddShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTimelines: (timelines: Timeline[]) => void;
  availableTimelines: Timeline[];
  maxShortcuts: number;
  currentShortcutsCount: number;
}

const AddShortcutModal = ({
  isOpen,
  onClose,
  onAddTimelines,
  availableTimelines,
  maxShortcuts,
  currentShortcutsCount,
}: AddShortcutModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const remainingSlots = Math.max(0, maxShortcuts - currentShortcutsCount);
  const canAddMore = remainingSlots > 0;

  const filteredTimelines = availableTimelines.filter((timeline) => {
    const matchesSearch =
      timeline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      timeline.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      timeline.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleConfirmAdd = () => {
    if (!canAddMore || selectedIds.size === 0) return;
    const toAdd = availableTimelines.filter(t => selectedIds.has(t.id)).slice(0, remainingSlots);
    if (toAdd.length === 0) return;
    onAddTimelines(toAdd);
    setSelectedIds(new Set());
    setSearchQuery("");
    onClose();
  };
  const handleClose = () => {
    setSelectedIds(new Set());
    setSearchQuery("");
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent className="max-h-[85vh] flex flex-col">
        <div className="mx-auto w-[92vw] max-w-md flex flex-col h-full">
          <DrawerHeader className="border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle>Adicionar Atalho</DrawerTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentShortcutsCount} de {maxShortcuts} atalhos
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DrawerHeader>

          <div className="p-4 space-y-4 overflow-y-auto flex-1 pb-28">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar timelines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-11 rounded-pill"
                aria-label="Buscar timelines"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    if ("vibrate" in navigator) navigator.vibrate(10);
                    setSearchQuery("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 min-w-[36px] min-h-[36px] flex items-center justify-center hover:bg-muted rounded-full transition-all duration-150 active:scale-95 touch-manipulation"
                  aria-label="Limpar busca"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Timeline List */}
            {!canAddMore ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📌</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Você já atingiu o limite de {maxShortcuts} atalhos.
                  <br />
                  Remova um atalho para adicionar outro.
                </p>
              </div>
            ) : filteredTimelines.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔍</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "Nenhuma timeline encontrada"
                    : "Nenhuma timeline disponível"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTimelines.map((timeline) => {
                  const isSelected = selectedIds.has(timeline.id);

                  return (
                    <button
                      key={timeline.id}
                      onClick={() => {
                        if ("vibrate" in navigator) navigator.vibrate(10);
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(timeline.id)) {
                            next.delete(timeline.id);
                          } else if (next.size < remainingSlots) {
                            next.add(timeline.id);
                          }
                          return next;
                        });
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 min-h-[80px] rounded-2xl transition-all duration-150 touch-manipulation",
                        "hover:bg-muted/50 active:scale-[0.98]",
                        isSelected && "bg-primary/10 ring-2 ring-primary/50"
                      )}
                      aria-label={`${isSelected ? 'Remover' : 'Adicionar'} ${timeline.title}`}
                      aria-pressed={isSelected}
                    >
                      {/* Timeline Cover */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={timeline.cover}
                          alt={timeline.title}
                          className="w-14 h-14 rounded-xl object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 rounded-xl bg-primary/20 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-4 h-4 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Timeline Info */}
                      <div className="flex-1 text-left min-w-0">
                        <h4 className="font-medium text-foreground truncate">
                          {timeline.title}
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {timeline.subtitle}
                        </p>
                        
                        {/* Badges */}
                        <div className="flex items-center gap-2 mt-1">
                          {timeline.favorite && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              ⭐
                            </Badge>
                          )}
                          {timeline.isHidden && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              🔒
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {timeline.items} itens
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Fixed bottom action bar overlay */}
          <div className="fixed inset-x-0 bottom-0 z-[102] pointer-events-none">
            <div className="mx-auto w-[92vw] max-w-md p-4 border-t border-border bg-background/95 backdrop-blur-xl pb-[max(1rem,env(safe-area-inset-bottom))] pointer-events-auto">
              <Button
                onClick={() => {
                  if ("vibrate" in navigator) navigator.vibrate([10, 20, 10]);
                  handleConfirmAdd();
                }}
                disabled={!canAddMore || selectedIds.size === 0 || selectedIds.size > remainingSlots}
                className="w-full rounded-pill h-11 min-h-[48px] touch-manipulation"
                aria-label={`Adicionar ${selectedIds.size} ${selectedIds.size === 1 ? 'atalho' : 'atalhos'}`}
              >
                {selectedIds.size > 1
                  ? `Adicionar ${Math.min(selectedIds.size, remainingSlots)} Atalhos`
                  : "Adicionar Atalho"}
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddShortcutModal;

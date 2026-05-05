import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (text: string) => Promise<void> | void;
}

const NoteComposer = ({ open, onOpenChange, onSave }: Props) => {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [saving, setSaving] = useState(false);

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (open && !wasOpenRef.current) {
      if (textRef.current) textRef.current.value = "";
    }
    wasOpenRef.current = open;
  }, [open]);

  const handleSave = async () => {
    const v = textRef.current?.value.trim() ?? "";
    if (!v) return;
    setSaving(true);
    try {
      await onSave(v);
      if (textRef.current) textRef.current.value = "";
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!saving) onOpenChange(v); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova nota</DialogTitle>
        </DialogHeader>
        <textarea
          ref={textRef}
          defaultValue=""
          rows={6}
          placeholder="Escreva sua nota..."
          className="w-full px-4 py-3 bg-muted/50 rounded-xl border-0 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteComposer;
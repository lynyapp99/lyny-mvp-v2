import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Timeline, Sector } from "@/types/timeline";
import { toast } from "@/hooks/use-toast";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { uploadTimelineCover } from "@/lib/api/storage";
import { cn } from "@/lib/utils";

const NO_SECTOR = "__none__";
const NEW_SECTOR = "__new__";

export interface CreateTimelineInput {
  title: string;
  subtitle: string;
  sectorId: string | null;
  newSectorName?: string;
  coverUrl?: string;
}

interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: CreateTimelineInput) => Promise<void> | void;
  sectors: Sector[];
  defaultSectorId?: string | null;
}

const TimelineModal = ({
  isOpen,
  onClose,
  onSave,
  sectors,
  defaultSectorId = null,
}: TimelineModalProps) => {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  // Uncontrolled inputs — refs, no re-render per keystroke.
  const titleRef = useRef<HTMLInputElement>(null);
  const subtitleRef = useRef<HTMLTextAreaElement>(null);
  const newSectorNameRef = useRef<HTMLInputElement>(null);
  const coverFileRef = useRef<File | null>(null);

  // Minimal state for things that genuinely affect render.
  const [sectorChoice, setSectorChoice] = useState<string>(defaultSectorId ?? NO_SECTOR);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      if (titleRef.current) titleRef.current.value = "";
      if (subtitleRef.current) subtitleRef.current.value = "";
      if (newSectorNameRef.current) newSectorNameRef.current.value = "";
      coverFileRef.current = null;
      setSectorChoice(defaultSectorId ?? NO_SECTOR);
      setCoverPreview(null);
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, defaultSectorId]);

  const handlePickCover = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Arquivo inválido", description: "Selecione uma imagem.", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Arquivo grande demais", description: "Máximo 10MB.", variant: "destructive" });
      return;
    }
    coverFileRef.current = file;
    const reader = new FileReader();
    reader.onload = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const title = titleRef.current?.value.trim() ?? "";
    const subtitle = subtitleRef.current?.value.trim() ?? "";
    const newSectorName = newSectorNameRef.current?.value.trim() ?? "";
    if (!title) {
      toast({ title: "Nome obrigatório", description: "Dê um nome à sua timeline.", variant: "destructive" });
      return;
    }
    if (sectorChoice === NEW_SECTOR && !newSectorName) {
      toast({ title: "Nome do setor", description: "Digite um nome para o novo setor.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      let coverUrl: string | undefined;
      const coverFile = coverFileRef.current;
      if (coverFile && user) {
        setUploading(true);
        coverUrl = await uploadTimelineCover(user.id, coverFile);
        setUploading(false);
      }

      const sectorId =
        sectorChoice === NO_SECTOR
          ? null
          : sectorChoice === NEW_SECTOR
            ? null // resolved in parent via newSectorName
            : sectorChoice;

      await onSave({
        title,
        subtitle,
        sectorId,
        newSectorName: sectorChoice === NEW_SECTOR ? newSectorName : undefined,
        coverUrl,
      });

      onClose();
    } catch (e: unknown) {
      toast({
        title: "Não foi possível criar",
        description: e instanceof Error ? e.message : String(e),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => (!o ? onClose() : undefined)}>
      <DialogContent className="max-w-[92vw] md:max-w-md rounded-app-xl">
        <DialogHeader>
          <DialogTitle className="text-[22px]">Nova Timeline</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Cover */}
          <div className="space-y-2">
            <Label>Capa</Label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handlePickCover(f);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className={cn(
                "relative w-full h-36 rounded-app-xl border border-dashed border-border bg-muted/20 overflow-hidden flex items-center justify-center transition active:scale-[0.99] touch-manipulation",
                coverPreview && "border-solid"
              )}
              aria-label="Escolher foto de capa"
            >
              {coverPreview ? (
                <>
                  <img src={coverPreview} alt="Pré-visualização da capa" className="absolute inset-0 w-full h-full object-cover" />
                  <span
                    role="button"
                    aria-label="Remover capa"
                    onClick={(e) => {
                      e.stopPropagation();
                      coverFileRef.current = null;
                      setCoverPreview(null);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center text-muted-foreground">
                  <ImagePlus className="h-6 w-6 mb-1" />
                  <span className="text-sm">Toque para escolher uma foto</span>
                </div>
              )}
            </button>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="timeline-title">Nome *</Label>
            <Input
              id="timeline-title"
              ref={titleRef}
              placeholder="Nome da timeline"
              defaultValue=""
              className="rounded-app"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="timeline-subtitle">Descrição (opcional)</Label>
            <Textarea
              id="timeline-subtitle"
              ref={subtitleRef}
              placeholder="Uma breve descrição"
              defaultValue=""
              className="rounded-app resize-none"
              rows={3}
            />
          </div>

          {/* Sector selector */}
          <div className="space-y-2">
            <Label>Setor</Label>
            <Select value={sectorChoice} onValueChange={setSectorChoice}>
              <SelectTrigger className="rounded-app">
                <SelectValue placeholder="Sem setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_SECTOR}>Sem setor</SelectItem>
                {sectors.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
                <SelectItem value={NEW_SECTOR}>+ Criar novo setor</SelectItem>
              </SelectContent>
            </Select>

            {sectorChoice === NEW_SECTOR && (
              <Input
                ref={newSectorNameRef}
                placeholder="Nome do novo setor"
                defaultValue=""
                className="rounded-app mt-2"
              />
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="rounded-pill" disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="rounded-pill" disabled={saving}>
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {uploading ? "Enviando capa…" : "Criando…"}
              </span>
            ) : (
              "Criar Timeline"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TimelineModal;

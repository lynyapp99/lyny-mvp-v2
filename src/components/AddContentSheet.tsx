import { useRef } from "react";
import { Camera, Video, FileText } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onPickPhotos: (files: File[]) => void;
  onPickVideos: (files: File[]) => void;
  onWriteNote: () => void;
}

const AddContentSheet = ({ open, onOpenChange, onPickPhotos, onPickVideos, onWriteNote }: Props) => {
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const haptic = () => {
    if ("vibrate" in navigator) navigator.vibrate(10);
  };

  const options = [
    {
      id: "photo",
      icon: Camera,
      label: "Foto",
      desc: "Enviar fotos da galeria",
      onClick: () => {
        haptic();
        photoRef.current?.click();
      },
    },
    {
      id: "video",
      icon: Video,
      label: "Vídeo",
      desc: "Enviar vídeos da galeria",
      onClick: () => {
        haptic();
        videoRef.current?.click();
      },
    },
    {
      id: "note",
      icon: FileText,
      label: "Nota",
      desc: "Escrever um texto",
      onClick: () => {
        haptic();
        onWriteNote();
      },
    },
  ];

  return (
    <>
      <input
        ref={photoRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onPickPhotos(files);
          e.target.value = "";
        }}
      />
      <input
        ref={videoRef}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onPickVideos(files);
          e.target.value = "";
        }}
      />
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Adicionar à timeline</SheetTitle>
          </SheetHeader>
          <div className="space-y-2 py-4">
            {options.map((o) => {
              const Icon = o.icon;
              return (
                <button
                  key={o.id}
                  onClick={o.onClick}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-card hover:bg-muted/50 active:scale-[0.98] transition-all min-h-[64px] text-left touch-manipulation"
                >
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Icon size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{o.label}</div>
                    <div className="text-sm text-muted-foreground">{o.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AddContentSheet;
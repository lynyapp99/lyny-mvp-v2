import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { FeedItem } from "@/lib/api/memories";

interface Props {
  items: FeedItem[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}

const MediaViewer = ({ items, index, onClose, onNavigate }: Props) => {
  const item = items[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) onNavigate(index - 1);
      if (e.key === "ArrowRight" && index < items.length - 1) onNavigate(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, onClose, onNavigate]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center"
        aria-label="Fechar"
      >
        <X size={22} />
      </button>

      {index > 0 && (
        <button
          onClick={() => onNavigate(index - 1)}
          className="absolute left-2 z-10 w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center"
          aria-label="Anterior"
        >
          <ChevronLeft size={22} />
        </button>
      )}
      {index < items.length - 1 && (
        <button
          onClick={() => onNavigate(index + 1)}
          className="absolute right-2 z-10 w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center"
          aria-label="Próxima"
        >
          <ChevronRight size={22} />
        </button>
      )}

      <div className="w-full h-full flex items-center justify-center p-4">
        {item.kind === "video" ? (
          <video
            key={item.id}
            src={item.mediaUrl ?? undefined}
            controls
            autoPlay
            playsInline
            className="max-w-full max-h-full"
          />
        ) : (
          <img
            src={item.mediaUrl ?? undefined}
            alt=""
            className="max-w-full max-h-full object-contain"
          />
        )}
      </div>
    </div>
  );
};

export default MediaViewer;
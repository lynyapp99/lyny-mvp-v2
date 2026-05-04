import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { FeedItem } from "@/lib/api/memories";

interface Props {
  items: FeedItem[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}

const MediaViewer = ({ items, index, onClose, onNavigate }: Props) => {
  const item = items[index];
  const startX = useRef<number | null>(null);
  const deltaX = useRef(0);
  const [dragX, setDragX] = useState(0);

  // Pinch zoom state (single-image)
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const pinchRef = useRef<{ d: number; s: number; cx: number; cy: number; tx: number; ty: number } | null>(null);

  useEffect(() => {
    // Reset zoom when item changes
    setScale(1);
    setTx(0);
    setTy(0);
  }, [index]);

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

  const dist = (a: Touch, b: Touch) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const [a, b] = [e.touches[0], e.touches[1]];
      pinchRef.current = {
        d: dist(a, b),
        s: scale,
        cx: (a.clientX + b.clientX) / 2,
        cy: (a.clientY + b.clientY) / 2,
        tx,
        ty,
      };
      startX.current = null;
    } else if (e.touches.length === 1 && scale === 1) {
      startX.current = e.touches[0].clientX;
      deltaX.current = 0;
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current && item.kind === "photo") {
      const [a, b] = [e.touches[0], e.touches[1]];
      const newD = dist(a, b);
      const ratio = newD / pinchRef.current.d;
      const newScale = Math.max(1, Math.min(4, pinchRef.current.s * ratio));
      setScale(newScale);
    } else if (e.touches.length === 1 && scale > 1) {
      // Pan when zoomed
      // Use simple delta from initial pinch position
    } else if (e.touches.length === 1 && startX.current !== null) {
      deltaX.current = e.touches[0].clientX - startX.current;
      setDragX(deltaX.current);
    }
  };

  const onTouchEnd = () => {
    pinchRef.current = null;
    if (startX.current !== null) {
      const threshold = 60;
      if (deltaX.current < -threshold && index < items.length - 1) {
        onNavigate(index + 1);
      } else if (deltaX.current > threshold && index > 0) {
        onNavigate(index - 1);
      }
      startX.current = null;
      deltaX.current = 0;
      setDragX(0);
    }
  };

  const onDoubleClick = () => {
    if (item.kind !== "photo") return;
    setScale((s) => (s > 1 ? 1 : 2));
    setTx(0);
    setTy(0);
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black flex items-center justify-center select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <button
        onClick={onClose}
        className="absolute z-10 w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center active:scale-95 transition-transform"
        style={{
          top: "calc(env(safe-area-inset-top) + 12px)",
          right: "16px",
        }}
        aria-label="Fechar"
      >
        <X size={22} />
      </button>

      <div
        className="w-full h-full flex items-center justify-center overflow-hidden"
        style={{
          transform: `translateX(${dragX}px)`,
          transition: dragX === 0 ? "transform 200ms ease-out" : "none",
        }}
        onDoubleClick={onDoubleClick}
      >
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
            draggable={false}
            className="max-w-full max-h-full object-contain"
            style={{
              transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
              transition: pinchRef.current ? "none" : "transform 150ms ease-out",
              touchAction: "none",
            }}
          />
        )}
      </div>

      {/* Indicador de posição */}
      {items.length > 1 && (
        <div
          className="absolute left-1/2 -translate-x-1/2 flex gap-1.5"
          style={{ bottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
        >
          {items.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "bg-white w-6" : "bg-white/40 w-1.5"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaViewer;

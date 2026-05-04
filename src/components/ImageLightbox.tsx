import { useState, useEffect } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Button } from "@/components/ui/button";

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const ImageLightbox = ({ images, initialIndex, isOpen, onClose }: ImageLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (e.key === "ArrowRight" && currentIndex < images.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    };

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("keydown", handleArrowKeys);

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("keydown", handleArrowKeys);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, currentIndex, images.length]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center touch-manipulation"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-[101] bg-gradient-to-b from-black/70 to-transparent p-4 safe-area-inset-top">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <span className="text-white text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if ("vibrate" in navigator) navigator.vibrate(10);
              onClose();
            }}
            className="text-white hover:bg-white/10 rounded-full min-w-[44px] min-h-[44px]"
            aria-label="Fechar"
          >
            <X size={24} />
          </Button>
        </div>
      </div>

      {/* Image with Zoom */}
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={5}
        centerOnInit
        wheel={{ step: 0.2 }}
        doubleClick={{ mode: "toggle", step: 0.7 }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <TransformComponent
              wrapperClass="!w-full !h-full flex items-center justify-center"
              contentClass="!w-auto !h-auto"
            >
              <img
                src={images[currentIndex]}
                alt={`Imagem ${currentIndex + 1}`}
                className="max-w-full max-h-screen object-contain"
              />
            </TransformComponent>

            {/* Zoom Controls */}
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[101] flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full p-2 safe-area-inset-bottom">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if ("vibrate" in navigator) navigator.vibrate(10);
                  zoomOut();
                }}
                className="text-white hover:bg-white/10 rounded-full h-10 w-10"
                aria-label="Diminuir zoom"
              >
                <ZoomOut size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if ("vibrate" in navigator) navigator.vibrate(10);
                  resetTransform();
                }}
                className="text-white hover:bg-white/10 rounded-full h-10 w-10"
                aria-label="Resetar zoom"
              >
                <span className="text-xs">1:1</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if ("vibrate" in navigator) navigator.vibrate(10);
                  zoomIn();
                }}
                className="text-white hover:bg-white/10 rounded-full h-10 w-10"
                aria-label="Aumentar zoom"
              >
                <ZoomIn size={20} />
              </Button>
            </div>
          </>
        )}
      </TransformWrapper>

      {/* Navigation */}
      {images.length > 1 && (
        <>
          {currentIndex > 0 && (
            <button
              onClick={() => {
                if ("vibrate" in navigator) navigator.vibrate(10);
                setCurrentIndex(prev => prev - 1);
              }}
              className="fixed left-4 top-1/2 -translate-y-1/2 z-[101] p-3 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 transition-all duration-150 active:scale-95 min-w-[48px] min-h-[48px] touch-manipulation"
              aria-label="Imagem anterior"
            >
              <span className="text-2xl">‹</span>
            </button>
          )}
          {currentIndex < images.length - 1 && (
            <button
              onClick={() => {
                if ("vibrate" in navigator) navigator.vibrate(10);
                setCurrentIndex(prev => prev + 1);
              }}
              className="fixed right-4 top-1/2 -translate-y-1/2 z-[101] p-3 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 transition-all duration-150 active:scale-95 min-w-[48px] min-h-[48px] touch-manipulation"
              aria-label="Próxima imagem"
            >
              <span className="text-2xl">›</span>
            </button>
          )}
        </>
      )}

      {/* Swipe hint */}
      <div className="fixed bottom-4 left-0 right-0 z-[101] text-center safe-area-inset-bottom">
        <p className="text-white/60 text-xs">
          👆 Arraste para mover • Pinça para zoom • Toque duplo para ampliar
        </p>
      </div>
    </div>
  );
};

export default ImageLightbox;

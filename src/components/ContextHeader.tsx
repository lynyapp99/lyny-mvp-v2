import { ChevronLeft, Share2, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ContextHeaderProps {
  title: string;
  onBack?: () => void;
  onShare?: () => void;
  showShare?: boolean;
  onInvite?: () => void;
  showInvite?: boolean;
}

const ContextHeader = ({ title, onBack, onShare, showShare = true, onInvite, showInvite = false }: ContextHeaderProps) => {
  const navigate = useNavigate();
  return (
    <header
      className="sticky top-0 z-40 bg-background"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between gap-2 relative">
        <button
          onClick={() => {
            if ("vibrate" in navigator) navigator.vibrate(10);
            onBack ? onBack() : navigate(-1);
          }}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-app text-foreground active:scale-95 transition-transform"
          aria-label="Voltar"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <h1 className="absolute left-1/2 -translate-x-1/2 max-w-[60%] truncate text-base font-semibold text-foreground text-center">
          {title}
        </h1>

        <div className="flex items-center gap-1">
          {showInvite && (
            <button
              onClick={() => {
                if ("vibrate" in navigator) navigator.vibrate(10);
                onInvite?.();
              }}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-app text-foreground active:scale-95 transition-transform"
              aria-label="Convidar"
            >
              <UserPlus className="h-5 w-5" />
            </button>
          )}
          {showShare ? (
            <button
              onClick={() => {
                if ("vibrate" in navigator) navigator.vibrate(10);
                onShare?.();
              }}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-app text-foreground active:scale-95 transition-transform"
              aria-label="Compartilhar"
            >
              <Share2 className="h-5 w-5" />
            </button>
          ) : (
            !showInvite && <span className="w-11" />
          )}
        </div>
      </div>
    </header>
  );
};

export default ContextHeader;
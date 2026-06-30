import { ChevronLeft, Share2, UserPlus, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type HeaderMenuItem = {
  label: string;
  onClick: () => void;
  destructive?: boolean;
};

interface ContextHeaderProps {
  title: string;
  onBack?: () => void;
  onShare?: () => void;
  showShare?: boolean;
  onInvite?: () => void;
  showInvite?: boolean;
  menuItems?: HeaderMenuItem[];
}

const ContextHeader = ({ title, onBack, onShare, showShare = true, onInvite, showInvite = false, menuItems }: ContextHeaderProps) => {
  const navigate = useNavigate();
  const hasMenu = !!menuItems && menuItems.length > 0;
  return (
    <header
      className="sticky top-0 z-40 ios-glass-md !rounded-none ios-hairline-b"
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
            !showInvite && !hasMenu && <span className="w-11" />
          )}
          {hasMenu && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={() => "vibrate" in navigator && navigator.vibrate(10)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-app text-foreground active:scale-95 transition-transform"
                  aria-label="Mais opções"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[200px]">
                {menuItems!.map((item) => (
                  <DropdownMenuItem
                    key={item.label}
                    onClick={item.onClick}
                    className={item.destructive ? "text-destructive focus:text-destructive" : ""}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default ContextHeader;
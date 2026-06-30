import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/lib/api/timelines";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, ReactNode } from "react";
import LynyLogo from "@/components/LynyLogo";

interface AppHeaderProps {
  /** Optional content rendered inside the drawer opened from the hamburger menu. */
  drawerContent?: ReactNode;
  /** Optional override for menu click (e.g. open settings sheet). When set, drawer is not used. */
  onMenuClick?: () => void;
}

const AppHeader = ({ drawerContent, onMenuClick }: AppHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const [open, setOpen] = useState(false);

  const initials = (
    profile?.display_name ||
    profile?.username ||
    user?.email ||
    "?"
  )
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const MenuBtn = (
    <button
      onClick={() => {
        if ("vibrate" in navigator) navigator.vibrate(10);
        if (onMenuClick) onMenuClick();
        else setOpen(true);
      }}
      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-app text-foreground active:scale-95 transition-transform touch-manipulation"
      aria-label="Abrir menu"
    >
      <Menu className="h-6 w-6" />
    </button>
  );

  return (
    <header
      className="sticky top-0 z-40 ios-glass-md !rounded-none ios-hairline-b"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between relative">
        {onMenuClick ? (
          MenuBtn
        ) : (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{MenuBtn}</SheetTrigger>
            <SheetContent side="left" className="p-6">
              {drawerContent ?? (
                <div className="text-sm text-muted-foreground pt-8">
                  Em breve.
                </div>
              )}
            </SheetContent>
          </Sheet>
        )}

        <div className="absolute left-1/2 -translate-x-1/2 text-foreground select-none">
          <LynyLogo height={28} />
        </div>

        <button
          onClick={() => {
            if ("vibrate" in navigator) navigator.vibrate(10);
            navigate("/profile");
          }}
          className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/60"
          aria-label="Ir para o perfil"
        >
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={profile?.avatar_url ?? undefined} alt="" />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
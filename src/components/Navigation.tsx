import { Home, Users, Plus, Bell, User } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Início", path: "/home" },
    { icon: Users, label: "Relacionamentos", path: "/relationships" },
    { icon: Plus, label: "Criar", path: "/create" },
    { icon: Bell, label: "Notificações", path: "/notifications" },
    { icon: User, label: "Perfil", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-background/85 backdrop-blur-2xl border-t border-border/50" />

      <div
        className="relative max-w-md mx-auto px-2 pt-4"
        style={{ paddingBottom: "calc(20px + env(safe-area-inset-bottom))" }}
      >
        <div className="flex justify-around items-center">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path;

            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center justify-center min-h-[48px] min-w-[48px] rounded-app transition-all duration-150 active:scale-95 touch-manipulation ${
                  isActive
                    ? "text-primary bg-primary/15"
                    : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/40"
                }`}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                onClick={() => {
                  if ("vibrate" in navigator) navigator.vibrate(10);
                }}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
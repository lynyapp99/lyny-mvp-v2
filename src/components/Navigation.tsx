import { Home, Users, Plus, Bell, User } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/glass-card";

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
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom">
      {/* Camada de background sólida para garantir contraste */}
      <div className="absolute inset-0 bg-background/80 dark:bg-background/85 backdrop-blur-2xl border-t border-border/50" />
      
      <div className="relative max-w-md mx-auto px-1 py-0.5 pb-safe">
        <div className="flex justify-around items-center">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path;
            
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center justify-center min-h-[56px] min-w-[56px] py-1.5 px-2 rounded-app transition-all duration-150 active:scale-95 touch-manipulation ${
                  isActive
                    ? "text-primary bg-primary/15"
                    : "text-foreground/75 hover:text-foreground hover:bg-muted/40"
                }`}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                onClick={() => {
                  if ("vibrate" in navigator) navigator.vibrate(10);
                }}
              >
                <Icon 
                  size={22} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`mb-0.5 transition-transform ${isActive ? "fill-current scale-110" : ""}`} 
                />
                <span className={`text-xs font-medium leading-tight ${isActive ? "font-semibold" : ""}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
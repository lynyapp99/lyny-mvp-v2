import { useState } from "react";
import { ArrowLeft, Settings, Bell, Shield, HelpCircle, LogOut, User, Lock, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import PrivacySecuritySettings from "./PrivacySecuritySettings";
import HiddenTimelinesAccess from "./HiddenTimelinesAccess";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/lib/api/timelines";
import { useNavigate } from "react-router-dom";

interface SettingsScreenProps {
  onBack: () => void;
  onPrivacySettings: () => void;
}

type SettingsView = "main" | "privacy" | "hiddenAccess";

const SettingsScreen = ({ onBack, onPrivacySettings }: SettingsScreenProps) => {
  const [currentView, setCurrentView] = useState<SettingsView>("main");
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const displayName = profile?.display_name || profile?.username || user?.email?.split("@")[0] || "Você";
  const email = user?.email ?? "";

  const settingsItems = [
    {
      icon: User,
      label: "Conta",
      description: "Gerencie as preferências da sua conta",
      onClick: () => {},
    },
    {
      icon: Bell,
      label: "Notificações",
      description: "Controle quando e como ser notificado",
      onClick: () => {},
    },
    {
      icon: Shield,
      label: "Privacidade e segurança",
      description: "Gerencie suas configurações de privacidade",
      onClick: () => setCurrentView("privacy"),
    },
    {
      icon: HelpCircle,
      label: "Ajuda e suporte",
      description: "Tire dúvidas ou fale com o suporte",
      onClick: () => {},
    },
  ];

  const advancedItems = [
    {
      icon: Lock,
      label: "Segurança avançada",
      description: "Opções de armazenamento seguro",
      onClick: () => setCurrentView("hiddenAccess"),
      isAdvanced: true,
    },
  ];

  if (currentView === "privacy") {
    return (
      <PrivacySecuritySettings
        onBack={() => setCurrentView("main")}
        onManagePublicProfile={onPrivacySettings}
      />
    );
  }

  if (currentView === "hiddenAccess") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 px-4 py-6 border-b border-border bg-background">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if ("vibrate" in navigator) navigator.vibrate(10);
                setCurrentView("main");
              }}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-muted rounded-xl transition-all duration-150 active:scale-95 touch-manipulation"
              aria-label="Voltar"
            >
              <ArrowLeft size={20} className="text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Segurança Avançada</h1>
              <p className="text-sm text-muted-foreground">Acesso ao armazenamento seguro</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <HiddenTimelinesAccess onAccess={() => window.location.href = '/hidden-timelines'} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header fixo */}
      <div className="flex-shrink-0 px-4 py-6 border-b border-border bg-background">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if ("vibrate" in navigator) navigator.vibrate(10);
              onBack();
            }}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-muted rounded-xl transition-all duration-150 active:scale-95 touch-manipulation"
            aria-label="Voltar"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
            <p className="text-sm text-muted-foreground">Gerencie sua conta e preferências</p>
          </div>
        </div>
      </div>
      
      {/* Conteúdo scrollável */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Account Summary */}
        <div className="p-4 bg-card rounded-2xl border border-border mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-semibold text-primary">
                {displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-medium text-foreground">{displayName}</div>
              <div className="text-sm text-muted-foreground">{email}</div>
            </div>
          </div>
        </div>

        {/* Settings Menu Items */}
        <div className="space-y-2 mb-8">
          {settingsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  if ("vibrate" in navigator) navigator.vibrate(10);
                  item.onClick();
                }}
                className="w-full flex items-center gap-3 p-4 min-h-[72px] rounded-xl hover:bg-muted/50 active:scale-[0.98] transition-all duration-150 text-left touch-manipulation"
                aria-label={item.label}
              >
                <div className="p-2 bg-muted/50 rounded-lg flex-shrink-0">
                  <Icon size={20} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{item.label}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Advanced Options - Discrete */}
        <div className="mt-8">
          <button
            onClick={() => {
              if ("vibrate" in navigator) navigator.vibrate(10);
              setShowAdvancedOptions(!showAdvancedOptions);
            }}
            className="w-full text-left text-xs text-muted-foreground hover:text-foreground transition-colors p-2 min-h-[44px] touch-manipulation"
            aria-label={`${showAdvancedOptions ? 'Ocultar' : 'Mostrar'} opções avançadas`}
            aria-expanded={showAdvancedOptions}
          >
            Opções Avançadas {showAdvancedOptions ? '−' : '+'}
          </button>
          
          {showAdvancedOptions && (
            <div className="mt-4 space-y-2">
              {advancedItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if ("vibrate" in navigator) navigator.vibrate(10);
                      item.onClick();
                    }}
                    className="w-full flex items-center gap-3 p-3 min-h-[64px] rounded-xl hover:bg-muted/50 active:scale-[0.98] transition-all duration-150 text-left opacity-60 hover:opacity-100 touch-manipulation"
                    aria-label={item.label}
                  >
                    <div className="p-2 bg-muted/50 rounded-lg flex-shrink-0">
                      <Icon size={18} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground text-sm">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <div className="mb-8">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 px-1">
            Aparência
          </div>
          <div className="p-4 bg-card rounded-app border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-muted/50 rounded-lg flex-shrink-0">
                {theme === "light" ? (
                  <Sun size={22} className="text-muted-foreground" />
                ) : (
                  <Moon size={22} className="text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground">Tema</div>
                <div className="text-sm text-muted-foreground">Escolha entre escuro e claro</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  if ("vibrate" in navigator) navigator.vibrate(10);
                  setTheme("dark");
                }}
                className={`flex items-center justify-center gap-2 py-3 rounded-app border transition-all ${
                  theme === "dark"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-foreground border-border hover:bg-muted/40"
                }`}
                aria-pressed={theme === "dark"}
              >
                <Moon size={18} />
                <span className="text-sm font-medium">Escuro</span>
              </button>
              <button
                onClick={() => {
                  if ("vibrate" in navigator) navigator.vibrate(10);
                  setTheme("light");
                }}
                className={`flex items-center justify-center gap-2 py-3 rounded-app border transition-all ${
                  theme === "light"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-foreground border-border hover:bg-muted/40"
                }`}
                aria-pressed={theme === "light"}
              >
                <Sun size={18} />
                <span className="text-sm font-medium">Claro</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <div className="mt-8 pt-6 border-t border-border">
          <button 
            onClick={async () => {
              if ("vibrate" in navigator) navigator.vibrate(20);
              await signOut();
              navigate("/auth", { replace: true });
            }}
            className="w-full flex items-center gap-3 p-3 min-h-[64px] rounded-xl hover:bg-destructive/10 active:scale-[0.98] transition-all duration-150 text-left touch-manipulation"
            aria-label="Sair da conta"
          >
            <div className="p-2 bg-destructive/10 rounded-lg flex-shrink-0">
              <LogOut size={18} className="text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-destructive">Sair</div>
              <div className="text-xs text-muted-foreground">Sair da sua conta</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
import { useState } from "react";
import { ArrowLeft, Settings, Bell, Shield, HelpCircle, LogOut, User, Lock } from "lucide-react";
import { mockUserProfile } from "@/data/profileData";
import PrivacySecuritySettings from "./PrivacySecuritySettings";
import HiddenTimelinesAccess from "./HiddenTimelinesAccess";

interface SettingsScreenProps {
  onBack: () => void;
  onPrivacySettings: () => void;
}

type SettingsView = "main" | "privacy" | "hiddenAccess";

const SettingsScreen = ({ onBack, onPrivacySettings }: SettingsScreenProps) => {
  const [currentView, setCurrentView] = useState<SettingsView>("main");
  const [user] = useState(mockUserProfile);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const settingsItems = [
    {
      icon: User,
      label: "Account Settings",
      description: "Manage your account preferences",
      onClick: () => console.log("Account Settings"),
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Control when and how you're notified",
      onClick: () => console.log("Notifications"),
    },
    {
      icon: Shield,
      label: "Privacy & Security",
      description: "Manage your privacy settings",
      onClick: () => setCurrentView("privacy"),
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get help or contact support",
      onClick: () => console.log("Help"),
    },
  ];

  const advancedItems = [
    {
      icon: Lock,
      label: "Advanced Security",
      description: "Access secure storage options",
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
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <div className="font-medium text-foreground">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
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

        {/* Sign Out */}
        <div className="mt-8 pt-6 border-t border-border">
          <button 
            onClick={() => {
              if ("vibrate" in navigator) navigator.vibrate(20);
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
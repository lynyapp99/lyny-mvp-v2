import { useState } from "react";
import { ArrowLeft, Shield, Globe, Eye, EyeOff, Users, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { mockUserProfile, togglePublicProfile } from "@/data/profileData";
import { useToast } from "@/hooks/use-toast";

interface PrivacySecuritySettingsProps {
  onBack: () => void;
  onManagePublicProfile: () => void;
}

const PrivacySecuritySettings = ({ onBack, onManagePublicProfile }: PrivacySecuritySettingsProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    publicProfileEnabled: mockUserProfile.publicProfile.enabled,
    allowTimelineSharing: mockUserProfile.privacy.allowTimelineSharing,
    showMembersInPublic: mockUserProfile.privacy.showMembersInPublic,
    twoFactorAuth: false,
    dataDownload: false,
  });

  const handlePublicProfileToggle = (enabled: boolean) => {
    setSettings({ ...settings, publicProfileEnabled: enabled });
    togglePublicProfile(enabled);
    
    if (enabled) {
      toast({
        title: "Public profile enabled",
        description: "You can now customize and share your profile.",
      });
    } else {
      toast({
        title: "Public profile disabled",
        description: "Your profile is now private and not shareable.",
      });
    }
  };

  const privacySettings = [
    {
      id: "publicProfile",
      icon: Globe,
      title: "Public Profile",
      description: "Allow others to view your shared timelines",
      value: settings.publicProfileEnabled,
      onChange: handlePublicProfileToggle,
      hasManage: true,
    },
    {
      id: "timelineSharing",
      icon: Users,
      title: "Timeline Sharing",
      description: "Allow timelines to be shared outside relationships",
      value: settings.allowTimelineSharing,
      onChange: (value: boolean) => setSettings({ ...settings, allowTimelineSharing: value }),
    },
    {
      id: "showMembers",
      icon: Eye,
      title: "Show Members Publicly",
      description: "Display member names in public timeline views",
      value: settings.showMembersInPublic,
      onChange: (value: boolean) => setSettings({ ...settings, showMembersInPublic: value }),
      disabled: !settings.publicProfileEnabled,
    },
  ];

  const securitySettings = [
    {
      id: "twoFactor",
      icon: Shield,
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      value: settings.twoFactorAuth,
      onChange: (value: boolean) => setSettings({ ...settings, twoFactorAuth: value }),
    },
  ];

  const dataSettings = [
    {
      id: "dataDownload",
      icon: Shield,
      title: "Download Your Data",
      description: "Export all your timelines and memories",
      value: false,
      isAction: true,
      onClick: () => toast({ title: "Data export started", description: "You'll receive an email when ready." }),
    },
  ];

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
            <h1 className="text-2xl font-bold text-foreground">Privacidade e Segurança</h1>
            <p className="text-sm text-muted-foreground">Controle seus dados e visibilidade</p>
          </div>
        </div>
      </div>

      {/* Conteúdo scrollável */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-6">
        {/* Privacy Settings */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Privacy</h3>
          <div className="space-y-1">
            {privacySettings.map((setting, index) => {
              const Icon = setting.icon;
              return (
                <div key={setting.id}>
                  <div className={`flex items-center justify-between p-4 rounded-2xl ${
                    setting.disabled ? "opacity-50" : ""
                  }`}>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-muted/50 rounded-xl">
                        <Icon size={20} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{setting.title}</div>
                        <div className="text-sm text-muted-foreground">{setting.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {setting.hasManage && setting.value && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if ("vibrate" in navigator) navigator.vibrate(10);
                            onManagePublicProfile();
                          }}
                          className="text-xs"
                        >
                          Gerenciar
                        </Button>
                      )}
                      <Switch
                        checked={setting.value}
                        onCheckedChange={setting.onChange}
                        disabled={setting.disabled}
                      />
                    </div>
                  </div>
                  {index < privacySettings.length - 1 && <Separator className="my-1" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Settings */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Security</h3>
          <div className="space-y-1">
            {securitySettings.map((setting, index) => {
              const Icon = setting.icon;
              return (
                <div key={setting.id}>
                  <div className="flex items-center justify-between p-4 rounded-2xl">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-muted/50 rounded-xl">
                        <Icon size={20} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{setting.title}</div>
                        <div className="text-sm text-muted-foreground">{setting.description}</div>
                      </div>
                    </div>
                    <Switch
                      checked={setting.value}
                      onCheckedChange={setting.onChange}
                    />
                  </div>
                  {index < securitySettings.length - 1 && <Separator className="my-1" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Settings */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Your Data</h3>
          <div className="space-y-1">
            {dataSettings.map((setting, index) => {
              const Icon = setting.icon;
              return (
                <div key={setting.id}>
                  <button
                    onClick={() => {
                      if ("vibrate" in navigator) navigator.vibrate(10);
                      setting.onClick?.();
                    }}
                    className="w-full flex items-center justify-between p-4 min-h-[72px] rounded-2xl hover:bg-muted/50 active:scale-[0.98] transition-all duration-150 touch-manipulation"
                    aria-label={setting.title}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-muted/50 rounded-xl">
                        <Icon size={20} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-foreground">{setting.title}</div>
                        <div className="text-sm text-muted-foreground">{setting.description}</div>
                      </div>
                    </div>
                    <div className="text-sm text-primary font-medium">Exportar</div>
                  </button>
                  {index < dataSettings.length - 1 && <Separator className="my-1" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Account Deletion */}
        <div className="pt-4 border-t border-destructive/20">
          <button 
            onClick={() => {
              if ("vibrate" in navigator) navigator.vibrate(20);
            }}
            className="w-full p-4 min-h-[72px] bg-destructive/10 border border-destructive/20 rounded-2xl 
                       hover:bg-destructive/20 active:scale-[0.98] transition-all duration-150 text-left touch-manipulation"
            aria-label="Excluir conta permanentemente"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/20 rounded-xl flex-shrink-0">
                <Lock size={20} className="text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-destructive">Excluir Conta</div>
                <div className="text-sm text-destructive/80">Deletar permanentemente sua conta e dados</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default PrivacySecuritySettings;
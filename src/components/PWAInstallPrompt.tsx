import { Download, X } from "lucide-react";
import { Button } from "./ui/button";
import { usePWA } from "@/hooks/usePWA";

const PWAInstallPrompt = () => {
  const { isInstallable, installApp, updateAvailable, updateApp, dismissUpdate } = usePWA();

  // Show update notification
  if (updateAvailable) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto animate-slide-in-bottom">
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                Nova versão disponível
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Atualize agora para ter acesso às últimas melhorias
              </p>
              <div className="flex gap-2">
                <Button onClick={updateApp} size="sm">
                  Atualizar
                </Button>
                <Button onClick={dismissUpdate} variant="ghost" size="sm">
                  Depois
                </Button>
              </div>
            </div>
            <button
              onClick={dismissUpdate}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show install prompt (only on first visit, not if already installed)
  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto animate-slide-in-bottom">
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Download size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              Instalar Lyny
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Adicione o app à sua tela inicial para acesso rápido
            </p>
            <Button onClick={installApp} size="sm" className="w-full">
              Instalar App
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;

import { useState } from "react";
import { Lock, Fingerprint, Shield, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HiddenTimelineAuthProps {
  authMethod: "biometric" | "password";
  onSuccess: () => void;
  onCancel: () => void;
}

const HiddenTimelineAuth = ({
  authMethod,
  onSuccess,
  onCancel,
}: HiddenTimelineAuthProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState("");

  const handleBiometricAuth = async () => {
    setIsAuthenticating(true);
    setError("");
    
    // Check if Web Authentication API is available
    if (!window.PublicKeyCredential) {
      setError("Autenticação biométrica não disponível. Use senha: demo123");
      setIsAuthenticating(false);
      return;
    }
    
    try {
      // Simulate biometric authentication
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate success/failure
          const success = Math.random() > 0.2; // 80% success rate for demo
          if (success) {
            resolve(true);
          } else {
            reject(new Error("Autenticação biométrica falhou"));
          }
        }, 1500);
      });
      
      if ("vibrate" in navigator) navigator.vibrate([10, 20, 10]);
      onSuccess();
    } catch (error) {
      setError("Autenticação falhou. Tente novamente ou use senha: demo123");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handlePasswordAuth = () => {
    if (!password.trim()) {
      setError("Digite sua senha");
      return;
    }
    
    setIsAuthenticating(true);
    setError("");
    
    // Simulate password verification
    setTimeout(() => {
      // In a real app, this would verify against the stored hash
      if (password === "demo123") { // Demo password
        if ("vibrate" in navigator) navigator.vibrate([10, 20, 10]);
        onSuccess();
      } else {
        setError("Senha incorreta. Tente novamente.");
        setIsAuthenticating(false);
        if ("vibrate" in navigator) navigator.vibrate(50);
      }
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && authMethod === "password") {
      handlePasswordAuth();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4 touch-manipulation">
      <div className="bg-card rounded-2xl max-w-sm w-full p-6 relative shadow-2xl">
        <button
          onClick={() => {
            if ("vibrate" in navigator) navigator.vibrate(10);
            onCancel();
          }}
          className="absolute top-4 right-4 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-muted rounded-full transition-all duration-150 active:scale-95 touch-manipulation"
          aria-label="Cancelar autenticação"
        >
          <X size={20} className="text-muted-foreground" />
        </button>

        <div className="text-center mb-6">
          <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
            <Lock size={32} className="text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Timeline Oculta
          </h2>
          <p className="text-muted-foreground text-sm">
            Esta timeline requer autenticação
          </p>
        </div>

        {authMethod === "biometric" ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="p-6 bg-muted/50 rounded-2xl mb-4">
                <Fingerprint 
                  size={48} 
                  className={`mx-auto mb-2 ${isAuthenticating ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} 
                />
                <p className="text-sm text-muted-foreground">
                  {isAuthenticating ? "Autenticando..." : "Use Face ID ou Touch ID para desbloquear"}
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
                <p className="text-destructive text-sm text-center">{error}</p>
              </div>
            )}

            <Button
              onClick={handleBiometricAuth}
              disabled={isAuthenticating}
              className="w-full py-3 min-h-[48px] rounded-2xl touch-manipulation"
              aria-label="Autenticar com biometria"
            >
              <Fingerprint size={16} className="mr-2" />
              {isAuthenticating ? "Autenticando..." : "Usar Biometria"}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-2">
              Ou use a senha de demonstração: <span className="font-mono font-semibold">demo123</span>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua senha"
                  className="w-full px-4 py-3 pr-12 bg-muted/50 rounded-2xl border-0 
                           text-foreground placeholder:text-muted-foreground
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card
                           min-h-[48px]"
                  aria-label="Campo de senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-muted rounded-lg transition-all duration-150 active:scale-95 touch-manipulation"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff size={16} className="text-muted-foreground" />
                  ) : (
                    <Eye size={16} className="text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
                <p className="text-destructive text-sm text-center">{error}</p>
              </div>
            )}

            <Button
              onClick={handlePasswordAuth}
              disabled={isAuthenticating || !password.trim()}
              className="w-full py-3 min-h-[48px] rounded-2xl touch-manipulation"
              aria-label="Desbloquear timeline"
            >
              <Shield size={16} className="mr-2" />
              {isAuthenticating ? "Verificando..." : "Desbloquear"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Senha de demonstração: <span className="font-mono font-semibold">demo123</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HiddenTimelineAuth;
import { useState } from "react";
import { Shield, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HiddenTimelinesAccessProps {
  onAccess: () => void;
}

const HiddenTimelinesAccess = ({ onAccess }: HiddenTimelinesAccessProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState("");

  const handleAccess = () => {
    if (!password.trim()) {
      setError("Digite a senha de acesso");
      return;
    }
    
    setIsAuthenticating(true);
    setError("");
    
    // Simular verificação de senha para área de timelines hidden
    setTimeout(() => {
      if (password === "secure123") { // Senha para acesso à área hidden
        onAccess();
      } else {
        setError("Senha incorreta. Tente novamente.");
        setIsAuthenticating(false);
      }
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAccess();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="p-3 bg-muted/50 rounded-full w-fit mx-auto mb-3">
          <Lock size={24} className="text-muted-foreground" />
        </div>
        <h3 className="font-medium text-foreground mb-1">Área Restrita</h3>
        <p className="text-sm text-muted-foreground">
          Acesso às timelines protegidas
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Senha de Acesso
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite a senha de acesso"
            className="w-full px-4 py-3 pr-12 bg-muted/50 rounded-2xl border-0 
                     text-foreground placeholder:text-muted-foreground
                     focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-lg transition-colors"
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
        onClick={handleAccess}
        disabled={isAuthenticating || !password.trim()}
        className="w-full py-3 rounded-2xl"
      >
        <Shield size={16} className="mr-2" />
        {isAuthenticating ? "Verificando..." : "Acessar Área Restrita"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Senha demo: <span className="font-mono bg-muted px-1 rounded">secure123</span>
      </p>
    </div>
  );
};

export default HiddenTimelinesAccess;
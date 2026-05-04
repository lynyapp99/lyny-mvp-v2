import { Lock, Shield, Fingerprint } from "lucide-react";

interface HiddenTimelineCardProps {
  id: string;
  authMethod: "biometric" | "password";
  onClick?: () => void;
}

const HiddenTimelineCard = ({
  id,
  authMethod,
  onClick,
}: HiddenTimelineCardProps) => {
  return (
    <div
      onClick={onClick}
      className="timeline-card group cursor-pointer w-72 flex-shrink-0"
    >
      <div className="relative h-40 overflow-hidden rounded-t-2xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="p-4 bg-white/10 rounded-full mb-3">
            <Lock size={32} className="text-white/90" />
          </div>
          <h3 className="font-semibold text-white text-lg leading-tight mb-1">
            Timeline Oculta
          </h3>
          <p className="text-white/70 text-sm">
            Requer autenticação
          </p>
        </div>
        
        <div className="absolute top-3 right-3">
          <div className="p-2 bg-white/10 rounded-full">
            {authMethod === "biometric" ? (
              <Fingerprint size={16} className="text-white/90" />
            ) : (
              <Shield size={16} className="text-white/90" />
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-muted/30">
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Lock size={14} />
            <span>
              {authMethod === "biometric" ? "Face ID / Touch ID" : "Protegido por Senha"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiddenTimelineCard;
import { useState } from "react";
import { Mail, UserPlus, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  timelineId: string;
  timelineName: string;
}

interface PendingInvite {
  email: string;
  status: "sending" | "sent" | "error";
}

const InviteMemberModal = ({
  isOpen,
  onClose,
  timelineId,
  timelineName,
}: InviteMemberModalProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [isSending, setIsSending] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendInvite = async () => {
    if (!email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Digite o email da pessoa que deseja convidar",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Email inválido",
        description: "Digite um endereço de email válido",
        variant: "destructive",
      });
      return;
    }

    // Check if already invited
    if (pendingInvites.some(inv => inv.email === email)) {
      toast({
        title: "Já convidado",
        description: "Este email já recebeu um convite",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    const newInvite: PendingInvite = { email, status: "sending" };
    setPendingInvites(prev => [...prev, newInvite]);

    // Simulate sending invitation
    setTimeout(() => {
      setPendingInvites(prev => 
        prev.map(inv => 
          inv.email === email 
            ? { ...inv, status: "sent" } 
            : inv
        )
      );
      setIsSending(false);
      setEmail("");
      
      if ("vibrate" in navigator) navigator.vibrate([10, 20, 10]);
      
      toast({
        title: "Convite enviado! 🎉",
        description: `${email} receberá o convite em breve`,
      });
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSending) {
      handleSendInvite();
    }
  };

  const handleClose = () => {
    setEmail("");
    setPendingInvites([]);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="border-b border-border px-6 pt-6 pb-4 flex-shrink-0">
            <SheetTitle className="text-left">Convidar Membros</SheetTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Para a timeline "{timelineName}"
            </p>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email do Convidado
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="nome@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 h-12 rounded-2xl"
                    disabled={isSending}
                    aria-label="Email do convidado"
                  />
                </div>
                <Button
                  onClick={handleSendInvite}
                  disabled={isSending || !email.trim()}
                  size="icon"
                  className="h-12 w-12 rounded-2xl flex-shrink-0"
                  aria-label="Enviar convite"
                >
                  {isSending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <UserPlus size={18} />
                  )}
                </Button>
              </div>
            </div>

            {/* Pending Invites */}
            {pendingInvites.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">
                  Convites Recentes
                </h3>
                <div className="space-y-2">
                  {pendingInvites.map((invite, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border transition-all duration-150",
                        invite.status === "sent" && "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
                        invite.status === "sending" && "bg-muted/30 border-border",
                        invite.status === "error" && "bg-destructive/10 border-destructive/20"
                      )}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Mail size={14} className="text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-foreground truncate">
                          {invite.email}
                        </span>
                      </div>
                      <div className="flex-shrink-0">
                        {invite.status === "sending" && (
                          <Loader2 size={14} className="text-muted-foreground animate-spin" />
                        )}
                        {invite.status === "sent" && (
                          <Check size={14} className="text-green-600 dark:text-green-400" />
                        )}
                        {invite.status === "error" && (
                          <X size={14} className="text-destructive" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Card */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <p className="text-sm text-muted-foreground">
                💡 <span className="font-medium">Dica:</span> Os convidados receberão um email com o link para acessar a timeline
              </p>
            </div>
          </div>

          {/* Fixed bottom action bar */}
          <div className="border-t border-border px-6 py-4 bg-background flex-shrink-0">
            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full rounded-pill h-11"
            >
              Concluir
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default InviteMemberModal;

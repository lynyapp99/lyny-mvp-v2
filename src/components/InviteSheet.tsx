import { useEffect, useState } from "react";
import { Copy, MessageCircle, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  timelineId: string;
  timelineTitle: string;
  existingToken: string | null;
  onTokenGenerated?: (token: string) => void;
}

const InviteSheet = ({ open, onOpenChange, timelineId, timelineTitle, existingToken, onTokenGenerated }: Props) => {
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(existingToken);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken(existingToken);
  }, [existingToken]);

  useEffect(() => {
    if (!open || token || loading) return;
    const generate = async () => {
      setLoading(true);
      try {
        const newToken = crypto.randomUUID();
        const { error } = await supabase
          .from("timelines")
          .update({ invite_token: newToken })
          .eq("id", timelineId);
        if (error) throw error;
        setToken(newToken);
        onTokenGenerated?.(newToken);
      } catch (e: any) {
        toast({ title: "Erro ao gerar convite", description: e.message, variant: "destructive" });
        onOpenChange(false);
      } finally {
        setLoading(false);
      }
    };
    generate();
  }, [open, token, loading, timelineId, onTokenGenerated, toast, onOpenChange]);

  const haptic = () => "vibrate" in navigator && navigator.vibrate(10);
  const publicOrigin = (() => {
    if (typeof window === "undefined") return "";
    const origin = window.location.origin;
    if (origin.includes("lovable.app") && !origin.includes("dear-moments-together.lovable.app")) {
      return "https://dear-moments-together.lovable.app";
    }
    return origin;
  })();
  const link = token ? `${publicOrigin}/invite/${token}` : "";

  const handleCopy = async () => {
    haptic();
    try {
      await navigator.clipboard.writeText(link);
      toast({ title: "Link copiado!", description: "Pronto para compartilhar." });
      onOpenChange(false);
    } catch {
      toast({ title: "Não foi possível copiar", variant: "destructive" });
    }
  };

  const handleWhatsapp = () => {
    haptic();
    const text = encodeURIComponent(`Você foi convidado para ver minha timeline no Lyny: ${link}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader className="text-left">
          <SheetTitle>Convidar para "{timelineTitle}"</SheetTitle>
          <SheetDescription>
            Quem abrir esse link poderá visualizar a timeline.
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-3">
          {loading || !token ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Gerando link…
            </div>
          ) : (
            <>
              <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground break-all font-mono">
                {link}
              </div>
              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-card hover:bg-muted/50 active:scale-[0.98] transition-all min-h-[64px] text-left touch-manipulation"
              >
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Copy size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">Copiar link</div>
                  <div className="text-sm text-muted-foreground">Cole onde quiser</div>
                </div>
              </button>
              <button
                onClick={handleWhatsapp}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-card hover:bg-muted/50 active:scale-[0.98] transition-all min-h-[64px] text-left touch-manipulation"
              >
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MessageCircle size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">Compartilhar via WhatsApp</div>
                  <div className="text-sm text-muted-foreground">Abrir conversa</div>
                </div>
              </button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default InviteSheet;
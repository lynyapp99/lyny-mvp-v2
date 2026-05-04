import { Copy, MessageCircle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  timelineId: string;
  timelineTitle: string;
}

const ShareSheet = ({ open, onOpenChange, timelineId, timelineTitle }: Props) => {
  const { toast } = useToast();
  const link = `${window.location.origin}/t/${timelineId}`;

  const haptic = () => "vibrate" in navigator && navigator.vibrate(10);

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
    const text = encodeURIComponent(`Veja "${timelineTitle}" no lyny: ${link}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
    onOpenChange(false);
  };

  const options = [
    { id: "copy", icon: Copy, label: "Copiar link", desc: link, onClick: handleCopy },
    { id: "wa", icon: MessageCircle, label: "WhatsApp", desc: "Abrir no WhatsApp", onClick: handleWhatsapp },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Compartilhar timeline</SheetTitle>
        </SheetHeader>
        <div className="space-y-2 py-4">
          {options.map((o) => {
            const Icon = o.icon;
            return (
              <button
                key={o.id}
                onClick={o.onClick}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-card hover:bg-muted/50 active:scale-[0.98] transition-all min-h-[64px] text-left touch-manipulation"
              >
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{o.label}</div>
                  <div className="text-sm text-muted-foreground truncate">{o.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShareSheet;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users, Gift, Upload, Link as LinkIcon, Lock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

const EventCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    giftListUrl: "",
    allowGuestUploads: true,
    requireApproval: false,
    isPrivate: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Ops! 😊",
        description: "Qual o nome desse evento especial?",
        variant: "destructive",
      });
      return;
    }

    // Gerar ID único para o evento
    const eventId = `evt_${Date.now()}`;
    
    toast({
      title: "Prontinho! 🎉",
      description: "Evento criado com carinho. Agora é só convidar as pessoas queridas!",
    });
    
    // Navegar para detalhes do evento
    setTimeout(() => {
      navigate(`/event/${eventId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-xl"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Criar Evento</h1>
              <p className="text-sm text-muted-foreground">Vamos celebrar juntos</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Imagem de Capa (Opcional)
          </label>
          <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-accent/50 transition-colors cursor-pointer bg-muted/30">
            <Upload size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Toque para adicionar uma foto</p>
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
            Nome do Evento *
          </label>
          <Input
            id="title"
            placeholder="Ex: Aniversário da Ana - 5 anos"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="rounded-2xl h-12"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
            Descrição
          </label>
          <Textarea
            id="description"
            placeholder="Conte sobre esse momento especial..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="rounded-2xl resize-none"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Calendar size={16} />
              Data
            </label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="rounded-2xl h-12"
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-foreground mb-2">
              Horário
            </label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="rounded-2xl h-12"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <MapPin size={16} />
            Local
          </label>
          <Input
            id="location"
            placeholder="Onde vai acontecer?"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="rounded-2xl h-12"
          />
        </div>

        {/* Gift List URL */}
        <div>
          <label htmlFor="giftList" className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Gift size={16} />
            Lista de Presentes (Opcional)
          </label>
          <Input
            id="giftList"
            type="url"
            placeholder="https://..."
            value={formData.giftListUrl}
            onChange={(e) => setFormData({ ...formData, giftListUrl: e.target.value })}
            className="rounded-2xl h-12"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Cole o link da sua lista de presentes aqui
          </p>
        </div>

        {/* Settings */}
        <div className="space-y-4 p-4 bg-muted/30 rounded-2xl border border-border">
          <h3 className="font-medium text-foreground flex items-center gap-2">
            <Users size={16} />
            Configurações do Álbum
          </h3>

          {/* Allow Guest Uploads */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Permitir envio de fotos</p>
              <p className="text-xs text-muted-foreground">Convidados podem adicionar fotos</p>
            </div>
            <Switch
              checked={formData.allowGuestUploads}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, allowGuestUploads: checked })
              }
            />
          </div>

          {/* Require Approval */}
          {formData.allowGuestUploads && (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Aprovar fotos enviadas</p>
                <p className="text-xs text-muted-foreground">Você revisa antes de publicar</p>
              </div>
              <Switch
                checked={formData.requireApproval}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, requireApproval: checked })
                }
              />
            </div>
          )}

          {/* Privacy */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div>
              <p className="font-medium text-sm flex items-center gap-2">
                <Lock size={14} />
                Evento Privado
              </p>
              <p className="text-xs text-muted-foreground">Somente convidados podem ver</p>
            </div>
            <Switch
              checked={formData.isPrivate}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, isPrivate: checked })
              }
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full lyny-button-primary h-12 text-base"
          disabled={!formData.title.trim()}
        >
          <Check size={18} className="mr-2" />
          Criar Evento
        </Button>
      </form>

      <Navigation />
    </div>
  );
};

export default EventCreate;

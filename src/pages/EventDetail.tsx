import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Gift, 
  Share2, 
  Camera,
  Link as LinkIcon,
  Check,
  Clock,
  Download,
  Settings,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasRSVP, setHasRSVP] = useState(false);

  // Mock event data
  const event = {
    id: eventId,
    title: "Aniversário da Ana - 5 anos",
    description: "Vamos celebrar esse dia especial com muita alegria!",
    date: "2025-11-15",
    time: "15:00",
    location: "Casa da Vovó",
    address: "Rua das Flores, 123 - São Paulo, SP",
    giftListUrl: "https://example.com/lista-presentes",
    coverImage: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=400&fit=crop",
    organizer: "Você",
    confirmedGuests: 23,
    totalGuests: 35,
    allowGuestUploads: true,
    isPrivate: true,
  };

  const handleRSVP = () => {
    setHasRSVP(true);
    toast({
      title: "Confirmado! 🎉",
      description: "Mal podemos esperar para te ver lá!",
    });
  };

  const handleShare = () => {
    const inviteLink = `${window.location.origin}/convite/${eventId}`;
    
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Você está convidado(a) para: ${event.title}`,
        url: inviteLink,
      });
    } else {
      navigator.clipboard.writeText(inviteLink);
      toast({
        title: "Link copiado! 🔗",
        description: "Compartilhe com quem você quiser",
      });
    }
  };

  const handleDownload = () => {
    toast({
      title: "Preparando download...",
      description: "Suas fotos estarão prontas em instantes",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
                <h1 className="text-lg font-semibold text-foreground">Detalhes</h1>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/event/${eventId}/settings`)}
              className="rounded-xl"
            >
              <Settings size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Event Cover */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-white text-2xl font-bold mb-1">{event.title}</h2>
          <p className="text-white/90 text-sm">Organizado por {event.organizer}</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* RSVP Card */}
        <div className="lyny-card p-4 bg-gradient-to-r from-lyny-peach/10 to-lyny-blush/10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-foreground">
                {event.confirmedGuests} de {event.totalGuests} confirmados
              </p>
              <p className="text-sm text-muted-foreground">Você vai?</p>
            </div>
            {hasRSVP && (
              <div className="flex items-center gap-2 text-primary">
                <Check size={18} />
                <span className="text-sm font-medium">Confirmado</span>
              </div>
            )}
          </div>
          {!hasRSVP && (
            <Button 
              onClick={handleRSVP}
              className="w-full lyny-button-primary"
            >
              Confirmar Presença
            </Button>
          )}
        </div>

        {/* Event Info */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-accent/10 rounded-xl">
              <Calendar size={20} className="text-accent" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {new Date(event.date).toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-sm text-muted-foreground">{event.time}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-accent/10 rounded-xl">
              <MapPin size={20} className="text-accent" />
            </div>
            <div>
              <p className="font-medium text-foreground">{event.location}</p>
              <p className="text-sm text-muted-foreground">{event.address}</p>
            </div>
          </div>

          {event.description && (
            <div className="pt-2">
              <p className="text-foreground leading-relaxed">{event.description}</p>
            </div>
          )}
        </div>

        {/* Gift List */}
        {event.giftListUrl && (
          <div className="lyny-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-lyny-gold/20 rounded-xl">
                <Gift size={20} className="text-lyny-graphite" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Lista de Presentes</h3>
                <p className="text-sm text-muted-foreground">Dê um presente especial</p>
              </div>
            </div>
            <Button 
              onClick={() => window.open(event.giftListUrl, '_blank')}
              className="w-full lyny-button-subtle"
            >
              Ver Lista de Presentes
              <ChevronRight size={16} className="ml-2" />
            </Button>
          </div>
        )}

        {/* Album Section */}
        <div className="lyny-card p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Álbum do Evento</h3>
              <p className="text-sm text-muted-foreground">
                {event.allowGuestUploads 
                  ? "Adicione suas fotos especiais" 
                  : "Fotos compartilhadas"}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => navigate(`/event/${eventId}/album`)}
              className="rounded-xl"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="aspect-square bg-muted rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img
                  src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000}?w=200&h=200&fit=crop`}
                  alt={`Foto ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {event.allowGuestUploads && (
            <Button 
              onClick={() => navigate(`/event/${eventId}/album`)}
              className="w-full lyny-button-primary"
            >
              <Camera size={18} className="mr-2" />
              Adicionar Fotos
            </Button>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={handleShare}
            variant="outline"
            className="rounded-2xl h-12"
          >
            <Share2 size={18} className="mr-2" />
            Compartilhar
          </Button>
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="rounded-2xl h-12"
          >
            <Download size={18} className="mr-2" />
            Baixar Álbum
          </Button>
        </div>

        {/* Privacy Info */}
        <div className="text-center p-4 bg-muted/30 rounded-2xl">
          <p className="text-sm text-muted-foreground">
            🔒 Essa memória está protegida com carinho. Somente você e quem você convidar podem ver.
          </p>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default EventDetail;

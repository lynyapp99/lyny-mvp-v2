import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Gift, Check, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import LynyLogo from "@/components/LynyLogo";

const EventInvite = () => {
  const { eventId } = useParams();
  const { toast } = useToast();
  const [guestName, setGuestName] = useState("");
  const [hasRSVP, setHasRSVP] = useState(false);

  // Mock event data (viria da API/storage)
  const event = {
    id: eventId,
    title: "Aniversário da Ana - 5 anos",
    description: "Vamos celebrar esse dia especial com muita alegria!",
    date: "2025-11-15",
    time: "15:00",
    location: "Casa da Vovó",
    address: "Rua das Flores, 123 - São Paulo, SP",
    coverImage: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=400&fit=crop",
    organizer: "Maria",
    confirmedGuests: 23,
    giftListUrl: "https://example.com/lista-presentes",
  };

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guestName.trim()) {
      toast({
        title: "Ops! 😊",
        description: "Por favor, nos diga seu nome",
        variant: "destructive",
      });
      return;
    }

    setHasRSVP(true);
    toast({
      title: "Confirmado! 🎉",
      description: `Obrigado, ${guestName}! Mal podemos esperar para te ver lá!`,
    });
  };

  return (
    <div className="min-h-screen bg-lyny-1 flex flex-col">
      {/* Header com Branding Lyny */}
      <div className="p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-lyny-graphite"><LynyLogo height={24} /></span>
        </div>
        <p className="text-xs text-lyny-graphite/70">Convite especial para você</p>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 pb-8">
        {/* Event Cover */}
        <div className="relative h-64 overflow-hidden rounded-3xl mb-6 shadow-lg">
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-white text-3xl font-bold mb-2 leading-tight">
              {event.title}
            </h1>
            <p className="text-white/90 text-sm">Por {event.organizer}</p>
          </div>
        </div>

        {/* RSVP Card */}
        <div className="bg-card rounded-3xl shadow-xl p-6 mb-6">
          {!hasRSVP ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Você está convidado(a)! 💫
                </h2>
                <p className="text-muted-foreground">
                  Confirme sua presença para participar desse momento especial
                </p>
              </div>

              <form onSubmit={handleRSVP} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Seu nome
                  </label>
                  <Input
                    id="name"
                    placeholder="Digite seu nome"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="rounded-2xl h-12 text-base"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full lyny-button-primary h-12 text-base"
                >
                  <Check size={20} className="mr-2" />
                  Confirmar Presença
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Presença Confirmada! 🎉
              </h3>
              <p className="text-muted-foreground mb-4">
                Obrigado, {guestName}! Estamos ansiosos para te ver lá.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Users size={16} />
                <span>{event.confirmedGuests + 1} pessoas confirmadas</span>
              </div>
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-4 bg-card rounded-2xl p-4">
            <div className="p-3 bg-accent/10 rounded-xl">
              <Calendar size={22} className="text-accent" />
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Quando</p>
              <p className="text-sm text-muted-foreground">
                {new Date(event.date).toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              <p className="text-sm text-muted-foreground">{event.time}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-card rounded-2xl p-4">
            <div className="p-3 bg-accent/10 rounded-xl">
              <MapPin size={22} className="text-accent" />
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Onde</p>
              <p className="text-sm text-muted-foreground">{event.location}</p>
              <p className="text-sm text-muted-foreground">{event.address}</p>
            </div>
          </div>

          {event.description && (
            <div className="bg-card rounded-2xl p-4">
              <p className="text-foreground leading-relaxed">{event.description}</p>
            </div>
          )}
        </div>

        {/* Gift List */}
        {event.giftListUrl && (
          <div className="bg-gradient-to-r from-lyny-gold/20 to-lyny-peach/20 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Gift size={24} className="text-lyny-graphite" />
              <div>
                <h3 className="font-semibold text-foreground">Lista de Presentes</h3>
                <p className="text-sm text-muted-foreground">Dê um presente especial</p>
              </div>
            </div>
            <Button 
              onClick={() => window.open(event.giftListUrl, '_blank')}
              className="w-full lyny-button-primary"
            >
              Ver Lista de Presentes
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-6">
          <p className="text-sm text-muted-foreground mb-2">
            Criado com 💛 no Lyny
          </p>
          <p className="text-xs text-muted-foreground">
            Suas memórias, suas regras.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventInvite;

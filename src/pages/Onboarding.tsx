import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Lock, Layers, Users, type LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const SLIDES: Array<{ title: string; subtitle: string; Icon: LucideIcon }> = [
  {
    title: "Suas memórias, suas regras.",
    subtitle:
      "Um lugar privado para guardar e compartilhar os momentos que realmente importam.",
    Icon: Lock,
  },
  {
    title: "Organize por timelines",
    subtitle:
      "Crie setores como Família, Viagens ou Projetos e organize suas timelines do jeito que fizer sentido pra você.",
    Icon: Layers,
  },
  {
    title: "Só quem você convidar vê",
    subtitle:
      "Sem feed público, sem algoritmo. Você controla quem participa de cada memória.",
    Icon: Users,
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [index, setIndex] = useState(0);

  // If a logged-in user already completed onboarding, send them home.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled && data?.onboarding_completed) {
          navigate("/home", { replace: true });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user, navigate]);

  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index];

  const finish = async () => {
    localStorage.setItem("onboarding_seen", "1");
    if (user) {
      await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("id", user.id);
    } else {
      localStorage.setItem("onboarding_pending_complete", "1");
    }
  };

  const handleContinue = () => {
    if ("vibrate" in navigator) navigator.vibrate(10);
    setIndex((i) => Math.min(i + 1, SLIDES.length - 1));
  };

  const handleCreateAccount = async () => {
    if ("vibrate" in navigator) navigator.vibrate(10);
    await finish();
    if (user) {
      navigate("/home", { replace: true });
    } else {
      navigate("/auth?mode=signup", { replace: true });
    }
  };

  const handleSignIn = async () => {
    if ("vibrate" in navigator) navigator.vibrate(10);
    await finish();
    if (user) {
      navigate("/home", { replace: true });
    } else {
      navigate("/auth?mode=signin", { replace: true });
    }
  };

  const handleDot = (i: number) => {
    if ("vibrate" in navigator) navigator.vibrate(10);
    setIndex(i);
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col px-6 pt-12 pb-8 safe-area-inset-top safe-area-inset-bottom">
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
        <div
          className="w-28 h-28 rounded-app-xl bg-muted/20 border border-border flex items-center justify-center mb-10 transition-all duration-300"
          aria-hidden="true"
        >
          <slide.Icon className="w-14 h-14 text-accent" strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-4">{slide.title}</h1>
        <p className="text-[17px] text-muted-foreground leading-relaxed max-w-sm">
          {slide.subtitle}
        </p>
      </div>

      <div className="max-w-md mx-auto w-full">
        {/* Dots */}
        <div
          className="flex items-center justify-center gap-2 mb-8"
          role="tablist"
          aria-label="Progresso do onboarding"
        >
          {SLIDES.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Ir para tela ${i + 1}`}
              onClick={() => handleDot(i)}
              className={cn(
                "h-2.5 rounded-pill transition-all duration-300 min-w-[10px] min-h-[10px] touch-manipulation",
                i === index ? "w-8 bg-accent" : "w-2.5 bg-muted-foreground/30"
              )}
            />
          ))}
        </div>

        {isLast ? (
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleCreateAccount}
              className="w-full rounded-pill h-12 text-base font-semibold"
            >
              Criar minha conta
            </Button>
            <Button
              onClick={handleSignIn}
              variant="ghost"
              className="w-full rounded-pill h-12 text-base"
            >
              Já tenho conta
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleContinue}
            className="w-full rounded-pill h-12 text-base font-semibold"
          >
            Continuar
          </Button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
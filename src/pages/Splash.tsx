import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Splash = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      if (session) {
        const { data } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", session.user.id)
          .maybeSingle();
        if (cancelled) return;
        navigate(data?.onboarding_completed ? "/home" : "/onboarding", { replace: true });
      } else if (localStorage.getItem("onboarding_seen")) {
        navigate("/auth", { replace: true });
      } else {
        navigate("/onboarding", { replace: true });
      }
    }, 1200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [navigate, session, loading]);

  return (
    <div className="min-h-screen bg-lyny-1 flex flex-col items-center justify-center px-4 animate-fade-in">
      {/* Logo/Wordmark */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Heart 
              size={48} 
              className="text-lyny-graphite fill-current animate-pulse" 
              strokeWidth={1.5}
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-lyny-graphite rounded-full" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold tracking-tight text-lyny-graphite mb-2">
          Lyny
        </h1>
        
        <p className="text-lg text-lyny-graphite/80 font-medium">
          Suas memórias, suas regras.
        </p>
      </div>

      {/* Loading indicator */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-lyny-graphite/50 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default Splash;

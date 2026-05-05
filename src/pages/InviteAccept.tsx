import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type InviteData = {
  timelineId: string;
  timelineTitle: string;
  ownerId: string;
  ownerName: string;
};

const InviteAccept = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  // Fetch invite
  useEffect(() => {
    console.log("Token:", token);
    if (!token) {
      setError("Convite inválido");
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const { data, error: tlErr } = await supabase.rpc("get_invite_info", {
          _token: token,
        });
        console.log("Timeline:", { data, error: tlErr });
        if (tlErr) {
          console.error("Erro:", tlErr);
          throw tlErr;
        }
        const tl = Array.isArray(data) ? data[0] : data;
        if (!tl) {
          setError("Nenhuma timeline encontrada para este token.");
          return;
        }
        setInvite({
          timelineId: tl.timeline_id,
          timelineTitle: tl.timeline_title,
          ownerId: tl.owner_id,
          ownerName: tl.owner_name || "Alguém",
        });
      } catch (e: any) {
        console.error("Erro:", e);
        setError(e.message || "Erro desconhecido ao buscar convite");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  // Auto-accept when logged in
  useEffect(() => {
    if (!invite || !user || authLoading || accepting) return;
    const accept = async () => {
      setAccepting(true);
      try {
        // Owner shouldn't be added as member — just go in
        if (invite.ownerId === user.id) {
          navigate(`/timeline/${invite.timelineId}`, { replace: true });
          return;
        }
        const { error: insErr } = await supabase
          .from("timeline_members")
          .insert({
            timeline_id: invite.timelineId,
            user_id: user.id,
            role: "viewer",
          });
        // Ignore unique violation (already a member)
        if (insErr && !/duplicate key|unique/i.test(insErr.message)) {
          throw insErr;
        }
        navigate(`/timeline/${invite.timelineId}`, { replace: true });
      } catch (e: any) {
        toast({
          title: "Não foi possível aceitar o convite",
          description: e.message,
          variant: "destructive",
        });
        setAccepting(false);
      }
    };
    accept();
  }, [invite, user, authLoading, accepting, navigate, toast]);

  const returnTo = `/invite/${token}`;

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
          Convite inválido
        </h1>
        <p className="text-sm text-muted-foreground mb-6 max-w-xs">
          Este link de convite não existe ou foi removido.
        </p>
        <Button onClick={() => navigate("/")}>Voltar ao início</Button>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
        Você foi convidado
      </p>
      <h1 className="font-display text-2xl font-semibold text-foreground mb-2 max-w-xs">
        {invite.timelineTitle}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        por {invite.ownerName}
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button asChild className="rounded-pill">
          <Link to={`/auth?mode=signup&redirect=${encodeURIComponent(returnTo)}`}>
            Criar conta
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-pill">
          <Link to={`/auth?redirect=${encodeURIComponent(returnTo)}`}>
            Já tenho conta
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default InviteAccept;
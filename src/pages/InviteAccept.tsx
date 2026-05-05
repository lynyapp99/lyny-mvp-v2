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
  const [debugRpc, setDebugRpc] = useState<{ data: unknown; error: unknown } | null>(null);

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
        setDebugRpc({ data, error: tlErr });
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
      <div className="min-h-screen bg-background px-6 py-10 text-foreground">
        <h1 className="font-display text-xl font-semibold mb-4">
          Debug — /invite/[token]
        </h1>
        <div className="space-y-4 text-xs font-mono">
          <section>
            <div className="text-muted-foreground mb-1">Token (URL):</div>
            <pre className="whitespace-pre-wrap break-all bg-muted/30 rounded p-3">
              {String(token)}
            </pre>
          </section>
          <section>
            <div className="text-muted-foreground mb-1">RPC get_invite_info — resultado:</div>
            <pre className="whitespace-pre-wrap break-all bg-muted/30 rounded p-3">
              {JSON.stringify(debugRpc, null, 2)}
            </pre>
          </section>
          <section>
            <div className="text-muted-foreground mb-1">Erro (state):</div>
            <pre className="whitespace-pre-wrap break-all bg-muted/30 rounded p-3">
              {error ?? "(nenhum)"}
            </pre>
          </section>
          <section>
            <div className="text-muted-foreground mb-1">Invite (state):</div>
            <pre className="whitespace-pre-wrap break-all bg-muted/30 rounded p-3">
              {JSON.stringify(invite, null, 2)}
            </pre>
          </section>
        </div>
        <div className="mt-6">
          <Button onClick={() => navigate("/")}>Voltar ao início</Button>
        </div>
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
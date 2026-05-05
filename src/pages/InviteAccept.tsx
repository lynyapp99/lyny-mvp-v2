import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

interface InviteInfo {
  timeline_id: string;
  timeline_title: string;
  timeline_subtitle: string;
  owner_name: string;
  owner_id: string;
  cover_url: string;
}

export default function InviteAccept() {
  const { token } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Convite inválido");
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const { data, error: rpcError } = await supabase.rpc("get_invite_info", { _token: token });
        if (rpcError) throw rpcError;
        const tl = Array.isArray(data) ? data[0] : data;
        if (!tl) {
          setError("Este link de convite não existe ou foi removido.");
          return;
        }
        setInvite({
          timeline_id: tl.timeline_id,
          timeline_title: tl.timeline_title,
          timeline_subtitle: tl.timeline_subtitle,
          owner_name: tl.owner_name || "Alguém",
          owner_id: tl.owner_id,
          cover_url: tl.cover_url,
        });
      } catch (e: any) {
        setError(e.message || "Erro ao buscar convite");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleAccept = async () => {
    setAccepting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      sessionStorage.setItem("pendingInvite", token!);
      navigate("/auth?redirect=/invite/" + token);
      return;
    }
    if (!invite) return;
    const { error: memberError } = await supabase.from("timeline_members").upsert({
      timeline_id: invite.timeline_id,
      user_id: user.id,
      role: "viewer",
    }, { onConflict: "timeline_id,user_id" });
    if (memberError) {
      console.error("Erro ao inserir membro:", memberError);
      alert("Erro ao aceitar convite: " + memberError.message);
      setAccepting(false);
      return;
    }
    console.log("[invite] accepted, navigating to timeline:", invite.timeline_id);
    await qc.invalidateQueries({ queryKey: ["timelines"] });
    await qc.invalidateQueries({ queryKey: ["shared-timelines"] });
    navigate("/timeline/" + invite.timeline_id);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white">Carregando convite...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 px-6">
      <div className="w-20 h-20 rounded-2xl bg-zinc-900 flex items-center justify-center text-4xl">🔒</div>
      <h1 className="text-white text-2xl font-bold font-playfair text-center">Convite inválido</h1>
      <p className="text-zinc-400 text-center">{error}</p>
      <Button onClick={() => navigate("/")} className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8">
        Voltar ao início
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 px-6">
      {invite?.cover_url && (
        <img src={invite.cover_url} alt="capa" className="w-32 h-32 rounded-2xl object-cover" />
      )}
      <div className="text-center">
        <p className="text-zinc-400 text-sm mb-1">{invite?.owner_name} te convidou para</p>
        <h1 className="text-white text-3xl font-bold font-playfair">{invite?.timeline_title}</h1>
        {invite?.timeline_subtitle && (
          <p className="text-zinc-400 mt-1">{invite?.timeline_subtitle}</p>
        )}
      </div>
      <Button
        onClick={handleAccept}
        disabled={accepting}
        className="bg-red-600 hover:bg-red-700 text-white rounded-full px-10 py-3 text-lg w-full max-w-xs"
      >
        {accepting ? "Entrando..." : "Aceitar convite"}
      </Button>
      <Button variant="ghost" onClick={() => navigate("/")} className="text-zinc-500">
        Voltar ao início
      </Button>
    </div>
  );
}

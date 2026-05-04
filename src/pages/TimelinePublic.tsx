import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { IOSButton } from "@/components/ui/ios-button";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTimelineMemories } from "@/lib/api/memories";
import TimelineFeedCard from "@/components/TimelineFeedCard";
import MediaViewer from "@/components/MediaViewer";
import ShareSheet from "@/components/ShareSheet";

const TimelinePublic = () => {
  const { timelineId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const { data: timeline, isLoading, error } = useQuery({
    queryKey: ["public-timeline", timelineId],
    enabled: !!timelineId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("timelines")
        .select("id, title, subtitle, cover_url, user_id")
        .eq("id", timelineId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: owner } = useQuery({
    queryKey: ["public-timeline-owner", timeline?.user_id],
    enabled: !!timeline?.user_id,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, username, avatar_url")
        .eq("id", timeline!.user_id)
        .maybeSingle();
      return data;
    },
  });

  const { data: feed = [] } = useTimelineMemories(timelineId);
  const mediaItems = feed.filter((i) => i.kind !== "note");

  const isOwner = !!user && !!timeline && user.id === timeline.user_id;

  // If logged-in owner lands here, redirect to authenticated detail view
  useEffect(() => {
    if (isOwner && timelineId) navigate(`/timeline/${timelineId}`, { replace: true });
  }, [isOwner, timelineId, navigate]);

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Carregando...</div>;
  }

  if (error || !timeline) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 text-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Timeline não encontrada</h2>
          <p className="text-muted-foreground text-sm mb-4">O link pode estar incorreto.</p>
          <Button onClick={() => navigate("/")}>Ir para o início</Button>
        </div>
      </div>
    );
  }

  const ownerName = owner?.display_name || owner?.username || "Alguém";
  const signupHref = `/auth?mode=signup&redirect=/t/${timelineId}`;

  return (
    <div className="min-h-screen bg-background pb-32">
      <GlassCard className="sticky top-0 z-40 border-0 border-b border-border/50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <IOSButton
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-xl min-w-[44px] min-h-[44px]"
            aria-label="Voltar"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </IOSButton>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground truncate">{timeline.title}</h1>
            <p className="text-sm text-muted-foreground truncate">por {ownerName}</p>
          </div>
          <IOSButton
            variant="ghost"
            size="icon"
            onClick={() => setShareOpen(true)}
            className="rounded-xl min-w-[44px] min-h-[44px]"
            aria-label="Compartilhar"
          >
            <Share2 size={20} className="text-muted-foreground" />
          </IOSButton>
        </div>
      </GlassCard>

      {timeline.cover_url && (
        <div className="relative h-48 overflow-hidden">
          <img src={timeline.cover_url} alt={timeline.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-white text-xl font-bold mb-1">{timeline.title}</h2>
            {timeline.subtitle && <p className="text-white/90 text-sm">{timeline.subtitle}</p>}
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {feed.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            Esta timeline ainda não tem conteúdo.
          </div>
        )}
        {feed.map((item) => (
          <TimelineFeedCard
            key={item.id}
            item={item}
            onOpen={() => {
              if (item.kind === "note") return;
              const idx = mediaItems.findIndex((m) => m.id === item.id);
              if (idx >= 0) setViewerIndex(idx);
            }}
          />
        ))}
      </div>

      {viewerIndex !== null && (
        <MediaViewer
          items={mediaItems}
          index={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onNavigate={setViewerIndex}
        />
      )}

      <ShareSheet
        open={shareOpen}
        onOpenChange={setShareOpen}
        timelineId={timeline.id}
        timelineTitle={timeline.title}
      />

      {/* Footer banner (only for non-authenticated viewers) */}
      {!user && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
            <p className="text-sm text-foreground flex-1">
              Quer contribuir com memórias? Crie sua conta gratuitamente.
            </p>
            <Button asChild size="sm" className="shrink-0">
              <Link to={signupHref}>Criar conta</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelinePublic;

import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Play } from "lucide-react";
import { IOSButton } from "@/components/ui/ios-button";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTimelines, useSharedTimelines, type TimelineRow } from "@/lib/api/timelines";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { timelineFromRow } from "@/lib/api/adapters";
import { useTimelineMemories, useCreateNote, uploadTimelineMedia, type FeedItem } from "@/lib/api/memories";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import AddContentSheet from "@/components/AddContentSheet";
import NoteComposer from "@/components/NoteComposer";
import MediaViewer from "@/components/MediaViewer";
import InviteSheet from "@/components/InviteSheet";
import ContextHeader from "@/components/ContextHeader";

type Upload = { id: string; name: string; progress: number };

const formatFullDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const TimelineDetail = () => {
  const { timelineId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: ownRows = [], isLoading: loadingOwn } = useTimelines();
  const { data: sharedRows = [], isLoading: loadingShared } = useSharedTimelines();
  const timelineRows = useMemo(() => [...ownRows, ...sharedRows], [ownRows, sharedRows]);
  const { data: feed = [] } = useTimelineMemories(timelineId);
  const createNote = useCreateNote(timelineId ?? "");

  const [sheetOpen, setSheetOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const cachedRow = timelineRows.find((t) => t.id === timelineId);

  // Fallback: fetch directly if not in any cache (e.g., right after accepting an invite)
  const { data: directRow, isLoading: loadingDirect } = useQuery({
    queryKey: ["timeline", timelineId, user?.id],
    enabled: !!timelineId && !!user && !cachedRow && !loadingOwn && !loadingShared,
    queryFn: async (): Promise<TimelineRow | null> => {
      const { data, error } = await supabase
        .from("timelines")
        .select("*")
        .eq("id", timelineId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const timelineRow = cachedRow ?? directRow ?? null;
  const timeline = timelineRow ? timelineFromRow(timelineRow) : null;
  const isOwner = !!timelineRow && !!user && timelineRow.user_id === user.id;
  const currentToken = inviteToken ?? timelineRow?.invite_token ?? null;

  // Cronológico ascendente: mais antigo no topo
  const sortedFeed = useMemo(
    () => [...feed].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)),
    [feed],
  );
  const mediaItems = useMemo(() => sortedFeed.filter((i) => i.kind !== "note"), [sortedFeed]);

  const stillLoading = loadingOwn || loadingShared || loadingDirect;

  if (!timeline && stillLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando timeline...</p>
      </div>
    );
  }

  if (!timeline) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-xl font-semibold mb-2">Timeline não encontrada</h2>
          <Button onClick={() => navigate(-1)}>Voltar</Button>
        </div>
      </div>
    );
  }

  const handleUpload = async (files: File[], kind: "photo" | "video") => {
    if (!user || !timelineId) return;
    setSheetOpen(false);
    for (const file of files) {
      const id = crypto.randomUUID();
      setUploads((prev) => [...prev, { id, name: file.name, progress: 0 }]);
      try {
        await uploadTimelineMedia({
          userId: user.id,
          timelineId,
          file,
          kind,
          onProgress: (pct) => {
            setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, progress: pct } : u)));
          },
        });
      } catch (e: any) {
        toast({ title: "Erro no upload", description: e.message, variant: "destructive" });
      } finally {
        setUploads((prev) => prev.filter((u) => u.id !== id));
        qc.invalidateQueries({ queryKey: ["memories", timelineId] });
      }
    }
  };

  const handleSaveNote = async (text: string) => {
    try {
      await createNote.mutateAsync(text);
      toast({ title: "Nota adicionada" });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <ContextHeader
        title={timeline.title}
        showShare={false}
        showInvite={isOwner}
        onInvite={() => setInviteOpen(true)}
      />
      {/* Cover header */}
      <div className="relative w-full h-64 overflow-hidden">
        {timeline.cover ? (
          <img src={timeline.cover} alt={timeline.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-2 to-surface" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />

        {/* Title */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="font-display font-semibold text-white text-3xl leading-tight drop-shadow-lg">
            {timeline.title}
          </h1>
          {timeline.subtitle && (
            <p className="text-white/80 text-sm mt-1">{timeline.subtitle}</p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-md mx-auto px-4 pt-6">
        {uploads.length > 0 && (
          <div className="space-y-3 mb-5">
            {uploads.map((u) => (
              <div key={u.id} className="p-4 bg-card rounded-app border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground truncate flex-1">{u.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{u.progress}%</span>
                </div>
                <Progress value={u.progress} className="h-1.5" />
              </div>
            ))}
          </div>
        )}

        {sortedFeed.length === 0 && uploads.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-6">
            <h2 className="font-display font-semibold text-xl text-foreground">
              Nenhuma memória ainda
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              Toque em + para adicionar a primeira memória
            </p>
          </div>
        ) : (
          <div className="relative pl-6">
            {/* Vertical line */}
            <div
              className="absolute left-[7px] top-2 bottom-2 w-px bg-border"
              aria-hidden
            />

            <ol className="space-y-6">
              {sortedFeed.map((item) => (
                <li key={item.id} className="relative">
                  {/* Dot */}
                  <span
                    className="absolute -left-[22px] top-2 w-3 h-3 rounded-full bg-primary ring-4 ring-background"
                    aria-hidden
                  />

                  <TimelineMemoryCard
                    item={item}
                    onOpen={() => {
                      if (item.kind === "note") return;
                      const idx = mediaItems.findIndex((m) => m.id === item.id);
                      if (idx >= 0) setViewerIndex(idx);
                    }}
                  />
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => {
          if ("vibrate" in navigator) navigator.vibrate(10);
          setSheetOpen(true);
        }}
        className="fixed z-40 w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-elevated flex items-center justify-center active:scale-95 transition-transform"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 24px)",
          right: "24px",
        }}
        aria-label="Adicionar memória"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      <AddContentSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onPickPhotos={(files) => handleUpload(files, "photo")}
        onPickVideos={(files) => handleUpload(files, "video")}
        onWriteNote={() => {
          setSheetOpen(false);
          setNoteOpen(true);
        }}
      />

      <NoteComposer open={noteOpen} onOpenChange={setNoteOpen} onSave={handleSaveNote} />

      {viewerIndex !== null && (
        <MediaViewer
          items={mediaItems}
          index={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onNavigate={setViewerIndex}
        />
      )}

      {isOwner && (
        <InviteSheet
          open={inviteOpen}
          onOpenChange={setInviteOpen}
          timelineId={timeline.id}
          timelineTitle={timeline.title}
          existingToken={currentToken}
          onTokenGenerated={(t) => {
            setInviteToken(t);
            qc.invalidateQueries({ queryKey: ["timelines"] });
          }}
        />
      )}
    </div>
  );
};

const TimelineMemoryCard = ({
  item,
  onOpen,
}: {
  item: FeedItem;
  onOpen: () => void;
}) => {
  const dateLabel = formatFullDate(item.createdAt);

  if (item.kind === "note") {
    return (
      <article className="bg-card rounded-app border border-border p-4">
        <p className="text-xs text-muted-foreground mb-2">{dateLabel}</p>
        <p className="text-foreground whitespace-pre-wrap leading-relaxed">{item.text}</p>
      </article>
    );
  }

  return (
    <article className="bg-card rounded-app border border-border overflow-hidden">
      <button
        onClick={onOpen}
        className="block w-full text-left active:scale-[0.99] transition-transform"
        aria-label="Abrir mídia"
      >
        <div className="relative w-full bg-muted" style={{ height: 240 }}>
          {item.kind === "video" ? (
            <>
              <video
                src={item.mediaUrl ?? undefined}
                preload="metadata"
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ borderRadius: "12px 12px 0 0" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-black/60 flex items-center justify-center">
                  <Play size={22} className="text-white ml-1" fill="white" />
                </div>
              </div>
            </>
          ) : (
            <img
              src={item.mediaUrl ?? undefined}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
              style={{ borderRadius: "12px 12px 0 0" }}
            />
          )}
        </div>
      </button>
      <div className="p-4">
        <p className="text-xs text-muted-foreground">{dateLabel}</p>
        {item.text && (
          <p className="text-sm text-foreground mt-3 whitespace-pre-wrap leading-relaxed">
            {item.text}
          </p>
        )}
      </div>
    </article>
  );
};

export default TimelineDetail;

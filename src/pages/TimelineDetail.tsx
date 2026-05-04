import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical, Plus, Play, Share2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { IOSButton } from "@/components/ui/ios-button";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTimelines } from "@/lib/api/timelines";
import { timelineFromRow } from "@/lib/api/adapters";
import { useTimelineMemories, useCreateNote, uploadTimelineMedia, type FeedItem } from "@/lib/api/memories";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import AddContentSheet from "@/components/AddContentSheet";
import NoteComposer from "@/components/NoteComposer";
import MediaViewer from "@/components/MediaViewer";
import InviteMemberModal from "@/components/InviteMemberModal";
import ShareSheet from "@/components/ShareSheet";
import EmptyState from "@/components/EmptyState";
import { Image as ImageIcon } from "lucide-react";

type Upload = { id: string; name: string; progress: number };

const TimelineDetail = () => {
  const { timelineId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: timelineRows = [] } = useTimelines();
  const { data: feed = [] } = useTimelineMemories(timelineId);
  const createNote = useCreateNote(timelineId ?? "");

  const [sheetOpen, setSheetOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const timeline = timelineRows.map(timelineFromRow).find((t) => t.id === timelineId);

  if (!timeline) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Timeline não encontrada</h2>
          <Button onClick={() => navigate(-1)}>Voltar</Button>
        </div>
      </div>
    );
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffH = (now.getTime() - d.getTime()) / 36e5;
    if (diffH < 1) return "Agora";
    if (diffH < 24) return `${Math.floor(diffH)}h atrás`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `${diffD}d atrás`;
    return d.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
  };

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

  const mediaItems = feed.filter((i) => i.kind !== "note");

  return (
    <div className="min-h-screen bg-background pb-32">
      <GlassCard className="sticky top-0 z-40 border-0 border-b border-border/50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <IOSButton
            variant="ghost"
            size="icon"
            onClick={() => {
              if ("vibrate" in navigator) navigator.vibrate(10);
              navigate(-1);
            }}
            className="rounded-xl min-w-[44px] min-h-[44px]"
            aria-label="Voltar"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </IOSButton>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground truncate">{timeline.title}</h1>
            <p className="text-sm text-muted-foreground">{feed.length} itens</p>
          </div>
          <IOSButton
            variant="ghost"
            size="icon"
            className="rounded-xl min-w-[44px] min-h-[44px]"
            onClick={() => { if ("vibrate" in navigator) navigator.vibrate(10); setShareOpen(true); }}
            aria-label="Compartilhar"
          >
            <Share2 size={20} className="text-muted-foreground" />
          </IOSButton>
          <IOSButton
            variant="ghost"
            size="icon"
            className="rounded-xl min-w-[44px] min-h-[44px]"
            onClick={() => setInviteOpen(true)}
            aria-label="Mais opções"
          >
            <MoreVertical size={20} className="text-muted-foreground" />
          </IOSButton>
        </div>
      </GlassCard>

      {timeline.cover && (
        <div className="relative h-48 overflow-hidden">
          <img src={timeline.cover} alt={timeline.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-white text-xl font-bold mb-1">{timeline.title}</h2>
            {timeline.subtitle && <p className="text-white/90 text-sm">{timeline.subtitle}</p>}
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {uploads.length > 0 && (
          <div className="space-y-2">
            {uploads.map((u) => (
              <div key={u.id} className="p-3 bg-card rounded-xl border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground truncate flex-1">{u.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{u.progress}%</span>
                </div>
                <Progress value={u.progress} className="h-1.5" />
              </div>
            ))}
          </div>
        )}

        {feed.length === 0 && uploads.length === 0 && (
          <EmptyState
            icon={ImageIcon}
            title="Nenhuma memória ainda"
            description="Adicione fotos, vídeos ou notas para começar."
            actionLabel="Adicionar memória"
            onAction={() => {
              if ("vibrate" in navigator) navigator.vibrate(10);
              setSheetOpen(true);
            }}
          />
        )}

        {feed.map((item) => (
          <FeedCard
            key={item.id}
            item={item}
            formatDate={formatDate}
            onOpen={() => {
              if (item.kind === "note") return;
              const idx = mediaItems.findIndex((m) => m.id === item.id);
              if (idx >= 0) setViewerIndex(idx);
            }}
          />
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => {
          if ("vibrate" in navigator) navigator.vibrate(10);
          setSheetOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Adicionar conteúdo"
      >
        <Plus size={26} />
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

      <ShareSheet
        open={shareOpen}
        onOpenChange={setShareOpen}
        timelineId={timeline.id}
        timelineTitle={timeline.title}
      />

      <InviteMemberModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        timelineId={timelineId || ""}
        timelineName={timeline.title}
      />
    </div>
  );
};

const FeedCard = ({
  item,
  formatDate,
  onOpen,
}: {
  item: FeedItem;
  formatDate: (s: string) => string;
  onOpen: () => void;
}) => {
  if (item.kind === "note") {
    return (
      <div className="p-4 bg-card rounded-2xl border border-border">
        <p className="text-foreground whitespace-pre-wrap leading-relaxed">{item.text}</p>
        <p className="text-xs text-muted-foreground mt-3">{formatDate(item.createdAt)}</p>
      </div>
    );
  }

  return (
    <button
      onClick={onOpen}
      className="block w-full bg-card rounded-2xl border border-border overflow-hidden active:scale-[0.99] transition-transform"
    >
      <div className="relative aspect-[4/3] bg-muted">
        {item.kind === "video" ? (
          <>
            <video
              src={item.mediaUrl ?? undefined}
              preload="metadata"
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-14 h-14 rounded-full bg-black/60 flex items-center justify-center">
                <Play size={26} className="text-white ml-1" fill="white" />
              </div>
            </div>
          </>
        ) : (
          <img
            src={item.mediaUrl ?? undefined}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>
      {item.text && (
        <div className="p-3 text-left">
          <p className="text-sm text-foreground">{item.text}</p>
        </div>
      )}
      <div className="px-3 pb-3 text-left">
        <p className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
      </div>
    </button>
  );
};

export default TimelineDetail;

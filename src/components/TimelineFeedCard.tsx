import { Play } from "lucide-react";
import type { FeedItem } from "@/lib/api/memories";

export const formatRelativeDate = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diffH = (now.getTime() - d.getTime()) / 36e5;
  if (diffH < 1) return "Agora";
  if (diffH < 24) return `${Math.floor(diffH)}h atrás`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d atrás`;
  return d.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
};

interface Props {
  item: FeedItem;
  onOpen: () => void;
}

const TimelineFeedCard = ({ item, onOpen }: Props) => {
  if (item.kind === "note") {
    return (
      <div className="p-4 bg-card rounded-2xl border border-border">
        <p className="text-foreground whitespace-pre-wrap leading-relaxed">{item.text}</p>
        <p className="text-xs text-muted-foreground mt-3">{formatRelativeDate(item.createdAt)}</p>
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
          <img src={item.mediaUrl ?? undefined} alt="" className="w-full h-full object-cover" loading="lazy" />
        )}
      </div>
      {item.text && (
        <div className="p-4 text-left">
          <p className="text-sm text-foreground">{item.text}</p>
        </div>
      )}
      <div className="px-4 pb-4 text-left">
        <p className="text-xs text-muted-foreground">{formatRelativeDate(item.createdAt)}</p>
      </div>
    </button>
  );
};

export default TimelineFeedCard;

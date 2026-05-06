import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTimelineMembers, type TimelineMember } from "@/lib/api/timelines";

const initials = (m: TimelineMember) => {
  const name = m.displayName?.trim() || m.username?.trim() || "?";
  const parts = name.split(/\s+/).filter(Boolean);
  const letters = parts.length >= 2 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
  return letters.toUpperCase();
};

const roleLabel = (r: TimelineMember["role"]) =>
  r === "owner" ? "Dono" : r === "contributor" ? "Contribuidor" : "Visualizador";

const haptic = () => "vibrate" in navigator && navigator.vibrate(10);

interface Props {
  timelineId: string;
  isOwner: boolean;
}

const TimelineParticipants = ({ timelineId, isOwner }: Props) => {
  const { data: members = [] } = useTimelineMembers(timelineId);
  const [open, setOpen] = useState(false);

  if (members.length === 0) return null;

  const visible = members.slice(0, 5);
  const extra = members.length - visible.length;

  return (
    <section className="mb-6">
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
        Participantes
      </p>
      <button
        onClick={() => {
          haptic();
          setOpen(true);
        }}
        className="flex items-center min-h-[44px] active:scale-[0.98] transition-transform"
        aria-label="Ver todos os participantes"
      >
        <div className="flex items-center">
          {visible.map((m, i) => (
            <Avatar
              key={m.userId}
              className={`h-9 w-9 ring-2 ring-background ${i > 0 ? "-ml-2" : ""}`}
            >
              {m.avatarUrl && <AvatarImage src={m.avatarUrl} alt="" />}
              <AvatarFallback className="text-xs bg-surface-2 text-foreground">
                {initials(m)}
              </AvatarFallback>
            </Avatar>
          ))}
          {extra > 0 && (
            <div className="-ml-2 h-9 w-9 rounded-full ring-2 ring-background bg-surface-2 flex items-center justify-center text-xs text-foreground">
              +{extra}
            </div>
          )}
        </div>
        <span className="ml-3 text-sm text-muted-foreground">
          {members.length} {members.length === 1 ? "participante" : "participantes"}
        </span>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Participantes</SheetTitle>
          </SheetHeader>
          <ul className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
            {members.map((m) => (
              <li key={m.userId} className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {m.avatarUrl && <AvatarImage src={m.avatarUrl} alt="" />}
                  <AvatarFallback className="text-xs bg-surface-2 text-foreground">
                    {initials(m)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">
                    {m.displayName || m.username || "Sem nome"}
                  </p>
                  {m.username && (
                    <p className="text-xs text-muted-foreground truncate">@{m.username}</p>
                  )}
                </div>
                {isOwner && (
                  <span className="text-xs px-2 py-1 rounded-full bg-surface-2 text-muted-foreground shrink-0">
                    {roleLabel(m.role)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default TimelineParticipants;
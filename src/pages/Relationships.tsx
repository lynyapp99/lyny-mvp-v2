import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import AppHeader from "@/components/AppHeader";
import TimelineCard from "@/components/TimelineCard";
import { useSharedTimelines } from "@/lib/api/timelines";
import { timelineFromRow } from "@/lib/api/adapters";

const Relationships = () => {
  const navigate = useNavigate();
  const { data: sharedRows = [], isLoading } = useSharedTimelines();
  const shared = useMemo(() => sharedRows.map(timelineFromRow), [sharedRows]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader />

      <div className="max-w-md mx-auto px-4 py-6">
        {!isLoading && shared.length === 0 ? (
          <div className="text-center py-16 px-6">
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
              Nenhuma timeline compartilhada ainda. Peça para alguém te convidar.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {shared.map((t) => (
              <TimelineCard
                key={t.id}
                {...t}
                onClick={() => navigate(`/timeline/${t.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default Relationships;
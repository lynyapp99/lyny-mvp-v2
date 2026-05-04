import { useState } from "react";
import Navigation from "@/components/Navigation";
import TimelineCard from "@/components/TimelineCard";
import HiddenTimelineAuth from "@/components/HiddenTimelineAuth";
import { useHiddenTimelineSession } from "@/hooks/useHiddenTimelineSession";
import { useTimelines } from "@/lib/api/timelines";
import { timelineFromRow } from "@/lib/api/adapters";
import { ArrowLeft } from "lucide-react";

const HiddenTimelineDemo = () => {
  const [authTimelineId, setAuthTimelineId] = useState<string | null>(null);
  const { unlockTimeline, isTimelineUnlocked } = useHiddenTimelineSession();
  const { data: timelineRows = [] } = useTimelines();
  const allTimelines = timelineRows.map(timelineFromRow);
  const hiddenTimelines = allTimelines.filter(timeline => timeline.isHidden);

  const handleTimelineClick = (timelineId: string) => {
    const timeline = allTimelines.find(t => t.id === timelineId);
    
    if (timeline?.isHidden && !isTimelineUnlocked(timelineId)) {
      setAuthTimelineId(timelineId);
      return;
    }
    
    // Navigate to timeline or show success message
    alert(`Timeline unlocked! Navigating to: ${timeline?.title}`);
  };

  const handleAuthSuccess = () => {
    if (authTimelineId) {
      unlockTimeline(authTimelineId);
      const timeline = allTimelines.find(t => t.id === authTimelineId);
      alert(`Successfully unlocked: ${timeline?.title}`);
      setAuthTimelineId(null);
    }
  };

  const handleAuthCancel = () => {
    setAuthTimelineId(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-xl border-b border-border z-40">
        <div className="max-w-md mx-auto pt-4 pb-4 px-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-muted rounded-xl transition-colors"
            >
              <ArrowLeft size={20} className="text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Hidden Timelines</h1>
              <p className="text-sm text-muted-foreground">
                Secure, protected memory spaces
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto py-6 px-4">
        <div className="mb-6">
          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl mb-6">
            <h3 className="font-medium text-foreground mb-2">🔐 Hidden Timeline Demo</h3>
            <p className="text-sm text-muted-foreground">
              These timelines require authentication to access. Try clicking on them to test the biometric and password protection.
            </p>
          </div>
        </div>

        {hiddenTimelines.length > 0 ? (
          <div className="space-y-4">
            {hiddenTimelines.map((timeline) => (
              <div key={timeline.id} className="space-y-2">
                <TimelineCard
                  {...timeline}
                  onClick={() => handleTimelineClick(timeline.id)}
                />
                
                {/* Show unlock status */}
                {isTimelineUnlocked(timeline.id) && (
                  <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <p className="text-sm text-green-700 dark:text-green-400">
                      ✅ Timeline unlocked - session active
                    </p>
                  </div>
                )}
              </div>
            ))}
            
            <div className="mt-8 p-4 bg-muted/30 rounded-2xl">
              <h4 className="font-medium text-foreground mb-2">Demo Instructions:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Personal Diary</strong>: Uses biometric authentication (Face ID/Touch ID simulation)</li>
                <li>• <strong>Gift Ideas</strong>: Uses password protection (demo password: <code className="bg-muted px-1 rounded">demo123</code>)</li>
                <li>• Sessions expire after 5 minutes of inactivity</li>
                <li>• Hidden timelines don't appear in public profiles</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">No Hidden Timelines</h3>
            <p className="text-muted-foreground text-sm">
              Create a hidden timeline from the Create page
            </p>
          </div>
        )}
      </div>

      <Navigation />
      
      {/* Hidden Timeline Authentication Modal */}
      {authTimelineId && (
        <HiddenTimelineAuth
          authMethod={
            allTimelines.find(t => t.id === authTimelineId)?.authMethod || "biometric"
          }
          onSuccess={handleAuthSuccess}
          onCancel={handleAuthCancel}
        />
      )}
    </div>
  );
};

export default HiddenTimelineDemo;
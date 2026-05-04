import { useState } from "react";
import { Search, Clock, Users, Star } from "lucide-react";
import { type Timeline } from "@/types/timeline";
import { useTimelines } from "@/lib/api/timelines";
import { timelineFromRow } from "@/lib/api/adapters";

interface TimelineSelectorProps {
  selectedTimelineId?: string;
  onSelect: (timeline: Timeline) => void;
  placeholder?: string;
}

const TimelineSelector = ({ 
  selectedTimelineId, 
  onSelect,
  placeholder = "Select a timeline..." 
}: TimelineSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: timelineRows = [] } = useTimelines();
  const allTimelines = timelineRows.map(timelineFromRow);

  const filteredTimelines = allTimelines.filter(timeline =>
    timeline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    timeline.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentTimelines = filteredTimelines
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const favoriteTimelines = filteredTimelines.filter(t => t.favorite);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search timelines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-muted/50 rounded-2xl border-0 
                   text-foreground placeholder:text-muted-foreground
                   focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
        />
      </div>

      {searchQuery === "" && (
        <>
          {favoriteTimelines.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Star size={16} />
                Favorites
              </h4>
              <div className="space-y-2">
                {favoriteTimelines.map((timeline) => (
                  <TimelineOption
                    key={timeline.id}
                    timeline={timeline}
                    isSelected={selectedTimelineId === timeline.id}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Clock size={16} />
              Recent
            </h4>
            <div className="space-y-2">
              {recentTimelines.map((timeline) => (
                <TimelineOption
                  key={timeline.id}
                  timeline={timeline}
                  isSelected={selectedTimelineId === timeline.id}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {searchQuery !== "" && (
        <div className="space-y-2">
          {filteredTimelines.map((timeline) => (
            <TimelineOption
              key={timeline.id}
              timeline={timeline}
              isSelected={selectedTimelineId === timeline.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

      {filteredTimelines.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No timelines found</p>
        </div>
      )}
    </div>
  );
};

interface TimelineOptionProps {
  timeline: Timeline;
  isSelected: boolean;
  onSelect: (timeline: Timeline) => void;
}

const TimelineOption = ({ timeline, isSelected, onSelect }: TimelineOptionProps) => (
  <button
    onClick={() => onSelect(timeline)}
    className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 
              hover:shadow-md ${
      isSelected
        ? "border-primary bg-primary/5 shadow-md"
        : "border-border bg-card hover:border-primary/30"
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted">
        <img
          src={timeline.cover}
          alt={timeline.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML = `
              <div class="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 
                        flex items-center justify-center text-primary text-lg font-semibold">
                ${timeline.title.charAt(0)}
              </div>
            `;
          }}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-foreground">{timeline.title}</h4>
          {timeline.favorite && (
            <Star size={16} className="text-yellow-500 fill-current" />
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users size={14} />
            {timeline.members}
          </span>
          <span>{timeline.items} items</span>
          <span>{timeline.updatedAt}</span>
        </div>
      </div>
    </div>
  </button>
);

export default TimelineSelector;
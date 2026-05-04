import { Heart, Users, Calendar, Star, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FlagshipTimelineShowcaseProps {
  onDeepen?: () => void;
}

const FlagshipTimelineShowcase = ({ onDeepen }: FlagshipTimelineShowcaseProps) => {
  const flagshipTimeline = {
    id: "t1",
    title: "Our Restaurant Adventures",
    subtitle: "All the amazing places we've discovered together",
    cover: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=faces&auto=enhance",
    members: 2,
    memberNames: ["You", "Ana"],
    memberAvatars: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    ],
    updatedAt: "2025-08-20",
    items: 138,
    favorite: true,
    tags: ["Food", "Date Nights", "Partner", "Restaurants"],
    subcategories: [
      { name: "Fine Dining", count: 45, emoji: "🍽️" },
      { name: "Cozy Cafes", count: 32, emoji: "☕" },
      { name: "Food Trucks", count: 28, emoji: "🚚" },
      { name: "Special Occasions", count: 33, emoji: "🎉" }
    ],
    milestones: [
      { name: "First Date Restaurant", date: "2024-02-14", emoji: "💕" },
      { name: "Anniversary Dinner", date: "2025-02-14", emoji: "🌹" },
      { name: "100th Restaurant", date: "2025-07-15", emoji: "🎯" }
    ]
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border group">
        <div className="relative h-48">
          <img
            src={flagshipTimeline.cover}
            alt={flagshipTimeline.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Flagship Badge */}
          <div className="absolute top-4 right-4">
            <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium text-white border border-white/30">
              ✨ Flagship Timeline
            </div>
          </div>
          
          {/* Heart Favorite */}
          <div className="absolute top-4 left-4">
            <Heart size={20} className="text-red-400 fill-current" />
          </div>
          
          {/* Title & Description */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white mb-2">{flagshipTimeline.title}</h2>
            <p className="text-white/90 text-sm">{flagshipTimeline.subtitle}</p>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-muted-foreground" />
                <span className="font-medium">{flagshipTimeline.members} members</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground">{formatDate(flagshipTimeline.updatedAt)}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{flagshipTimeline.items}</div>
              <div className="text-sm text-muted-foreground">memories</div>
            </div>
          </div>

          {/* Members */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex -space-x-2">
              {flagshipTimeline.memberAvatars.map((avatar, index) => (
                <div key={index} className="w-8 h-8 rounded-full overflow-hidden border-2 border-background">
                  <img src={avatar} alt={flagshipTimeline.memberNames[index]} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              {flagshipTimeline.memberNames.join(" & ")}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {flagshipTimeline.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Deepening Examples */}
          <div className="grid gap-4">
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Layers size={16} />
                Timeline Deepening Examples
              </h4>
              
              {/* Subcategories */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-muted-foreground mb-2">Subcategories</h5>
                <div className="grid grid-cols-2 gap-2">
                  {flagshipTimeline.subcategories.map((sub, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{sub.emoji}</span>
                        <span className="font-medium text-sm">{sub.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{sub.count} memories</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div>
                <h5 className="text-sm font-medium text-muted-foreground mb-2">Milestones</h5>
                <div className="space-y-2">
                  {flagshipTimeline.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <span className="text-lg">{milestone.emoji}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{milestone.name}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(milestone.date)}</div>
                      </div>
                      <Star size={14} className="text-yellow-500 fill-current" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          {onDeepen && (
            <Button
              onClick={onDeepen}
              className="w-full mt-6 flex items-center gap-2"
            >
              <Layers size={16} />
              Try Deepening This Timeline
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlagshipTimelineShowcase;
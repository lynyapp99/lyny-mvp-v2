import { useState } from "react";
import { ArrowLeft, Upload, Lock, Users, Star, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimelineSelector from "./TimelineSelector";
import RelationshipSelector from "./RelationshipSelector";
import { type Timeline } from "@/data/mockData";
import { mockRelationships } from "@/data/relationshipData";
import { getRelationshipIcon } from "@/lib/relationshipIcons";

interface EditTimelineFlowProps {
  onBack: () => void;
}

type Step = "selectTimeline" | "editDetails" | "selectRelationship";

interface TimelineEditData {
  title: string;
  subtitle: string;
  cover: string;
  relationshipId: string;
  privacy: "private" | "shared" | "public";
  favorite: boolean;
}

const EditTimelineFlow = ({ onBack }: EditTimelineFlowProps) => {
  const [step, setStep] = useState<Step>("selectTimeline");
  const [selectedTimeline, setSelectedTimeline] = useState<Timeline | null>(null);
  const [editData, setEditData] = useState<TimelineEditData>({
    title: "",
    subtitle: "",
    cover: "",
    relationshipId: "",
    privacy: "private",
    favorite: false,
  });
  const [showRelationshipSelector, setShowRelationshipSelector] = useState(false);

  const colors = [
    { name: "pink", label: "Pink" },
    { name: "blue", label: "Blue" },
    { name: "green", label: "Green" },
    { name: "yellow", label: "Yellow" },
    { name: "purple", label: "Purple" },
    { name: "orange", label: "Orange" },
  ] as const;

  const privacyOptions = [
    { value: "private", label: "Private", description: "Only relationship members can view", icon: Lock },
    { value: "shared", label: "Shared", description: "Members can view and contribute", icon: Users },
    { value: "public", label: "Public", description: "Anyone with link can view", icon: Users },
  ] as const;

  const handleTimelineSelect = (timeline: Timeline) => {
    setSelectedTimeline(timeline);
    
    // Find the relationship this timeline belongs to
    const relationship = mockRelationships.find(rel => 
      rel.timelineIds.includes(timeline.id)
    );
    
    setEditData({
      title: timeline.title,
      subtitle: timeline.subtitle,
      cover: timeline.cover,
      relationshipId: relationship?.id || "",
      privacy: timeline.privacy,
      favorite: timeline.favorite,
    });
    setStep("editDetails");
  };

  const handleRelationshipSelect = (relationshipId: string) => {
    setEditData({ ...editData, relationshipId });
    setShowRelationshipSelector(false);
  };

  const selectedRelationship = mockRelationships.find(rel => rel.id === editData.relationshipId);
  const SelectedRelIcon = getRelationshipIcon(selectedRelationship?.emoji);

  if (step === "selectTimeline") {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Timeline</h1>
            <p className="text-muted-foreground">Choose a timeline to edit</p>
          </div>
        </div>

        <TimelineSelector
          onSelect={handleTimelineSelect}
          placeholder="Select timeline to edit..."
        />
      </div>
    );
  }

  if (showRelationshipSelector) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setShowRelationshipSelector(false)}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Change Relationship</h1>
            <p className="text-muted-foreground">Move {selectedTimeline?.title}</p>
          </div>
        </div>

        <RelationshipSelector
          selectedRelationshipId={editData.relationshipId}
          onSelect={handleRelationshipSelect}
          onCreateNew={() => {
            // Handle create new relationship
            console.log("Create new relationship");
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setStep("selectTimeline")}
          className="p-2 hover:bg-muted rounded-xl transition-colors"
        >
          <ArrowLeft size={20} className="text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Edit Timeline</h1>
          <p className="text-muted-foreground">{selectedTimeline?.title}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Cover Image
          </label>
          <div className="relative">
            {editData.cover ? (
              <div className="w-full h-32 rounded-2xl overflow-hidden bg-muted relative group">
                <img
                  src={editData.cover}
                  alt="Timeline cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                              transition-opacity duration-200 flex items-center justify-center">
                  <Upload size={24} className="text-white" />
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center 
                            hover:border-primary/50 transition-colors cursor-pointer">
                <Upload size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Tap to change cover image</p>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Title
          </label>
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 
                     text-foreground placeholder:text-muted-foreground
                     focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            value={editData.subtitle}
            onChange={(e) => setEditData({ ...editData, subtitle: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 
                     text-foreground placeholder:text-muted-foreground resize-none
                     focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
          />
        </div>

        {/* Relationship */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Relationship
          </label>
          <button
            onClick={() => setShowRelationshipSelector(true)}
            className="w-full p-4 bg-card rounded-2xl border border-border text-left 
                     hover:border-primary/30 transition-all duration-200"
          >
            {selectedRelationship ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-2 border border-divider flex items-center justify-center shrink-0">
                  <SelectedRelIcon className="w-5 h-5 text-foreground" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="font-medium text-foreground">{selectedRelationship.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedRelationship.members.length} membros
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">Select relationship...</div>
            )}
          </button>
        </div>

        {/* Privacy */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Privacy Setting
          </label>
          <div className="space-y-2">
            {privacyOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setEditData({ ...editData, privacy: option.value })}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 ${
                    editData.privacy === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Favorite Toggle */}
        <div>
          <button
            onClick={() => setEditData({ ...editData, favorite: !editData.favorite })}
            className={`w-full p-4 rounded-2xl border transition-all duration-200 ${
              editData.favorite
                ? "border-yellow-500 bg-yellow-500/5"
                : "border-border bg-card hover:border-yellow-500/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted/50 rounded-lg">
                <Star size={16} className={editData.favorite ? "text-yellow-500 fill-current" : ""} />
              </div>
              <div className="text-left">
                <div className="font-medium text-foreground">Pin to Home</div>
                <div className="text-sm text-muted-foreground">
                  {editData.favorite ? "Pinned to home screen" : "Pin this timeline to home"}
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Save Button */}
        <Button 
          className="w-full py-3 rounded-2xl font-medium"
          disabled={!editData.title.trim()}
        >
          Save Changes
        </Button>

        {/* Danger Zone */}
        <div className="border-t border-border pt-6 space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Danger Zone</h4>
          
          <button className="w-full p-4 rounded-2xl border border-orange-500/30 bg-orange-500/5 
                           hover:bg-orange-500/10 transition-all duration-200 text-left">
            <div className="flex items-center gap-3">
              <Archive size={16} className="text-orange-500" />
              <div>
                <div className="font-medium text-orange-500">Archive Timeline</div>
                <div className="text-sm text-muted-foreground">Hide from main view</div>
              </div>
            </div>
          </button>

          <button className="w-full p-4 rounded-2xl border border-red-500/30 bg-red-500/5 
                           hover:bg-red-500/10 transition-all duration-200 text-left">
            <div className="flex items-center gap-3">
              <Trash2 size={16} className="text-red-500" />
              <div>
                <div className="font-medium text-red-500">Delete Timeline</div>
                <div className="text-sm text-muted-foreground">Permanently delete all memories</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTimelineFlow;
import { useState } from "react";
import { Upload, Lock, Users, ArrowLeft, Shield, Fingerprint, Star } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { IOSButton } from "@/components/ui/ios-button";
import CreateChoice from "@/components/CreateChoice";
import AddMemoryFlow from "@/components/AddMemoryFlow";
import EditTimelineFlow from "@/components/EditTimelineFlow";
import DeepenTimelineFlow from "@/components/DeepenTimelineFlow";
import RelationshipSelector from "@/components/RelationshipSelector";
import AddRelationshipModal from "@/components/AddRelationshipModal";

type Flow = "choose" | "timeline" | "memory" | "edit" | "deepen";

const Create = () => {
  const [currentFlow, setCurrentFlow] = useState<Flow>("choose");
  const [showRelationshipSelector, setShowRelationshipSelector] = useState(false);
  const [showAddRelationshipModal, setShowAddRelationshipModal] = useState(false);
  const [timelineData, setTimelineData] = useState<{
    title: string;
    description: string;
    relationshipId: string;
    color: "pink" | "blue" | "green" | "yellow" | "purple" | "orange";
    privacy: "private" | "shared" | "public";
    favorite: boolean;
    isHidden: boolean;
    authMethod: "biometric" | "password";
    password: string;
  }>({
    title: "",
    description: "",
    relationshipId: "",
    color: "pink",
    privacy: "private",
    favorite: false,
    isHidden: false,
    authMethod: "biometric",
    password: "",
  });

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

  const handleFlowSelect = (flow: Flow) => {
    setCurrentFlow(flow);
  };

  const handleBackToChoice = () => {
    setCurrentFlow("choose");
  };

  const handleRelationshipSelect = (relationshipId: string) => {
    setTimelineData({ ...timelineData, relationshipId });
    setShowRelationshipSelector(false);
  };

  const handleCreateNewRelationship = () => {
    setShowRelationshipSelector(false);
    setShowAddRelationshipModal(true);
  };

  if (currentFlow === "memory") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <AddMemoryFlow onBack={handleBackToChoice} />
        <Navigation />
      </div>
    );
  }

  if (currentFlow === "edit") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <EditTimelineFlow onBack={handleBackToChoice} />
        <Navigation />
      </div>
    );
  }

  if (currentFlow === "deepen") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <DeepenTimelineFlow onBack={handleBackToChoice} />
        <Navigation />
      </div>
    );
  }

  if (currentFlow === "choose") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <CreateChoice onSelectFlow={handleFlowSelect} />
        <Navigation />
      </div>
    );
  }

  // Enhanced CreateTimeline component with relationship selection
  const CreateTimeline = () => {
    if (showRelationshipSelector) {
      return (
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <IOSButton
              variant="ghost"
              size="icon"
              onClick={() => setShowRelationshipSelector(false)}
              className="rounded-xl"
            >
              <ArrowLeft size={20} className="text-muted-foreground" />
            </IOSButton>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Select Relationship</h1>
              <p className="text-muted-foreground">Who will share this timeline?</p>
            </div>
          </div>

          <RelationshipSelector
            selectedRelationshipId={timelineData.relationshipId}
            onSelect={handleRelationshipSelect}
            onCreateNew={handleCreateNewRelationship}
          />
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <IOSButton
            variant="ghost"
            size="icon"
            onClick={handleBackToChoice}
            className="rounded-xl"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </IOSButton>
          <div>
            <h1 className="text-2xl font-bold text-foreground">New Timeline</h1>
            <p className="text-muted-foreground">Create your memory collection</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cover Image (Optional)
            </label>
            <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Tap to add cover image</p>
            </div>
          </div>
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="e.g., Our Restaurant Adventures"
              value={timelineData.title}
              onChange={(e) => setTimelineData({ ...timelineData, title: e.target.value })}
              className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              placeholder="What kind of memories will you collect here?"
              value={timelineData.description}
              onChange={(e) => setTimelineData({ ...timelineData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 
                       text-foreground placeholder:text-muted-foreground resize-none
                       focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
            />
          </div>

          {/* Relationship Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Relationship
            </label>
            <button
              onClick={() => setShowRelationshipSelector(true)}
              className="w-full p-4 bg-card rounded-2xl border border-border text-left 
                       hover:border-primary/30 transition-all duration-200"
            >
              {timelineData.relationshipId ? (
                <div className="text-foreground">Selected relationship</div>
              ) : (
                <div className="text-muted-foreground">Choose who will share this timeline...</div>
              )}
            </button>
          </div>
          
          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Timeline Color
            </label>
            <div className="grid grid-cols-3 gap-3">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setTimelineData({ ...timelineData, color: color.name })}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 sector-card-${color.name} ${
                    timelineData.color === color.name
                      ? "border-white shadow-lg scale-105"
                      : "border-transparent hover:border-white/30"
                  }`}
                >
                  <div className="text-sm font-medium text-center text-white">{color.label}</div>
                </button>
              ))}
            </div>
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
                    onClick={() => setTimelineData({ ...timelineData, privacy: option.value })}
                    className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 ${
                      timelineData.privacy === option.value
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

          {/* Hidden Timeline Toggle */}
          <div>
            <button
              onClick={() => setTimelineData({ ...timelineData, isHidden: !timelineData.isHidden })}
              className={`w-full p-4 rounded-2xl border transition-all duration-200 ${
                timelineData.isHidden
                  ? "border-orange-500 bg-orange-500/5"
                  : "border-border bg-card hover:border-orange-500/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted/50 rounded-lg">
                  <Lock size={16} className={timelineData.isHidden ? "text-orange-500" : "text-muted-foreground"} />
                </div>
                <div className="text-left">
                  <div className="font-medium text-foreground">Make Hidden Timeline</div>
                  <div className="text-sm text-muted-foreground">
                    {timelineData.isHidden ? "Requires authentication to access" : "Timeline will be visible to members"}
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Hidden Timeline Authentication Method */}
          {timelineData.isHidden && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-2xl border border-orange-500/20">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Authentication Method
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setTimelineData({ ...timelineData, authMethod: "biometric" })}
                    className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 ${
                      timelineData.authMethod === "biometric"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <Fingerprint size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Biometric Authentication</div>
                        <div className="text-sm text-muted-foreground">Use Face ID or Touch ID</div>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setTimelineData({ ...timelineData, authMethod: "password" })}
                    className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 ${
                      timelineData.authMethod === "password"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <Shield size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Password Protection</div>
                        <div className="text-sm text-muted-foreground">Set a custom password</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Password Input for Password Authentication */}
              {timelineData.authMethod === "password" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Set Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Enter a secure password"
                      value={timelineData.password}
                      onChange={(e) => setTimelineData({ ...timelineData, password: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 
                               text-foreground placeholder:text-muted-foreground
                               focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Choose a password you'll remember but others won't guess
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Favorite Toggle */}
          <div>
            <button
              onClick={() => setTimelineData({ ...timelineData, favorite: !timelineData.favorite })}
              className={`w-full p-4 rounded-2xl border transition-all duration-200 ${
                timelineData.favorite
                  ? "border-yellow-500 bg-yellow-500/5"
                  : "border-border bg-card hover:border-yellow-500/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-surface-2 rounded-lg">
                  <Star
                    size={16}
                    className={timelineData.favorite ? "text-primary" : "text-muted-foreground"}
                    fill={timelineData.favorite ? "currentColor" : "none"}
                    strokeWidth={1.75}
                  />
                </div>
                <div className="text-left">
                  <div className="font-medium text-foreground">Fixar na Home</div>
                  <div className="text-sm text-muted-foreground">
                    {timelineData.favorite ? "Aparece na tela inicial" : "Adicionar aos favoritos"}
                  </div>
                </div>
              </div>
            </button>
          </div>
          
          {/* Create Button */}
          <IOSButton 
            className="w-full py-3 rounded-2xl font-medium"
            disabled={
              !timelineData.title.trim() || 
              !timelineData.relationshipId ||
              (timelineData.isHidden && timelineData.authMethod === "password" && !timelineData.password.trim())
            }
          >
            {timelineData.isHidden ? "Create Hidden Timeline" : "Create Timeline"}
          </IOSButton>
        </div>
      </div>
    );
  };

  // Timeline creation flow
  if (currentFlow === "timeline") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <CreateTimeline />
        {showAddRelationshipModal && (
          <AddRelationshipModal
            isOpen={showAddRelationshipModal}
            onClose={() => setShowAddRelationshipModal(false)}
            onSuccess={(relationshipId) => {
              setTimelineData({ ...timelineData, relationshipId });
              setShowAddRelationshipModal(false);
            }}
          />
        )}
        <Navigation />
      </div>
    );
  }

  // This should never be reached, but just in case
  return (
    <div className="min-h-screen bg-background pb-20">
      <CreateChoice onSelectFlow={handleFlowSelect} />
      <Navigation />
    </div>
  );
};

export default Create;
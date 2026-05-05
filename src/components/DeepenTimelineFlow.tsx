import { useRef, useState } from "react";
import { ArrowLeft, Layers, Star, Folder, Palette, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimelineSelector from "./TimelineSelector";
import FlagshipTimelineShowcase from "./FlagshipTimelineShowcase";
import { type Timeline } from "@/types/timeline";

interface DeepenTimelineFlowProps {
  onBack: () => void;
}

type Step = "selectTimeline" | "selectFeature" | "createSubcategory" | "createMilestone" | "organizeMedia" | "privacyOverride" | "designPersonalization";

type DeepenFeature = "subcategories" | "milestones" | "mediaOrganization" | "privacyOverrides" | "designPersonalization";

interface SubcategoryData {
  color: string;
  emoji: string;
}

interface MilestoneData {
  coverImage: string;
  isSpecial: boolean;
}

const DeepenTimelineFlow = ({ onBack }: DeepenTimelineFlowProps) => {
  const [step, setStep] = useState<Step>("selectTimeline");
  const [selectedTimeline, setSelectedTimeline] = useState<Timeline | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<DeepenFeature | null>(null);
  const [subcategoryData, setSubcategoryData] = useState<SubcategoryData>({
    color: "blue",
    emoji: "📁",
  });
  const [milestoneData, setMilestoneData] = useState<MilestoneData>({
    coverImage: "",
    isSpecial: false,
  });
  const subNameRef = useRef<HTMLInputElement>(null);
  const subDescRef = useRef<HTMLTextAreaElement>(null);
  const milestoneTitleRef = useRef<HTMLInputElement>(null);
  const milestoneDateRef = useRef<HTMLInputElement>(null);
  const milestoneDescRef = useRef<HTMLTextAreaElement>(null);

  const deepenFeatures = [
    {
      id: "subcategories" as const,
      icon: Folder,
      title: "Add Subcategories",
      description: "Organize memories into themed sections",
      color: "from-brand-blue to-brand-purple",
      examples: ["Restaurants", "Trips", "Date Nights"]
    },
    {
      id: "milestones" as const,
      icon: Star,
      title: "Create Milestones",
      description: "Highlight key moments with special styling",
      color: "from-brand-yellow to-brand-orange",
      examples: ["Engagement", "Anniversary", "First Date"]
    },
    {
      id: "mediaOrganization" as const,
      icon: Layers,
      title: "Organize Media",
      description: "Create folders and clusters for photos",
      color: "from-brand-green to-brand-blue",
      examples: ["2025 Italy Trip", "Wedding Photos", "Random Shots"]
    },
    {
      id: "privacyOverrides" as const,
      icon: Shield,
      title: "Privacy Sections",
      description: "Add private areas within timeline",
      color: "from-brand-purple to-brand-pink",
      examples: ["Private Notes", "Surprise Plans", "Personal Thoughts"]
    },
    {
      id: "designPersonalization" as const,
      icon: Palette,
      title: "Customize Design",
      description: "Change layout, colors, and styling",
      color: "from-brand-pink to-brand-purple",
      examples: ["Cover Layout", "Accent Colors", "Timeline Icons"]
    },
  ];

  const colors = [
    { name: "pink", label: "Pink", emoji: "🌸" },
    { name: "blue", label: "Blue", emoji: "🌊" },
    { name: "green", label: "Green", emoji: "🌿" },
    { name: "yellow", label: "Yellow", emoji: "☀️" },
    { name: "purple", label: "Purple", emoji: "🔮" },
    { name: "orange", label: "Orange", emoji: "🧡" },
  ] as const;

  const handleTimelineSelect = (timeline: Timeline) => {
    setSelectedTimeline(timeline);
    setStep("selectFeature");
  };

  const handleFeatureSelect = (feature: DeepenFeature) => {
    setSelectedFeature(feature);
    switch (feature) {
      case "subcategories":
        setStep("createSubcategory");
        break;
      case "milestones":
        setStep("createMilestone");
        break;
      case "mediaOrganization":
        setStep("organizeMedia");
        break;
      case "privacyOverrides":
        setStep("privacyOverride");
        break;
      case "designPersonalization":
        setStep("designPersonalization");
        break;
    }
  };

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
            <h1 className="text-2xl font-bold text-foreground">Deepen Timeline</h1>
            <p className="text-muted-foreground">Choose a timeline to enhance</p>
          </div>
        </div>

        {/* Flagship Timeline with Subtle Highlight */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <h3 className="text-sm font-medium text-muted-foreground">Featured Example</h3>
          </div>
          <div className="bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-xl border-l-2 border-primary/30">
            <h4 className="font-medium text-foreground mb-1">Our Restaurant Adventures</h4>
            <p className="text-sm text-muted-foreground mb-3">Perfect example of couple's shared memories</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>2 members</span>
              <span>138 memories</span>
              <span>Partner timeline</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground mb-2">Or Choose Another Timeline</h3>
        </div>

        <TimelineSelector
          onSelect={handleTimelineSelect}
          placeholder="Select timeline to deepen..."
        />
      </div>
    );
  }

  if (step === "selectFeature") {
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
            <h1 className="text-2xl font-bold text-foreground">Deepen Features</h1>
            <p className="text-muted-foreground">Enhancing {selectedTimeline?.title}</p>
          </div>
        </div>

        <div className="space-y-4">
          {deepenFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => handleFeatureSelect(feature.id)}
                className="w-full p-6 bg-card rounded-2xl border border-border hover:shadow-lg 
                         transition-all duration-200 text-left active:scale-95 group"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-md 
                                 group-hover:shadow-lg transition-all duration-200 shrink-0`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {feature.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {feature.examples.map((example, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-lg"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (step === "createSubcategory") {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setStep("selectFeature")}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">New Subcategory</h1>
            <p className="text-muted-foreground">Organize {selectedTimeline?.title}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Subcategory Name
            </label>
            <input
              ref={subNameRef}
              type="text"
              placeholder="e.g., Date Night Restaurants"
              defaultValue=""
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
              ref={subDescRef}
              placeholder="What memories will be organized here?"
              defaultValue=""
              rows={3}
              className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 
                       text-foreground placeholder:text-muted-foreground resize-none
                       focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
            />
          </div>

          {/* Color & Emoji */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSubcategoryData({ 
                    ...subcategoryData, 
                    color: color.name,
                    emoji: color.emoji 
                  })}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 
                            sector-card-${color.name} ${
                    subcategoryData.color === color.name
                      ? "border-white shadow-lg scale-105"
                      : "border-transparent hover:border-white/30"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{color.emoji}</div>
                    <div className="text-sm font-medium text-white">{color.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Create Button */}
          <Button className="w-full py-3 rounded-2xl font-medium">
            Create Subcategory
          </Button>
        </div>
      </div>
    );
  }

  if (step === "createMilestone") {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setStep("selectFeature")}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">New Milestone</h1>
            <p className="text-muted-foreground">Highlight moments in {selectedTimeline?.title}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Milestone Title
            </label>
            <input
              ref={milestoneTitleRef}
              type="text"
              placeholder="e.g., Our First Anniversary"
              defaultValue=""
              className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Date
            </label>
            <input
              ref={milestoneDateRef}
              type="date"
              defaultValue=""
              className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 
                       text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              ref={milestoneDescRef}
              placeholder="Tell the story of this milestone..."
              defaultValue=""
              rows={4}
              className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 
                       text-foreground placeholder:text-muted-foreground resize-none
                       focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
            />
          </div>

          {/* Special Milestone Toggle */}
          <div>
            <button
              onClick={() => setMilestoneData({ ...milestoneData, isSpecial: !milestoneData.isSpecial })}
              className={`w-full p-4 rounded-2xl border transition-all duration-200 ${
                milestoneData.isSpecial
                  ? "border-yellow-500 bg-yellow-500/5"
                  : "border-border bg-card hover:border-yellow-500/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted/50 rounded-lg">
                  <Star size={16} className={milestoneData.isSpecial ? "text-yellow-500 fill-current" : ""} />
                </div>
                <div className="text-left">
                  <div className="font-medium text-foreground">Special Milestone</div>
                  <div className="text-sm text-muted-foreground">
                    {milestoneData.isSpecial ? "Will be highlighted with special styling" : "Mark as extra special"}
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Create Button */}
          <Button className="w-full py-3 rounded-2xl font-medium">
            Create Milestone
          </Button>
        </div>
      </div>
    );
  }

  // Placeholder for other steps
  return (
    <div className="max-w-md mx-auto px-4 py-6 text-center">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setStep("selectFeature")}
          className="p-2 hover:bg-muted rounded-xl transition-colors"
        >
          <ArrowLeft size={20} className="text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Coming Soon</h1>
          <p className="text-muted-foreground">This feature is being built</p>
        </div>
      </div>
      
      <p className="text-muted-foreground">
        {selectedFeature === "mediaOrganization" && "Media organization tools"}
        {selectedFeature === "privacyOverrides" && "Privacy override settings"}
        {selectedFeature === "designPersonalization" && "Design customization options"}
      </p>
    </div>
  );
};

export default DeepenTimelineFlow;
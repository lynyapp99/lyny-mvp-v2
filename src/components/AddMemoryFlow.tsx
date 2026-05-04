import { useState } from "react";
import { ArrowLeft, Camera, Type, Link as LinkIcon, MapPin, Tag, Calendar, ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimelineSelector from "./TimelineSelector";
import { type Timeline } from "@/data/mockData";

interface AddMemoryFlowProps {
  onBack: () => void;
}

type MemoryType = "photo" | "text" | "link" | "embed";
type Step = "selectTimeline" | "selectType" | "createContent";

interface MemoryData {
  type: MemoryType;
  content: string;
  files: File[];
  date: string;
  location: string;
  tags: string[];
  privacy: "inherit" | "private" | "restricted";
  embedUrl?: string;
  embedTitle?: string;
  embedDescription?: string;
}

const AddMemoryFlow = ({ onBack }: AddMemoryFlowProps) => {
  const [step, setStep] = useState<Step>("selectTimeline");
  const [selectedTimeline, setSelectedTimeline] = useState<Timeline | null>(null);
  const [memoryData, setMemoryData] = useState<MemoryData>({
    type: "photo",
    content: "",
    files: [],
    date: new Date().toISOString().split('T')[0],
    location: "",
    tags: [],
    privacy: "inherit",
    embedUrl: "",
    embedTitle: "",
    embedDescription: "",
  });

  const memoryTypes = [
    {
      id: "photo" as const,
      icon: Camera,
      title: "Photo/Video",
      description: "Share visual memories",
      color: "from-brand-blue to-brand-purple",
    },
    {
      id: "text" as const,
      icon: Type,
      title: "Text Note",
      description: "Write about your experience",
      color: "from-brand-green to-brand-blue",
    },
    {
      id: "embed" as const,
      icon: ExternalLink,
      title: "Social Embed",
      description: "Share from YouTube, Instagram, etc.",
      color: "from-brand-orange to-brand-pink",
    },
    {
      id: "link" as const,
      icon: LinkIcon,
      title: "Link/Attachment",
      description: "Add external content",
      color: "from-brand-purple to-brand-orange",
    },
  ];

  const handleTimelineSelect = (timeline: Timeline) => {
    setSelectedTimeline(timeline);
    setStep("selectType");
  };

  const handleTypeSelect = (type: MemoryType) => {
    setMemoryData({ ...memoryData, type });
    setStep("createContent");
  };

  const handleAddTag = (tag: string) => {
    if (tag && !memoryData.tags.includes(tag)) {
      setMemoryData({
        ...memoryData,
        tags: [...memoryData.tags, tag]
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setMemoryData({
      ...memoryData,
      tags: memoryData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const detectEmbedProvider = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    if (url.includes('spotify.com')) return 'spotify';
    if (url.includes('maps.google.com') || url.includes('goo.gl/maps')) return 'google-maps';
    return 'generic';
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
            <h1 className="text-2xl font-bold text-foreground">Add Memory</h1>
            <p className="text-muted-foreground">Choose a timeline</p>
          </div>
        </div>

        <TimelineSelector
          onSelect={handleTimelineSelect}
          placeholder="Select timeline to add memory to..."
        />
      </div>
    );
  }

  if (step === "selectType") {
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
            <h1 className="text-2xl font-bold text-foreground">Memory Type</h1>
            <p className="text-muted-foreground">Adding to {selectedTimeline?.title}</p>
          </div>
        </div>

        <div className="space-y-4">
          {memoryTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className="w-full p-6 bg-card rounded-2xl border border-border hover:shadow-lg 
                         transition-all duration-200 text-left active:scale-95 group"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${type.color} shadow-md 
                                 group-hover:shadow-lg transition-all duration-200`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{type.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {type.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setStep("selectType")}
          className="p-2 hover:bg-muted rounded-xl transition-colors"
        >
          <ArrowLeft size={20} className="text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Memory</h1>
          <p className="text-muted-foreground">
            {memoryTypes.find(t => t.id === memoryData.type)?.title} in {selectedTimeline?.title}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Content Input */}
        {memoryData.type === "photo" && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Photos/Videos
            </label>
            <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Camera size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Tap to add photos or videos</p>
            </div>
          </div>
        )}

        {memoryData.type === "text" && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Your Memory
            </label>
            <textarea
              placeholder="Tell us about this moment..."
              value={memoryData.content}
              onChange={(e) => setMemoryData({ ...memoryData, content: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 
                       text-foreground placeholder:text-muted-foreground resize-none
                       focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
            />
          </div>
        )}

        {memoryData.type === "embed" && (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Paste a Link
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=... ou https://instagram.com/p/..."
                value={memoryData.embedUrl}
                onChange={(e) => setMemoryData({ ...memoryData, embedUrl: e.target.value })}
                className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 
                         text-foreground placeholder:text-muted-foreground
                         focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Suportamos YouTube, Instagram, TikTok, Twitter, Spotify e Google Maps
              </p>
            </div>

            {/* Live Preview */}
            {memoryData.embedUrl && (
              <div className="p-4 bg-muted/30 rounded-2xl border border-dashed border-border">
                <div className="flex items-center gap-2 mb-2">
                  {detectEmbedProvider(memoryData.embedUrl) === 'youtube' && <Play size={16} className="text-red-500" />}
                  {detectEmbedProvider(memoryData.embedUrl) === 'instagram' && <div className="w-4 h-4 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-sm" />}
                  {detectEmbedProvider(memoryData.embedUrl) === 'spotify' && <Play size={16} className="text-green-500" />}
                  <span className="text-sm text-muted-foreground capitalize">
                    {detectEmbedProvider(memoryData.embedUrl)} detectado
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Preview será gerado automaticamente
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Título Personalizado (Opcional)
              </label>
              <input
                type="text"
                placeholder="Adicione um título personalizado..."
                value={memoryData.embedTitle}
                onChange={(e) => setMemoryData({ ...memoryData, embedTitle: e.target.value })}
                className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 
                         text-foreground placeholder:text-muted-foreground
                         focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
              />
            </div>
          </>
        )}

        {memoryData.type === "link" && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Link or URL
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              value={memoryData.content}
              onChange={(e) => setMemoryData({ ...memoryData, content: e.target.value })}
              className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
            />
          </div>
        )}

        {/* Caption for Embed */}
        {memoryData.type === "embed" && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Caption (Opcional)
            </label>
            <textarea
              placeholder="Adicione uma legenda ao seu embed..."
              value={memoryData.content}
              onChange={(e) => setMemoryData({ ...memoryData, content: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 
                       text-foreground placeholder:text-muted-foreground resize-none
                       focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
            />
          </div>
        )}

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Calendar size={16} />
            Date
          </label>
          <input
            type="date"
            value={memoryData.date}
            onChange={(e) => setMemoryData({ ...memoryData, date: e.target.value })}
            className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 
                     text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <MapPin size={16} />
            Location (Optional)
          </label>
          <input
            type="text"
            placeholder="Where was this?"
            value={memoryData.location}
            onChange={(e) => setMemoryData({ ...memoryData, location: e.target.value })}
            className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 
                     text-foreground placeholder:text-muted-foreground
                     focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Tag size={16} />
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {memoryData.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm 
                         flex items-center gap-2 cursor-pointer hover:bg-primary/20"
                onClick={() => handleRemoveTag(tag)}
              >
                #{tag}
                <span className="text-xs">×</span>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add tags..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const tag = e.currentTarget.value.trim().replace('#', '');
                if (tag) {
                  handleAddTag(tag);
                  e.currentTarget.value = '';
                }
              }
            }}
            className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 
                     text-foreground placeholder:text-muted-foreground
                     focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
          />
          <p className="text-xs text-muted-foreground mt-1">Press Enter to add tags</p>
        </div>

        {/* Add Memory Button */}
        <Button 
          className="w-full py-3 rounded-2xl font-medium"
          disabled={
            (memoryData.type === "text" && !memoryData.content.trim()) ||
            (memoryData.type === "link" && !memoryData.content.trim()) ||
            (memoryData.type === "embed" && !memoryData.embedUrl.trim())
          }
        >
          Add Memory
        </Button>
      </div>
    </div>
  );
};

export default AddMemoryFlow;
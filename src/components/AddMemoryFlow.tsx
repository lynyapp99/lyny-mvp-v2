import { useRef, useState } from "react";
import { ArrowLeft, Camera, Type, Link as LinkIcon, MapPin, Tag, Calendar, ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimelineSelector from "./TimelineSelector";
import { type Timeline } from "@/types/timeline";

interface AddMemoryFlowProps {
  onBack: () => void;
}

type MemoryType = "photo" | "text" | "link" | "embed";
type Step = "selectTimeline" | "selectType" | "createContent";

interface MemoryData {
  type: MemoryType;
  files: File[];
  tags: string[];
  privacy: "inherit" | "private" | "restricted";
  embedDescription?: string;
}

const AddMemoryFlow = ({ onBack }: AddMemoryFlowProps) => {
  const [step, setStep] = useState<Step>("selectTimeline");
  const [selectedTimeline, setSelectedTimeline] = useState<Timeline | null>(null);
  const [memoryData, setMemoryData] = useState<MemoryData>({
    type: "photo",
    files: [],
    tags: [],
    privacy: "inherit",
    embedDescription: "",
  });

  // Uncontrolled inputs to keep typing fast and focus stable.
  const contentRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);
  const embedUrlRef = useRef<HTMLInputElement>(null);
  const embedTitleRef = useRef<HTMLInputElement>(null);
  const embedCaptionRef = useRef<HTMLTextAreaElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const [embedUrlPreview, setEmbedUrlPreview] = useState("");

  const memoryTypes = [
    {
      id: "photo" as const,
      icon: Camera,
      title: "Foto/Vídeo",
      description: "Compartilhe memórias visuais",
      color: "from-brand-blue to-brand-purple",
    },
    {
      id: "text" as const,
      icon: Type,
      title: "Nota de texto",
      description: "Escreva sobre o momento",
      color: "from-brand-green to-brand-blue",
    },
    {
      id: "embed" as const,
      icon: ExternalLink,
      title: "Mídia social",
      description: "Compartilhe de YouTube, Instagram, etc.",
      color: "from-brand-orange to-brand-pink",
    },
    {
      id: "link" as const,
      icon: LinkIcon,
      title: "Link/Anexo",
      description: "Adicione conteúdo externo",
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
            <h1 className="text-2xl font-bold text-foreground">Adicionar memória</h1>
            <p className="text-muted-foreground">Escolha uma timeline</p>
          </div>
        </div>

        <TimelineSelector
          onSelect={handleTimelineSelect}
          placeholder="Selecione uma timeline..."
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
            <h1 className="text-2xl font-bold text-foreground">Tipo de memória</h1>
            <p className="text-muted-foreground">Adicionando em {selectedTimeline?.title}</p>
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
          <h1 className="text-2xl font-bold text-foreground">Criar memória</h1>
          <p className="text-muted-foreground">
            {memoryTypes.find(t => t.id === memoryData.type)?.title} em {selectedTimeline?.title}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Content Input */}
        {memoryData.type === "photo" && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Fotos/Vídeos
            </label>
            <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Camera size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Toque para adicionar fotos ou vídeos</p>
            </div>
          </div>
        )}

        {memoryData.type === "text" && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Sua memória
            </label>
            <textarea
              ref={contentRef as React.RefObject<HTMLTextAreaElement>}
              placeholder="Conte sobre este momento..."
              defaultValue=""
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
                Cole um link
              </label>
              <input
                ref={embedUrlRef}
                type="url"
                placeholder="https://youtube.com/watch?v=... ou https://instagram.com/p/..."
                defaultValue=""
                onBlur={(e) => setEmbedUrlPreview(e.target.value)}
                className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 
                         text-foreground placeholder:text-muted-foreground
                         focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Suportamos YouTube, Instagram, TikTok, Twitter, Spotify e Google Maps
              </p>
            </div>

            {/* Live Preview */}
            {embedUrlPreview && (
              <div className="p-4 bg-muted/30 rounded-2xl border border-dashed border-border">
                <div className="flex items-center gap-2 mb-2">
                  {detectEmbedProvider(embedUrlPreview) === 'youtube' && <Play size={16} className="text-red-500" />}
                  {detectEmbedProvider(embedUrlPreview) === 'instagram' && <div className="w-4 h-4 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-sm" />}
                  {detectEmbedProvider(embedUrlPreview) === 'spotify' && <Play size={16} className="text-green-500" />}
                  <span className="text-sm text-muted-foreground capitalize">
                    {detectEmbedProvider(embedUrlPreview)} detectado
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Preview será gerado automaticamente
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Título personalizado (opcional)
              </label>
              <input
                ref={embedTitleRef}
                type="text"
                placeholder="Adicione um título personalizado..."
                defaultValue=""
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
              Link ou URL
            </label>
            <input
              ref={contentRef as React.RefObject<HTMLInputElement>}
              type="url"
              placeholder="https://exemplo.com"
              defaultValue=""
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
              Legenda (opcional)
            </label>
            <textarea
              ref={embedCaptionRef}
              placeholder="Adicione uma legenda ao seu embed..."
              defaultValue=""
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
            Data
          </label>
          <input
            ref={dateRef}
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 
                     text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <MapPin size={16} />
            Localização (opcional)
          </label>
          <input
            ref={locationRef}
            type="text"
            placeholder="Onde foi isso?"
            defaultValue=""
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
            placeholder="Adicionar tags..."
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
          <p className="text-xs text-muted-foreground mt-1">Pressione Enter para adicionar tags</p>
        </div>

        {/* Add Memory Button */}
        <Button 
          className="w-full py-3 rounded-2xl font-medium"
        >
          Adicionar memória
        </Button>
      </div>
    </div>
  );
};

export default AddMemoryFlow;
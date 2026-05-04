import { useState } from "react";
import { ArrowLeft, Copy, Eye, Globe, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTimelines } from "@/lib/api/timelines";
import { timelineFromRow } from "@/lib/api/adapters";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/lib/api/timelines";

interface PublicProfileSettingsProps {
  onBack: () => void;
  onPreview: () => void;
}

const PublicProfileSettings = ({ onBack, onPreview }: PublicProfileSettingsProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: dbProfile } = useProfile();
  const username = dbProfile?.username || user?.email?.split("@")[0] || "voce";
  const initialLink = `${typeof window !== "undefined" ? window.location.origin : ""}/u/${username}`;
  const [profileData, setProfileData] = useState({
    displayName: dbProfile?.display_name || username,
    bio: dbProfile?.bio || "",
    avatar: dbProfile?.avatar_url || "",
    publicTimelineIds: [] as string[],
    shareableLink: initialLink,
  });
  const [linkCopied, setLinkCopied] = useState(false);

  const { data: timelineRows = [] } = useTimelines();
  const availableTimelines = timelineRows.map(timelineFromRow).filter(timeline => 
    timeline.privacy === "shared" || timeline.privacy === "public"
  );

  const handleSave = () => {
    toast({
      title: "Perfil atualizado",
      description: "As configurações do seu perfil público foram salvas.",
    });
    onBack();
  };

  const handleTimelineToggle = (timelineId: string) => {
    const isSelected = profileData.publicTimelineIds.includes(timelineId);
    
    if (isSelected) {
      setProfileData({
        ...profileData,
        publicTimelineIds: profileData.publicTimelineIds.filter(id => id !== timelineId)
      });
    } else {
      setProfileData({
        ...profileData,
        publicTimelineIds: [...profileData.publicTimelineIds, timelineId]
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileData.shareableLink);
      setLinkCopied(true);
      toast({
        title: "Link copiado",
        description: "O link do seu perfil foi copiado.",
      });
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Falha ao copiar",
        description: "Copie o link manualmente.",
        variant: "destructive",
      });
    }
  };

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
          <h1 className="text-2xl font-bold text-foreground">Perfil público</h1>
          <p className="text-muted-foreground">Personalize o seu perfil compartilhável</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Preview & Share Section */}
        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={16} className="text-primary" />
            <span className="font-medium text-primary">Perfil público</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                value={profileData.shareableLink}
                readOnly
                className="flex-1 text-sm bg-background"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="flex items-center gap-2"
              >
                {linkCopied ? <Check size={16} /> : <Copy size={16} />}
                {linkCopied ? "Copiado" : "Copiar"}
              </Button>
            </div>
            
            <Button
              variant="outline"
              onClick={onPreview}
              className="w-full flex items-center gap-2"
            >
              <Eye size={16} />
              Pré-visualizar
            </Button>
          </div>
        </div>

        {/* Display Name */}
        <div className="space-y-2">
          <Label htmlFor="displayName">Nome de exibição</Label>
          <Input
            id="displayName"
            value={profileData.displayName}
            onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
            placeholder="Como as outras pessoas devem ver seu nome?"
          />
        </div>

        {/* Avatar */}
        <div className="space-y-2">
          <Label>Foto de perfil</Label>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profileData.avatar} />
              <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                {profileData.displayName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              Alterar foto
            </Button>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={profileData.bio}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            placeholder="Conte um pouco sobre você..."
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            {profileData.bio.length}/160 caracteres
          </p>
        </div>

        {/* Public Timelines */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Timelines públicas</Label>
            <span className="text-sm text-muted-foreground">
              {profileData.publicTimelineIds.length} selecionada{profileData.publicTimelineIds.length !== 1 ? "s" : ""}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Escolha quais timelines aparecem no seu perfil público
          </p>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableTimelines.map((timeline) => (
              <div
                key={timeline.id}
                className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  profileData.publicTimelineIds.includes(timeline.id)
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
                onClick={() => handleTimelineToggle(timeline.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={timeline.cover}
                      alt={timeline.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{timeline.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {timeline.subtitle}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{timeline.items} itens</span>
                      <span>•</span>
                      <span className="capitalize">
                        {timeline.privacy === "public" ? "Pública" : timeline.privacy === "shared" ? "Compartilhada" : "Privada"}
                      </span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    profileData.publicTimelineIds.includes(timeline.id)
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  }`}>
                    {profileData.publicTimelineIds.includes(timeline.id) && (
                      <Check size={12} className="text-primary-foreground" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {availableTimelines.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">Nenhuma timeline compartilhável</p>
              <p className="text-sm text-muted-foreground">
                Marque suas timelines como compartilhadas ou públicas para selecioná-las aqui
              </p>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 flex items-center gap-2"
          >
            <Share2 size={16} />
            Salvar perfil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublicProfileSettings;
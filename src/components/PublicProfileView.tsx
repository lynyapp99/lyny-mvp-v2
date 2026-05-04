import { ArrowLeft, ExternalLink, Users, Calendar, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTimelines } from "@/lib/api/timelines";
import { timelineFromRow } from "@/lib/api/adapters";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/lib/api/timelines";

interface PublicProfileViewProps {
  onBack?: () => void;
  isPreview?: boolean;
}

const PublicProfileView = ({ onBack, isPreview = false }: PublicProfileViewProps) => {
  const { user } = useAuth();
  const { data: dbProfile } = useProfile();
  const profile = {
    displayName: dbProfile?.display_name || dbProfile?.username || user?.email?.split("@")[0] || "Você",
    bio: dbProfile?.bio || "",
    avatar: dbProfile?.avatar_url || "",
  };
  const { data: timelineRows = [] } = useTimelines();
  const publicTimelines = timelineRows
    .map(timelineFromRow)
    .filter((timeline) => timeline.privacy === "public");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back/close button for preview */}
      {isPreview && onBack && (
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="flex items-center gap-2 p-2 hover:bg-muted rounded-xl transition-colors"
              >
                <ArrowLeft size={20} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Voltar</span>
              </button>
              <span className="text-sm font-medium text-primary">Pré-visualização</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
              {profile.displayName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">{profile.displayName}</h1>
          
          {profile.bio && (
            <p className="text-muted-foreground mb-4 px-4">{profile.bio}</p>
          )}

          {/* Public Stats */}
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">{publicTimelines.length}</div>
              <div className="text-xs text-muted-foreground">Timelines públicas</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">
                {publicTimelines.reduce((sum, timeline) => sum + timeline.items, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Memórias compartilhadas</div>
            </div>
          </div>
        </div>

        {/* Public Timelines Grid */}
        {publicTimelines.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">Timelines compartilhadas</h2>
            
            <div className="grid gap-4">
              {publicTimelines.map((timeline) => (
                <div
                  key={timeline.id}
                  className="bg-card rounded-2xl border border-border overflow-hidden 
                           hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  {/* Timeline Cover */}
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={timeline.cover}
                      alt={timeline.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 
                                    flex items-center justify-center">
                            <div class="text-4xl font-bold text-primary">${timeline.title.charAt(0)}</div>
                          </div>
                        `;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Timeline Title Overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold text-lg leading-tight">
                        {timeline.title}
                      </h3>
                    </div>
                  </div>

                  {/* Timeline Info */}
                  <div className="p-4">
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {timeline.subtitle}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {timeline.members} {timeline.members === 1 ? 'membro' : 'membros'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(timeline.updatedAt)}
                        </span>
                      </div>
                      
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {timeline.items} memórias
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma timeline pública</h3>
            <p className="text-muted-foreground text-sm px-4">
              {profile.displayName} ainda não compartilhou timelines publicamente.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
            Feito com <Heart size={12} className="text-accent fill-accent" /> no Lyny
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicProfileView;
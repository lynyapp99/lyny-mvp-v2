import { useState } from "react";
import { Settings, Camera, Eye, Share2, Copy, Globe, Plus, Check, ExternalLink, Shield } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { GlassCard } from "@/components/ui/glass-card";
import { IOSButton } from "@/components/ui/ios-button";
import { SpringAnimation } from "@/components/ui/spring-animation";
import PublicProfileSettings from "@/components/PublicProfileSettings";
import PublicProfileView from "@/components/PublicProfileView";
import SettingsScreen from "@/components/SettingsScreen";
import HiddenTimelinesAccess from "@/components/HiddenTimelinesAccess";
import { mockUserProfile, togglePublicProfile } from "@/data/profileData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useTimelines } from "@/lib/api/timelines";
import { timelineFromRow } from "@/lib/api/adapters";
import { useNavigate } from "react-router-dom";

type ProfileView = "main" | "publicSettings" | "publicPreview" | "settings" | "hiddenAccess";

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: dbProfile } = useProfile();
  const { data: timelineRows = [] } = useTimelines();
  const [currentView, setCurrentView] = useState<ProfileView>("main");
  const [profileState, setProfileState] = useState(mockUserProfile);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showHiddenAccess, setShowHiddenAccess] = useState(false);

  const allTimelines = timelineRows.map(timelineFromRow);
  const publicTimelines = allTimelines.filter((t) => t.privacy === "public");

  const displayName = dbProfile?.display_name || dbProfile?.username || user?.email?.split("@")[0] || "You";
  const avatarUrl = dbProfile?.avatar_url ?? undefined;
  const bio = dbProfile?.bio ?? "";

  const handlePublicProfileToggle = (enabled: boolean) => {
    togglePublicProfile(enabled);
    setProfileState({ ...profileState, publicProfile: { ...profileState.publicProfile, enabled } });
    
    if (enabled) {
      toast({
        title: "Public profile enabled",
        description: "You can now customize and share your profile.",
      });
    } else {
      toast({
        title: "Public profile disabled",
        description: "Your profile is now private and not shareable.",
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileState.publicProfile.shareableLink);
      setLinkCopied(true);
      toast({
        title: "Link copied!",
        description: "Your profile link has been copied to clipboard.",
      });
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  const handleHiddenAccessGranted = () => {
    window.location.href = '/hidden-timelines';
  };

  // Handle different views
  if (currentView === "publicSettings") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <PublicProfileSettings
          onBack={() => setCurrentView("main")}
          onPreview={() => setCurrentView("publicPreview")}
        />
        <Navigation />
      </div>
    );
  }

  if (currentView === "publicPreview") {
    return (
      <div className="min-h-screen bg-background">
        <PublicProfileView
          onBack={() => setCurrentView("publicSettings")}
          isPreview={true}
        />
      </div>
    );
  }

  if (currentView === "settings") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <SettingsScreen
          onBack={() => setCurrentView("main")}
          onPrivacySettings={() => setCurrentView("publicSettings")}
        />
        <Navigation />
      </div>
    );
  }

  // Main Profile View - Focused on Public Profile
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header with Settings Gear */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-display text-foreground">Perfil</h1>
            <p className="text-muted-foreground mt-1">Sua identidade compartilhável</p>
          </div>
          <IOSButton
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView("settings")}
            className="rounded-2xl"
            aria-label="Configurações"
          >
            <Settings size={24} className="text-muted-foreground" />
          </IOSButton>
        </div>

        {/* Public Profile Toggle */}
        <GlassCard className="p-4 mb-6 bg-surface border border-divider">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-surface-2 border border-divider rounded-xl">
                <Globe size={20} className="text-primary" />
              </div>
              <div>
                <div className="font-semibold text-foreground">Perfil público</div>
                <div className="text-sm text-muted-foreground">
                  {user.publicProfile.enabled ? "Visível para outras pessoas" : "Apenas privado"}
                </div>
              </div>
            </div>
            <Switch
              checked={user.publicProfile.enabled}
              onCheckedChange={handlePublicProfileToggle}
            />
          </div>
          
          {user.publicProfile.enabled && (
            <div className="text-xs text-muted-foreground">
              {publicTimelines.length} timeline{publicTimelines.length !== 1 ? 's' : ''} shared publicly
            </div>
          )}
        </GlassCard>

        {/* Public Profile Preview */}
        {user.publicProfile.enabled ? (
          <div className="space-y-6">
            {/* Profile Header Preview */}
            <div className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarImage src={user.publicProfile.avatar} />
                <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                  {user.publicProfile.displayName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-bold text-foreground">{user.publicProfile.displayName}</h2>
              
              {user.publicProfile.bio && (
                <p className="text-muted-foreground mt-2 px-4">{user.publicProfile.bio}</p>
              )}

              {/* Public Stats */}
              <div className="flex justify-center gap-6 mt-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">{publicTimelines.length}</div>
                  <div className="text-xs text-muted-foreground">Timelines</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">
                    {publicTimelines.reduce((sum, timeline) => sum + timeline.items, 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Memories</div>
                </div>
              </div>
            </div>

            {/* Public Timelines Preview */}
            {publicTimelines.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Shared Timelines</h3>
                <div className="grid gap-3">
                  {publicTimelines.slice(0, 3).map((timeline) => (
                    <div
                      key={timeline.id}
                      className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={timeline.cover}
                          alt={timeline.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{timeline.title}</h4>
                        <p className="text-sm text-muted-foreground">{timeline.items} memories</p>
                      </div>
                    </div>
                  ))}
                  {publicTimelines.length > 3 && (
                    <div className="text-center py-2">
                      <span className="text-sm text-muted-foreground">
                        +{publicTimelines.length - 3} more timeline{publicTimelines.length - 3 !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/30 rounded-2xl">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus size={24} className="text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Your public profile is empty</h3>
                <p className="text-sm text-muted-foreground mb-4 px-4">
                  Choose which timelines you want to share with others
                </p>
                <Button
                  onClick={() => setCurrentView("publicSettings")}
                  variant="outline"
                  size="sm"
                >
                  Select Timelines
                </Button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <IOSButton
                  onClick={() => setCurrentView("publicSettings")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Camera size={16} />
                  Edit Profile
                </IOSButton>
                <IOSButton
                  onClick={() => setCurrentView("publicPreview")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Eye size={16} />
                  Preview
                </IOSButton>
              </div>
              
              <IOSButton
                onClick={handleCopyLink}
                className="w-full flex items-center gap-2"
              >
                {linkCopied ? <Check size={16} /> : <Copy size={16} />}
                {linkCopied ? "Link Copied!" : "Copy Shareable Link"}
              </IOSButton>
            </div>
          </div>
        ) : (
          /* Public Profile Disabled State */
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe size={32} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">Share Your Story</h2>
            <p className="text-muted-foreground mb-6 px-4">
              Create a public profile to share your favorite timelines and memories with others.
            </p>
            <div className="space-y-4">
              <div className="text-left bg-muted/30 rounded-2xl p-4">
                <h4 className="font-medium text-foreground mb-2">What gets shared:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Your display name and bio</li>
                  <li>• Timelines you choose to make public</li>
                  <li>• Timeline covers and descriptions only</li>
                </ul>
              </div>
              <div className="text-left bg-primary/5 rounded-2xl p-4 border border-primary/20">
                <h4 className="font-medium text-primary mb-2">What stays private:</h4>
                <ul className="text-sm text-primary/80 space-y-1">
                  <li>• Individual memories and photos</li>
                  <li>• Member details and comments</li>
                  <li>• Private and relationship timelines</li>
                </ul>
              </div>
              <IOSButton
                onClick={() => handlePublicProfileToggle(true)}
                className="w-full flex items-center gap-2"
              >
                <ExternalLink size={16} />
                Enable Public Profile
              </IOSButton>
            </div>
          </div>
        )}
        
        {/* Discrete Hidden Timelines Access - Only visible after triple tap */}
        {showHiddenAccess && (
          <div className="mt-8 p-4 bg-muted/20 rounded-2xl border border-muted">
            <HiddenTimelinesAccess onAccess={handleHiddenAccessGranted} />
          </div>
        )}
        
        {/* Discrete trigger for hidden access - invisible tap area */}
        <div 
          className="h-8 w-full opacity-0"
          onClick={(e) => {
            const now = Date.now();
            const lastTap = Number(localStorage.getItem('lastTap') || 0);
            const tapCount = Number(localStorage.getItem('tapCount') || 0);
            
            if (now - lastTap < 500) {
              const newCount = tapCount + 1;
              localStorage.setItem('tapCount', String(newCount));
              if (newCount >= 3) {
                setShowHiddenAccess(true);
                localStorage.removeItem('tapCount');
                localStorage.removeItem('lastTap');
              }
            } else {
              localStorage.setItem('tapCount', '1');
            }
            localStorage.setItem('lastTap', String(now));
          }}
        />
      </div>

      <Navigation />
    </div>
  );
};

export default Profile;
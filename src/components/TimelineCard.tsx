import { Calendar, Users as UsersIcon, Lock, Heart, Eye, MessageSquare, MoreVertical } from "lucide-react";

interface TimelineCardProps {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  color?: "pink" | "blue" | "green" | "yellow" | "purple" | "orange";
  memberCount?: number;
  members?: number;
  lastActivity?: string;
  updatedAt?: string;
  coverImage?: string;
  cover?: string;
  isPrivate?: boolean;
  privacy?: "private" | "shared" | "public";
  favorite?: boolean;
  items?: number;
  tags?: string[];
  recentMedia?: string[];
  isHidden?: boolean;
  authMethod?: "biometric" | "password";
  onClick?: () => void;
  onFavoriteToggle?: (id: string) => void;
  onLongPress?: (id: string) => void;
  isEditMode?: boolean;
  onRemove?: (id: string) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, id: string) => void;
}

const TimelineCard = ({
  id,
  title,
  subtitle,
  description,
  color = "blue",
  memberCount,
  members,
  lastActivity,
  updatedAt,
  coverImage,
  cover,
  isPrivate = true,
  privacy = "private",
  favorite = false,
  items,
  tags = [],
  recentMedia = [],
  isHidden = false,
  authMethod,
  onClick,
  onFavoriteToggle,
  onLongPress,
  isEditMode = false,
  onRemove,
  draggable = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: TimelineCardProps) => {
  const finalLastActivity = lastActivity || updatedAt || "";
  const finalMembers = members || memberCount || 0;
  const finalCover = cover || coverImage;
  const finalDescription = subtitle || description || "";

  // Long press handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!onLongPress) return;
    
    const longPressTimer = setTimeout(() => {
      onLongPress(id);
      // Add haptic feedback simulation
      if ("vibrate" in navigator) {
        navigator.vibrate([10, 10, 10]);
      }
    }, 500);

    const handleMouseUp = () => {
      clearTimeout(longPressTimer);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mouseup', handleMouseUp);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays} dia${diffDays !== 1 ? 's' : ''} atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) !== 1 ? 's' : ''} atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  // If this is a hidden timeline, render the sophisticated locked version
  if (isHidden) {
    return (
      <div
        onClick={onClick}
        className="timeline-card group cursor-pointer w-72 flex-shrink-0 transition-all duration-200 hover:scale-105"
        role="button"
        tabIndex={0}
        aria-label={`Hidden Timeline, locked, requires ${authMethod === "biometric" ? "biometric" : "password"} authentication to open`}
      >
        <div className="relative h-40 overflow-hidden rounded-t-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-900 flex items-center justify-center shadow-lg">
          <div className="text-center">
            <div className="p-4 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full mb-3 shadow-inner">
              <Lock size={28} className="text-slate-600 dark:text-slate-300" />
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-lg leading-tight mb-1">
              Timeline Oculta
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Requer autenticação
            </p>
          </div>
          
          {/* Subtle auth method indicator */}
          <div className="absolute top-3 right-3">
            <div className="p-1.5 bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-full">
              {authMethod === "biometric" ? (
                <Calendar size={14} className="text-slate-500 dark:text-slate-400" />
              ) : (
                <Lock size={14} className="text-slate-500 dark:text-slate-400" />
              )}
            </div>
          </div>
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent dark:from-black/20" />
        </div>
        
        <div className="p-4 bg-card border border-border rounded-b-2xl">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-2">
              <Lock size={12} />
              <span>
                {authMethod === "biometric" ? "Face ID / Touch ID" : "Protegido por Senha"}
              </span>
            </div>
          </div>
          
          {/* Members and date info if available */}
          {(finalMembers > 0 || finalLastActivity) && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {finalMembers > 0 && (
                <div className="flex items-center gap-1">
                  <UsersIcon size={12} />
                  <span>{finalMembers} membro{finalMembers !== 1 ? 's' : ''}</span>
                </div>
              )}
              
              {finalLastActivity && (
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{formatDate(finalLastActivity)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={isEditMode ? undefined : () => {
        if ("vibrate" in navigator) navigator.vibrate(10);
        onClick?.();
      }}
      onMouseDown={isEditMode ? undefined : handleMouseDown}
      draggable={draggable && isEditMode}
      onDragStart={(e) => onDragStart?.(e, id)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, id)}
      className={`timeline-card group cursor-pointer w-full transition-all duration-150 active:scale-[0.98] relative touch-manipulation ${
        isEditMode ? 'animate-wobble' : ''
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (!isEditMode && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          if ("vibrate" in navigator) navigator.vibrate(10);
          onClick?.();
        }
      }}
      aria-label={`Timeline: ${title}, ${finalMembers} membros, atualizado ${formatDate(finalLastActivity)}`}
    >
      {/* Remove button in edit mode */}
      {isEditMode && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if ("vibrate" in navigator) navigator.vibrate(20);
            onRemove(id);
          }}
          className="absolute -top-2 -right-2 z-50 w-9 h-9 min-w-[44px] min-h-[44px] rounded-full bg-destructive text-destructive-foreground shadow-lg flex items-center justify-center hover:scale-110 active:scale-100 transition-all duration-150 touch-manipulation"
          aria-label={`Remover timeline ${title}`}
          style={{ padding: '12px' }}
        >
          <span className="text-xl leading-none">×</span>
        </button>
      )}
      {finalCover ? (
        <div className="relative h-40 overflow-hidden rounded-t-app-xl">
          <img
            src={finalCover}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              // Fallback to gradient if image fails to load
              const target = e.target as HTMLImageElement;
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full bg-gradient-to-br ${getGradientFromColor(color)} flex items-center justify-center">
                    <div class="text-center">
                      <div class="text-2xl mb-2">${getSectorEmoji(title)}</div>
                      <h3 class="font-semibold sector-title-${color} text-lg leading-tight line-clamp-2 px-4">${title}</h3>
                    </div>
                  </div>
                `;
              }
            }}
          />
          
          {/* Solid gradient overlay for text readability - 70% opacity black gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Special flagship badge for Our Restaurant Adventures */}
          {title === "Our Restaurant Adventures" && (
            <div className="absolute top-3 left-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full border border-yellow-300 shadow-lg"></div>
            </div>
          )}
          
          {/* Text overlay with solid background bar for guaranteed readability */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 pt-8 pb-3">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isEditMode) {
                    if ("vibrate" in navigator) navigator.vibrate(10);
                    onClick?.();
                  }
                }}
                disabled={isEditMode}
                className={`font-semibold sector-title-${color} text-[17px] leading-snug tracking-tight line-clamp-2 flex-1 min-h-[44px] flex items-center text-left hover:underline focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/50 rounded touch-manipulation`}
                aria-label={`Abrir timeline ${title}`}
              >
                {title}
              </button>
              {favorite && (
                <Heart size={16} className="text-red-400 fill-current flex-shrink-0 mt-1 animate-pulse" />
              )}
            </div>
            {finalDescription && (
              <p className="text-white/95 text-[14px] line-clamp-1 leading-relaxed">
                {finalDescription}
              </p>
            )}
          </div>
        </div>
      ) : (
        // Fallback gradient background when no image
        <div className={`relative h-40 overflow-hidden rounded-t-app-xl bg-gradient-to-br ${getGradientFromColor(color)} flex items-center justify-center p-4`}>
          <div className="text-center text-white max-w-full">
            <div className="text-3xl mb-3">{getSectorEmoji(title)}</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isEditMode) {
                  if ("vibrate" in navigator) navigator.vibrate(10);
                  onClick?.();
                }
              }}
              disabled={isEditMode}
              className={`font-semibold sector-title-${color} text-[17px] leading-snug tracking-tight mb-2 line-clamp-2 min-h-[44px] flex items-center justify-center hover:underline focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded touch-manipulation`}
              aria-label={`Abrir timeline ${title}`}
            >
              {title}
            </button>
            {finalDescription && (
              <p className="text-white/95 text-[14px] line-clamp-2 leading-relaxed">
                {finalDescription}
              </p>
            )}
          </div>
        </div>
      )}
      
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <UsersIcon size={14} />
              <span>{finalMembers} {finalMembers === 1 ? 'membro' : 'membros'}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{formatDate(finalLastActivity)}</span>
            </div>
          </div>
          
          {items && (
            <div className="flex items-center gap-1 font-medium text-primary">
              <span>{items}</span>
              <span className="text-muted-foreground">fotos</span>
            </div>
          )}
        </div>

        {/* Subtle showcase for Our Restaurant Adventures */}
        {title === "Our Restaurant Adventures" && (
          <div className="px-2 py-1 bg-primary/5 rounded-md border-l-2 border-primary/30">
            <div className="text-xs text-primary/80">Exemplo em destaque</div>
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-pill transition-lyny hover:bg-muted"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-pill">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Recent Media Preview */}
        {recentMedia && recentMedia.length > 0 && (
          <div className="flex -space-x-2">
            {recentMedia.slice(0, 3).map((media, index) => (
              <div
                key={index}
                className="w-7 h-7 rounded-full overflow-hidden border-2 border-background transition-lyny hover:scale-110 hover:z-10"
              >
                <img
                  src={media}
                  alt="Memória recente"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {recentMedia.length > 3 && (
              <div className="w-7 h-7 rounded-full bg-muted/50 border-2 border-background 
                            flex items-center justify-center transition-lyny hover:scale-110">
                <span className="text-xs text-muted-foreground font-medium">
                  +{recentMedia.length - 3}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions for fallback styling
const getGradientFromColor = (color?: string) => {
  const gradients = {
    pink: "from-pink-500 to-rose-500",
    blue: "from-blue-500 to-cyan-500", 
    green: "from-green-500 to-emerald-500",
    yellow: "from-yellow-500 to-orange-500",
    purple: "from-purple-500 to-violet-500",
    orange: "from-orange-500 to-red-500",
  };
  return gradients[color as keyof typeof gradients] || "from-blue-500 to-purple-500";
};

const getSectorEmoji = (title: string) => {
  if (title.toLowerCase().includes('restaurant') || title.toLowerCase().includes('coffee')) return '🍽️';
  if (title.toLowerCase().includes('travel') || title.toLowerCase().includes('vacation')) return '✈️';
  if (title.toLowerCase().includes('friend') || title.toLowerCase().includes('gaming')) return '🎮';
  if (title.toLowerCase().includes('family') || title.toLowerCase().includes('holiday')) return '👨‍👩‍👧‍👦';
  if (title.toLowerCase().includes('work') || title.toLowerCase().includes('startup') || title.toLowerCase().includes('design')) return '💼';
  return '📸';
};

export default TimelineCard;
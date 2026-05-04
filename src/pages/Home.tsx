import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar, { SearchFilters } from "@/components/SearchBar";
import TimelineCard from "@/components/TimelineCard";
import Navigation from "@/components/Navigation";
import HiddenTimelineAuth from "@/components/HiddenTimelineAuth";
import SettingsScreen from "@/components/SettingsScreen";
import { useHiddenTimelineSession } from "@/hooks/useHiddenTimelineSession";
import { GlassCard } from "@/components/ui/glass-card";
import RecentAndFavorites from "@/components/RecentAndFavorites";
import type { Timeline, Sector } from "@/types/timeline";
import { useSectors, useTimelines, useCreateSector, useDeleteSector, useCreateTimeline } from "@/lib/api/timelines";
import { buildSectorsWithTimelines } from "@/lib/api/adapters";
import { useProfile } from "@/lib/api/timelines";
import { useAuth } from "@/hooks/useAuth";
import SectorCarouselPage from "@/components/SectorCarouselPage";
import CarouselDots from "@/components/CarouselDots";
import SectorModal from "@/components/SectorModal";
import TimelineModal from "@/components/TimelineModal";
import { Button } from "@/components/ui/button";
import { Plus, Menu, Search, Smartphone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import EditModeButton from "@/components/EditModeButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TimelineShortcuts from "@/components/TimelineShortcuts";
import AddShortcutModal from "@/components/AddShortcutModal";
import AddSectorCard from "@/components/AddSectorCard";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: sectorRows = [] } = useSectors();
  const { data: timelineRows = [] } = useTimelines();
  const createSector = useCreateSector();
  const deleteSector = useDeleteSector();
  const createTimelineMut = useCreateTimeline();

  const { sectors: dbSectors, timelines: allTimelines } = buildSectorsWithTimelines(sectorRows, timelineRows);
  const getTimelinesBySector = (id: string) => allTimelines.filter((t) => t.sectorId === id);
  const searchTimelines = (q: string) => {
    const lq = q.toLowerCase();
    return allTimelines.filter((t) =>
      t.title.toLowerCase().includes(lq) ||
      (t.subtitle ?? "").toLowerCase().includes(lq) ||
      (t.tags ?? []).some((tag) => tag.toLowerCase().includes(lq))
    );
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [authTimelineId, setAuthTimelineId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    sectors: [],
    dateRange: "all",
    privacy: "all",
    favorites: false,
  });
  
  const { unlockTimeline, isTimelineUnlocked } = useHiddenTimelineSession();
  
  // Sector carousel state
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [sectorOverride, setSectorOverride] = useState<Sector[] | null>(null);
  const sectors = sectorOverride ?? dbSectors;
  const [isSectorModalOpen, setIsSectorModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [selectedSectorForTimeline, setSelectedSectorForTimeline] = useState<string>("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedTimeline, setDraggedTimeline] = useState<{id: string, sourceSectorId: string} | null>(null);
  const [shortcuts, setShortcuts] = useState<Timeline[]>([]);
  const [isShortcutsLoading, setIsShortcutsLoading] = useState(false);
  const [isAddShortcutModalOpen, setIsAddShortcutModalOpen] = useState(false);

  // Intersection Observer for active card tracking
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
            const indexAttr = entry.target.getAttribute('data-index');
            const index = indexAttr === 'add' ? sectors.length : Number(indexAttr);
            
            if (!isNaN(index)) {
              setActiveCarouselIndex(index);
              
              // Haptic feedback on snap
              if ('vibrate' in navigator) {
                navigator.vibrate(10);
              }
            }
          }
        });
      },
      { 
        root: carousel, 
        threshold: 0.75,
        rootMargin: '0px'
      }
    );

    const cards = carousel.querySelectorAll('[data-sector-card]');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [sectors.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Don't interfere with form inputs
      }
      
      if (e.key === 'ArrowLeft' && activeCarouselIndex > 0) {
        scrollToSector(activeCarouselIndex - 1);
        e.preventDefault();
      } else if (e.key === 'ArrowRight' && activeCarouselIndex < sectors.length) { // Include the add card
        scrollToSector(activeCarouselIndex + 1);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [activeCarouselIndex, sectors.length]);

  const scrollToSector = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const containerWidth = carousel.offsetWidth;
    const cardWidth = containerWidth * 0.9; // 90% width
    const gap = 16; // gap-4 = 1rem = 16px
    
    const scrollPosition = (cardWidth + gap) * index;
    carousel.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  // Sector handlers
  const handleSaveSector = async (sectorData: Omit<Sector, "id" | "members" | "timelineIds">) => {
    try {
      if (editingSector) {
        toast({ title: "Edição em breve", description: "Por enquanto crie um novo setor." });
      } else {
        await createSector.mutateAsync({
          name: sectorData.name,
          emoji: sectorData.emoji,
          color: sectorData.color,
        });
        setTimeout(() => scrollToSector(sectors.length), 100);
      }
    } catch (e: unknown) {
      toast({ title: "Não foi possível salvar o setor", description: e instanceof Error ? e.message : String(e), variant: "destructive" });
    } finally {
      setEditingSector(null);
    }
  };

  const handleEditSector = (sector: Sector) => {
    setEditingSector(sector);
    setIsSectorModalOpen(true);
  };

  const handleAddTimeline = (sectorId: string | null) => {
    setSelectedSectorForTimeline(sectorId ?? "");
    setIsTimelineModalOpen(true);
  };

  const handleSaveTimeline = async (input: {
    title: string;
    subtitle: string;
    sectorId: string | null;
    newSectorName?: string;
    coverUrl?: string;
  }) => {
    let sectorId = input.sectorId;
    if (input.newSectorName) {
      const created = await createSector.mutateAsync({
        name: input.newSectorName,
        emoji: "folder",
        color: "blue",
      });
      sectorId = created.id;
    }
    const created = await createTimelineMut.mutateAsync({
      sector_id: sectorId,
      title: input.title,
      subtitle: input.subtitle || undefined,
      cover_url: input.coverUrl,
      privacy: "private",
    });
    toast({ title: "Timeline criada" });
    navigate(`/timeline/${created.id}`);
  };

  // Get filtered timelines
  const getFilteredTimelines = () => {
    let filteredTimelines = searchQuery ? searchTimelines(searchQuery) : allTimelines;

    // Apply filters
    if (filters.sectors.length > 0) {
      filteredTimelines = filteredTimelines.filter(t => filters.sectors.includes(t.sectorId));
    }

    if (filters.privacy !== "all") {
      filteredTimelines = filteredTimelines.filter(t => t.privacy === filters.privacy);
    }

    if (filters.favorites) {
      filteredTimelines = filteredTimelines.filter(t => t.favorite);
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (filters.dateRange) {
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filteredTimelines = filteredTimelines.filter(t => 
        new Date(t.updatedAt) >= cutoffDate
      );
    }

    return filteredTimelines;
  };

  const handleTimelineClick = (timeline: Timeline) => {
    if (timeline.isHidden && !isTimelineUnlocked(timeline.id)) {
      setAuthTimelineId(timeline.id);
      return;
    }
    
    navigate(`/timeline/${timeline.id}`);
    // Add haptic feedback simulation
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleFavoriteToggle = (timelineId: string) => {
    console.log(`Toggle favorite for timeline: ${timelineId}`);
    // Add haptic feedback simulation
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleLongPress = (timelineId: string) => {
    console.log(`Long press on timeline: ${timelineId}`);
    // Add haptic feedback simulation
    if ("vibrate" in navigator) {
      navigator.vibrate([10, 10, 10]);
    }
  };

  // Edit mode handlers
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if ("vibrate" in navigator) {
      navigator.vibrate(30);
    }
  };

  // Shortcuts handlers
  const handleAddShortcut = () => {
    setIsAddShortcutModalOpen(true);
  };

  const handleAddTimelineToShortcuts = (timeline: Timeline) => {
    const maxShortcuts = 8;
    if (shortcuts.length >= maxShortcuts) {
      toast({
        title: "Limite atingido",
        description: `Você já tem ${maxShortcuts} atalhos. Remova um para adicionar outro.`,
        variant: "destructive",
      });
      return;
    }

    // Check if timeline is already in shortcuts
    if (shortcuts.some(s => s.id === timeline.id)) {
      toast({
        title: "Atalho já existe",
        description: "Esta timeline já está nos seus atalhos",
        variant: "destructive",
      });
      return;
    }

    setShortcuts(prev => [...prev, timeline]);
    toast({
      title: "Atalho adicionado",
      description: `"${timeline.title}" foi adicionada aos atalhos`,
    });
    if ("vibrate" in navigator) {
      navigator.vibrate([10, 20, 10]);
    }
  };

  const handleAddTimelinesToShortcuts = (timelines: Timeline[]) => {
    timelines.forEach((t) => handleAddTimelineToShortcuts(t));
    setIsAddShortcutModalOpen(false);
  };

  const handleRemoveShortcut = (timelineId: string) => {
    setShortcuts(prev => prev.filter(t => t.id !== timelineId));
    toast({
      title: "Atalho removido",
      description: "A timeline foi removida dos atalhos",
    });
    if ("vibrate" in navigator) {
      navigator.vibrate([10, 20, 10]);
    }
  };

  const handleReorderShortcuts = (fromIndex: number, toIndex: number) => {
    setShortcuts(prev => {
      const newShortcuts = [...prev];
      const [movedItem] = newShortcuts.splice(fromIndex, 1);
      newShortcuts.splice(toIndex, 0, movedItem);
      return newShortcuts;
    });
    toast({
      title: "Atalho reordenado",
      description: "A ordem dos atalhos foi atualizada",
    });
  };

  // Get available timelines for shortcuts (not already in shortcuts)
  const getAvailableTimelinesForShortcuts = () => {
    return allTimelines.filter(t => !shortcuts.some(s => s.id === t.id));
  };

  const handleRemoveTimeline = (timelineId: string) => {
    toast({
      title: "Timeline removida",
      description: "A timeline foi removida com sucesso",
    });
    if ("vibrate" in navigator) {
      navigator.vibrate([10, 20, 10]);
    }
  };

  const handleRemoveSector = async (sectorId: string) => {
    const sector = sectors.find(s => s.id === sectorId);
    try {
      await deleteSector.mutateAsync(sectorId);
      toast({ title: "Setor removido", description: `O setor "${sector?.name}" foi removido` });
      if ("vibrate" in navigator) navigator.vibrate([10, 20, 10]);
    } catch (e: unknown) {
      toast({ title: "Erro", description: e instanceof Error ? e.message : String(e), variant: "destructive" });
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, timelineId: string, sourceSectorId: string) => {
    setDraggedTimeline({ id: timelineId, sourceSectorId });
    e.dataTransfer.effectAllowed = "move";
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleDragEnd = () => {
    setDraggedTimeline(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetSectorId: string) => {
    e.preventDefault();
    if (!draggedTimeline) return;

    if (draggedTimeline.sourceSectorId !== targetSectorId) {
      toast({
        title: "Timeline movida",
        description: "A timeline foi movida para outro setor",
      });
      if ("vibrate" in navigator) {
        navigator.vibrate([10, 20, 10]);
      }
    }
    
    setDraggedTimeline(null);
  };

  const handleAuthSuccess = () => {
    if (authTimelineId) {
      unlockTimeline(authTimelineId);
      navigate(`/timeline/${authTimelineId}`);
      setAuthTimelineId(null);
    }
  };

  const handleAuthCancel = () => {
    setAuthTimelineId(null);
  };

  // If searching or filters applied, show search results
  if (searchQuery.trim() || filters.sectors.length > 0 || filters.dateRange !== "all" || filters.privacy !== "all" || filters.favorites) {
    const filteredTimelines = getFilteredTimelines();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-xl border-b border-border z-40">
        <div className="max-w-md mx-auto pt-4 pb-4">
          <div className="flex items-center justify-between mb-4 px-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Resultados da Busca</h1>
              <p className="text-sm text-muted-foreground">
                {filteredTimelines.length} timeline{filteredTimelines.length !== 1 ? 's' : ''} encontrada{filteredTimelines.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFilterChange={setFilters}
          />
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-md mx-auto px-4 py-6">
          {filteredTimelines.length > 0 ? (
            <div className="grid gap-4">
              {filteredTimelines.map((timeline) => (
                <TimelineCard
                  key={timeline.id}
                  {...timeline}
                  isHidden={timeline.isHidden}
                  authMethod={timeline.authMethod}
                  onClick={() => handleTimelineClick(timeline)}
                  onFavoriteToggle={handleFavoriteToggle}
                  onLongPress={handleLongPress}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Nenhum Resultado Encontrado</h3>
              <p className="text-muted-foreground text-sm">
                Tente ajustar sua busca ou filtros
              </p>
            </div>
          )}
        </div>

        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-20">
      {/* Header - Compacto */}
      <GlassCard className="sticky top-0 z-40 border-0 border-b border-border/50 safe-area-inset-top">
        <div className="max-w-md mx-auto px-4 pt-2 pb-2">
          <div className="flex items-center justify-between mb-2 relative">
            <button
              onClick={() => {
                if ("vibrate" in navigator) navigator.vibrate(10);
                setIsSettingsOpen(true);
              }}
              className="p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-app focus:outline-none focus:ring-2 focus:ring-accent/60 focus:ring-offset-2 active:scale-95 transition-all duration-150 hover:bg-muted/50 touch-manipulation"
              aria-label="Abrir menu de configurações"
            >
              <Menu className="h-5 w-5" />
            </button>
            <img src="/lyny-logo.png" alt="lyny" className="absolute left-1/2 -translate-x-1/2 h-7 w-auto" />
            <div className="flex items-center gap-2">
              <EditModeButton 
                isEditMode={isEditMode}
                onClick={toggleEditMode}
              />
              <button
                onClick={() => {
                  if ("vibrate" in navigator) navigator.vibrate(10);
                  navigate("/profile");
                }}
                className="focus:outline-none focus:ring-2 focus:ring-accent/60 focus:ring-offset-2 rounded-full"
                aria-label="Menu do usuário"
              >
                <Avatar className="h-9 w-9 border border-white/20">
                  <AvatarImage src={profile?.avatar_url ?? undefined} alt="Avatar do usuário" />
                  <AvatarFallback>
                    {(profile?.display_name || profile?.username || user?.email || "?").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </div>
          </div>

          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFilterChange={setFilters}
          />
        </div>
      </GlassCard>

      {/* Main Content */}
      <div className="relative">
        {sectors.length === 0 && allTimelines.length === 0 ? (
          <div className="max-w-md mx-auto flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-24 h-24 rounded-app-xl bg-muted/30 flex items-center justify-center mb-6">
              <Smartphone className="w-10 h-10 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <h2 className="text-[22px] font-semibold text-foreground mb-3">
              Comece sua jornada
            </h2>
            <p className="text-[17px] text-muted-foreground leading-relaxed mb-6 max-w-sm">
              Crie sua primeira timeline para começar a guardar memórias.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <Button
                onClick={() => handleAddTimeline(null)}
                className="rounded-pill flex-1"
              >
                Criar Timeline
              </Button>
              <Button
                onClick={() => setIsSectorModalOpen(true)}
                variant="outline"
                className="rounded-pill flex-1"
              >
                Criar Setor
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Timeline Shortcuts Section */}
            <div className="max-w-md mx-auto mt-6">
              <TimelineShortcuts
                shortcuts={shortcuts}
                onTimelineClick={handleTimelineClick}
                onAddShortcut={handleAddShortcut}
                onRemoveShortcut={handleRemoveShortcut}
                onReorderShortcuts={handleReorderShortcuts}
                isEditMode={isEditMode}
                onEditModeChange={setIsEditMode}
                isLoading={isShortcutsLoading}
              />
            </div>

            {/* Sector Carousel + Dots (mobile-first wrapper) */}
            {sectors.length > 0 && (
            <div className="max-w-md mx-auto">
              {/* Section Title */}
              <div className="px-4 mb-4">
                <h2 className="text-xl font-bold text-foreground">Seus Setores</h2>
                <p className="text-sm text-foreground/60">Navegue pelos seus setores de memórias</p>
              </div>

              {/* ARIA Live Region for screen readers */}
              <div role="status" aria-live="polite" className="sr-only">
                {activeCarouselIndex < sectors.length 
                  ? `Setor ${activeCarouselIndex + 1} de ${sectors.length}: ${sectors[activeCarouselIndex]?.name}`
                  : "Adicionar novo setor"}
              </div>

              {/* Sector Carousel - Com peek da seção inferior */}
              <div 
                ref={carouselRef}
                className="sectors-window flex gap-4 overflow-x-auto snap-x snap-mandatory py-6 px-[5%] scrollbar-hide [ -webkit-overflow-scrolling:touch ] [ overscroll-behavior-x:contain ] [ scroll-snap-type:x_mandatory ]"
                role="region"
                aria-roledescription="carrossel de setores"
                aria-label="Navegação entre setores"
                style={{
                  scrollPaddingLeft: '5%',
                  scrollPaddingRight: '5%'
                }}
              >
                {sectors.map((sector, index) => {
                  const sectorTimelines = getTimelinesBySector(sector.id);
                  
                  const isActive = index === activeCarouselIndex;
                  const isNeighbor = Math.abs(index - activeCarouselIndex) === 1;

                  return (
                    <SectorCarouselPage
                      key={sector.id}
                      sector={sector}
                      timelines={sectorTimelines}
                      onTimelineClick={handleTimelineClick}
                      onAddTimeline={() => handleAddTimeline(sector.id)}
                      isActive={isActive}
                      isNeighbor={isNeighbor}
                      currentIndex={index}
                      totalSectors={sectors.length}
                      isEditMode={isEditMode}
                      onRemoveTimeline={handleRemoveTimeline}
                      onRemoveSector={handleRemoveSector}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    />
                  );
                })}

                {/* Add Sector Card - Always last */}
                <AddSectorCard
                  onClick={() => setIsSectorModalOpen(true)}
                  isActive={activeCarouselIndex === sectors.length}
                  isNeighbor={Math.abs(activeCarouselIndex - sectors.length) === 1}
                />
              </div>

              {/* Carousel Navigation Dots */}
              <CarouselDots 
                total={sectors.length}
                activeIndex={activeCarouselIndex}
                sectors={sectors}
                onDotClick={scrollToSector}
              />

              {/* Progress Bar */}
              <div className="max-w-md mx-auto px-4 mt-3 mb-8">
                <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ 
                      width: `${((Math.min(activeCarouselIndex, sectors.length - 1) + 1) / sectors.length) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
            )}

            {/* Timelines without a sector */}
            {allTimelines.filter((t) => !t.sectorId).length > 0 && (
              <div className="max-w-md mx-auto px-4 mt-2 mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-foreground">Timelines</h2>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-pill gap-1"
                    onClick={() => handleAddTimeline(null)}
                  >
                    <Plus className="h-4 w-4" />
                    Nova
                  </Button>
                </div>
                <div className="grid gap-3">
                  {allTimelines
                    .filter((t) => !t.sectorId)
                    .map((timeline) => (
                      <TimelineCard
                        key={timeline.id}
                        {...timeline}
                        isHidden={timeline.isHidden}
                        authMethod={timeline.authMethod}
                        onClick={() => handleTimelineClick(timeline)}
                        onFavoriteToggle={handleFavoriteToggle}
                        onLongPress={handleLongPress}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Empty hint when only sectors exist */}
            {sectors.length === 0 && allTimelines.length > 0 && (
              <div className="max-w-md mx-auto px-4 mb-6">
                <Button
                  onClick={() => setIsSectorModalOpen(true)}
                  variant="outline"
                  className="rounded-pill w-full gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Criar Setor para organizar
                </Button>
              </div>
            )}

            {/* Recent and Favorites Section - Peek visível */}
            <div className="max-w-md mx-auto">
              <div className="max-w-md mx-auto mt-2">
                <RecentAndFavorites 
                  onTimelineClick={handleTimelineClick}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              </div>
            </div>
          </>
        )}

        {/* Edit Mode Actions Bar */}
        {isEditMode && (
          <div className="fixed bottom-20 left-0 right-0 z-40 px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-elevated p-3">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleAddShortcut}
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-pill h-10 gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Atalho
                  </Button>
                  <Button
                    onClick={() => setIsSectorModalOpen(true)}
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-pill h-10 gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Setor
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Navigation />
      
      {/* Modals */}
      <SectorModal
        isOpen={isSectorModalOpen}
        onClose={() => {
          setIsSectorModalOpen(false);
          setEditingSector(null);
        }}
        onSave={handleSaveSector}
        editingSector={editingSector}
      />

      <TimelineModal
        isOpen={isTimelineModalOpen}
        onClose={() => setIsTimelineModalOpen(false)}
        onSave={handleSaveTimeline}
        sectors={sectors}
        defaultSectorId={selectedSectorForTimeline || null}
      />

      {/* Hidden Timeline Authentication Modal */}
      {authTimelineId && (
        <HiddenTimelineAuth
          authMethod={
            allTimelines.find(t => t.id === authTimelineId)?.authMethod || "biometric"
          }
          onSuccess={handleAuthSuccess}
          onCancel={handleAuthCancel}
        />
      )}

      {/* Settings Sheet - Mobile Modal Menu */}
      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetContent side="left" className="p-0 w-[85vw]">
          <SettingsScreen
            onBack={() => setIsSettingsOpen(false)}
            onPrivacySettings={() => {
              console.log("Navigate to privacy settings");
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Add Shortcut Modal */}
      <AddShortcutModal
        isOpen={isAddShortcutModalOpen}
        onClose={() => setIsAddShortcutModalOpen(false)}
        onAddTimelines={handleAddTimelinesToShortcuts}
        availableTimelines={getAvailableTimelinesForShortcuts()}
        maxShortcuts={8}
        currentShortcutsCount={shortcuts.length}
      />
    </div>
  );
};

export default Home;
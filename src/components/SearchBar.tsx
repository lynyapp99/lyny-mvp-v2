import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useSectors } from "@/lib/api/timelines";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterChange?: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  sectors: string[];
  dateRange: "all" | "week" | "month" | "year";
  privacy: "all" | "private" | "shared" | "public";
  favorites: boolean;
}

const SearchBar = ({ searchQuery, onSearchChange, onFilterChange }: SearchBarProps) => {
  const { data: sectorRows = [] } = useSectors();
  const [filters, setFilters] = useState<SearchFilters>({
    sectors: [],
    dateRange: "all",
    privacy: "all",
    favorites: false,
  });

  const handleFilterUpdate = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      sectors: [],
      dateRange: "all",
      privacy: "all",
      favorites: false,
    };
    setFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

  const hasActiveFilters = 
    filters.sectors.length > 0 || 
    filters.dateRange !== "all" || 
    filters.privacy !== "all" || 
    filters.favorites;

  return (
    <div className="w-full px-4">
      <div className="relative">
        {/* Search Input */}
        <div className="relative">
          <Search size={18} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-9 py-2 h-[44px] bg-secondary/50 rounded-xl border-0 text-sm
                     text-foreground placeholder:text-muted-foreground
                     focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card
                     transition-all duration-200 touch-manipulation"
            aria-label="Campo de busca"
          />
          {searchQuery && (
            <button
              onClick={() => {
                if ("vibrate" in navigator) navigator.vibrate(10);
                onSearchChange("");
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full hover:bg-muted active:scale-95 transition-all duration-150 touch-manipulation"
              aria-label="Limpar busca"
            >
              <X size={14} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Filter Sheet - Hidden, only accessible programmatically if needed */}
        <Sheet>
          <SheetTrigger asChild>
            <button 
              className="hidden"
              aria-label={hasActiveFilters ? "Filtros ativos" : "Filtros"}
            >
              <Filter size={18} />
            </button>
          </SheetTrigger>
          
          <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl p-0">
            <SheetHeader className="mb-6 px-6 pt-6">
              <SheetTitle className="text-left">Filtrar Timelines</SheetTitle>
            </SheetHeader>

            <div className="space-y-6 px-6 overflow-y-auto max-h-[calc(80vh-120px)] pb-6">
              {/* Sectors Filter */}
              <div>
                <h3 className="font-semibold mb-3">Setores</h3>
                <div className="flex flex-wrap gap-2">
                  {sectorRows.map((sector) => (
                    <button
                      key={sector.id}
                      onClick={() => {
                        if ("vibrate" in navigator) navigator.vibrate(10);
                        const newSectors = filters.sectors.includes(sector.id)
                          ? filters.sectors.filter(id => id !== sector.id)
                          : [...filters.sectors, sector.id];
                        handleFilterUpdate({ sectors: newSectors });
                      }}
                      className={`flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-xl transition-all duration-150 active:scale-95 touch-manipulation ${
                        filters.sectors.includes(sector.id)
                          ? `sector-card-${sector.color} text-white`
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      aria-label={`Filtrar por setor ${sector.name}`}
                      aria-pressed={filters.sectors.includes(sector.id)}
                    >
                      <span>{sector.emoji}</span>
                      <span className="text-sm font-medium">{sector.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Date Range Filter */}
              <div>
                <h3 className="font-semibold mb-3">Período</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "all", label: "Todo o Período" },
                    { key: "week", label: "Última Semana" },
                    { key: "month", label: "Último Mês" },
                    { key: "year", label: "Último Ano" },
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => {
                        if ("vibrate" in navigator) navigator.vibrate(10);
                        handleFilterUpdate({ dateRange: option.key as any });
                      }}
                      className={`p-3 min-h-[48px] rounded-xl text-sm font-medium transition-all duration-150 active:scale-95 touch-manipulation ${
                        filters.dateRange === option.key
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      aria-label={`Filtrar por ${option.label}`}
                      aria-pressed={filters.dateRange === option.key}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Privacy Filter */}
              <div>
                <h3 className="font-semibold mb-3">Privacidade</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "all", label: "Todas" },
                    { key: "private", label: "Privadas" },
                    { key: "shared", label: "Compartilhadas" },
                    { key: "public", label: "Públicas" },
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => {
                        if ("vibrate" in navigator) navigator.vibrate(10);
                        handleFilterUpdate({ privacy: option.key as any });
                      }}
                      className={`p-3 min-h-[48px] rounded-xl text-sm font-medium transition-all duration-150 active:scale-95 touch-manipulation ${
                        filters.privacy === option.key
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      aria-label={`Filtrar por ${option.label}`}
                      aria-pressed={filters.privacy === option.key}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Favorites Toggle */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Apenas Favoritas</h3>
                <button
                  onClick={() => {
                    if ("vibrate" in navigator) navigator.vibrate(10);
                    handleFilterUpdate({ favorites: !filters.favorites });
                  }}
                  role="switch"
                  aria-checked={filters.favorites}
                  aria-label="Mostrar apenas favoritas"
                  className={`relative w-12 h-6 rounded-full transition-all duration-200 touch-manipulation ${
                    filters.favorites ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      filters.favorites ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="absolute bottom-6 left-4 right-4">
                <button
                  onClick={() => {
                    if ("vibrate" in navigator) navigator.vibrate(20);
                    clearFilters();
                  }}
                  className="w-full p-3 min-h-[48px] bg-destructive/10 text-destructive rounded-2xl font-medium transition-all duration-150 hover:bg-destructive/20 active:scale-98 touch-manipulation"
                  aria-label="Limpar todos os filtros"
                >
                  Limpar Todos os Filtros
                </button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default SearchBar;
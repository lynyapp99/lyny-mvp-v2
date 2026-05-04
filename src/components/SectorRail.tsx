import { Plus, type LucideIcon } from "lucide-react";
import { mockSectors } from "@/data/mockData";
import { getSectorIcon } from "@/lib/sectorIcons";

interface ExtendedSector {
  id: string;
  name: string;
  icon?: LucideIcon;
  emoji?: string;
  color: "pink" | "blue" | "green" | "yellow" | "purple" | "orange";
  members: Array<{ id: string; name: string; avatar?: string }>;
  timelineIds: string[];
}

interface SectorRailProps {
  activeSector: string;
  onSectorChange: (sectorId: string) => void;
  sectors?: ExtendedSector[];
}

const SectorRail = ({ activeSector, onSectorChange, sectors }: SectorRailProps) => {
  const allSectors = sectors || mockSectors;

  const SectorChip = ({ sector, isActive }: { sector: ExtendedSector; isActive: boolean }) => {
    const Icon = sector.icon ?? getSectorIcon(sector.emoji);

    return (
      <button
        onClick={() => onSectorChange(sector.id)}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl whitespace-nowrap transition-all duration-200 border ${
          isActive
            ? "bg-primary text-primary-foreground border-primary shadow-lg"
            : "bg-surface text-foreground border-divider hover:border-primary/30"
        }`}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5" strokeWidth={1.75} />
          <div className="text-left">
            <p className="font-semibold text-sm">{sector.name}</p>
            <p className={`text-xs ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              {sector.timelineIds.length} timeline{sector.timelineIds.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Member avatars */}
        {sector.members.length > 0 && (
          <div className="flex -space-x-1">
            {sector.members.slice(0, 3).map((member, index) => (
              <div
                key={member.id}
                className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                  isActive ? 'bg-primary-foreground/20 border-primary-foreground/30' : 'bg-surface-2 border-divider'
                }`}
                style={{ zIndex: 3 - index }}
              >
                <span className={`text-xs font-medium ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {member.name.charAt(0)}
                </span>
              </div>
            ))}
            {sector.members.length > 3 && (
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                isActive ? 'bg-primary-foreground/20 border-primary-foreground/30' : 'bg-surface-2 border-divider'
              }`}>
                <span className={`text-xs font-medium ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>
                  +{sector.members.length - 3}
                </span>
              </div>
            )}
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="w-full">
      <div className="flex gap-3 overflow-x-auto pb-4 px-4 scrollbar-hide">
        {/* Existing sectors */}
        {allSectors.map((sector) => (
          <SectorChip
            key={sector.id}
            sector={sector}
            isActive={activeSector === sector.id}
          />
        ))}
        
        {/* Add sector button */}
        <button className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-surface text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-200 whitespace-nowrap border border-dashed border-divider">
          <Plus size={16} />
          <span className="text-sm font-medium">Novo setor</span>
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="flex justify-center gap-1 mt-2">
        {allSectors.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === allSectors.findIndex(s => s.id === activeSector)
                ? "bg-primary w-6"
                : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SectorRail;

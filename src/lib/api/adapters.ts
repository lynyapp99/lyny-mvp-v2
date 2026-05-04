import type { SectorRow, TimelineRow, ProfileRow } from "./timelines";
import type { Sector, Timeline } from "@/data/mockData";

export const sectorFromRow = (row: SectorRow, timelineIds: string[]): Sector => ({
  id: row.id,
  name: row.name,
  emoji: row.emoji,
  color: row.color as Sector["color"],
  members: [],
  timelineIds,
});

export const timelineFromRow = (row: TimelineRow): Timeline => ({
  id: row.id,
  sectorId: row.sector_id,
  title: row.title,
  subtitle: row.subtitle ?? "",
  cover: row.cover_url ?? "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop",
  members: 1,
  updatedAt: row.updated_at,
  items: 0,
  favorite: row.favorite,
  privacy: row.privacy as Timeline["privacy"],
  tags: row.tags ?? [],
  recentMedia: [],
  isHidden: row.is_hidden,
});

export const buildSectorsWithTimelines = (sectorRows: SectorRow[], timelineRows: TimelineRow[]): { sectors: Sector[]; timelines: Timeline[] } => {
  const timelines = timelineRows.map(timelineFromRow);
  const sectors = sectorRows.map((s) =>
    sectorFromRow(s, timelines.filter((t) => t.sectorId === s.id).map((t) => t.id))
  );
  return { sectors, timelines };
};

export const profileDisplayName = (profile: ProfileRow | null | undefined, fallbackEmail?: string) =>
  profile?.display_name || profile?.username || fallbackEmail?.split("@")[0] || "You";
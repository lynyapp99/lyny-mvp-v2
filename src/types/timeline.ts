export interface Member {
  id: string;
  name: string;
  avatar: string;
}

export interface Timeline {
  id: string;
  sectorId: string | null;
  title: string;
  subtitle: string;
  cover: string;
  members: number;
  updatedAt: string;
  items: number;
  favorite: boolean;
  privacy: "private" | "shared" | "public";
  tags?: string[];
  recentMedia?: string[];
  isHidden?: boolean;
  authMethod?: "biometric" | "password";
  passwordHash?: string;
  hasNewMemories?: boolean;
}

export interface Sector {
  id: string;
  name: string;
  emoji: string;
  color: "pink" | "blue" | "green" | "purple" | "orange" | "yellow";
  members: Member[];
  timelineIds: string[];
}
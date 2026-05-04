export interface Member {
  id: string;
  name: string;
  avatar: string;
}

export interface Timeline {
  id: string;
  sectorId: string;
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

export const mockMembers: Member[] = [
  { id: "u1", name: "You", avatar: "/api/placeholder/40/40" },
  { id: "u2", name: "Ana", avatar: "/api/placeholder/40/40" },
  { id: "u3", name: "Vini", avatar: "/api/placeholder/40/40" },
  { id: "u4", name: "Mom", avatar: "/api/placeholder/40/40" },
  { id: "u5", name: "Dad", avatar: "/api/placeholder/40/40" },
  { id: "u6", name: "Sarah", avatar: "/api/placeholder/40/40" },
  { id: "u7", name: "Mike", avatar: "/api/placeholder/40/40" },
  { id: "u8", name: "Lisa", avatar: "/api/placeholder/40/40" },
];

export const mockSectors: Sector[] = [
  {
    id: "sec_0",
    name: "Quick Access",
    emoji: "⚡",
    color: "yellow",
    members: [mockMembers[0]], // You
    timelineIds: ["t14", "t15"],
  },
  {
    id: "sec_1",
    name: "Partner",
    emoji: "💛",
    color: "pink",
    members: [mockMembers[1]], // Ana
    timelineIds: ["t1", "t2"],
  },
  {
    id: "sec_2", 
    name: "Friends",
    emoji: "🎉",
    color: "green",
    members: [mockMembers[2], mockMembers[5], mockMembers[6]], // Vini, Sarah, Mike
    timelineIds: ["t4", "t5", "t6"],
  },
  {
    id: "sec_3",
    name: "Family", 
    emoji: "🏡",
    color: "blue",
    members: [mockMembers[3], mockMembers[4]], // Mom, Dad
    timelineIds: ["t7", "t8", "t9"],
  },
  {
    id: "sec_4",
    name: "Projects",
    emoji: "🚀", 
    color: "purple",
    members: [mockMembers[6], mockMembers[7]], // Mike, Lisa
    timelineIds: ["t10", "t11"],
  },
];

export const mockTimelines: Timeline[] = [
  {
    id: "t14",
    sectorId: "sec_0",
    title: "Daily Notes",
    subtitle: "Quick thoughts and daily reflections",
    cover: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop",
    members: 1,
    updatedAt: "2025-08-22",
    items: 45,
    favorite: true,
    privacy: "private",
    tags: ["Notes", "Daily"],
    recentMedia: [],
  },
  {
    id: "t15",
    sectorId: "sec_0",
    title: "Goals 2025",
    subtitle: "Personal goals and achievements",
    cover: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop",
    members: 1,
    updatedAt: "2025-08-21",
    items: 28,
    favorite: false,
    privacy: "private",
    tags: ["Goals", "Personal"],
    recentMedia: [],
  },
  {
    id: "t1",
    sectorId: "sec_1",
    title: "Our Restaurant Adventures",
    subtitle: "All the amazing places we've discovered together",
    cover: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=faces&auto=enhance",
    members: 2,
    updatedAt: "2025-08-20",
    items: 138,
    favorite: true,
    privacy: "shared", // Changed to shared so it can appear in public profile
    tags: ["Food", "Date Nights", "Partner", "Restaurants"],
    recentMedia: [
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=60&h=60&fit=crop&crop=faces", 
      "https://images.unsplash.com/photo-1546554137-f86b9593a222?w=60&h=60&fit=crop&crop=faces", 
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=60&h=60&fit=crop&crop=faces"
    ],
  },
  {
    id: "t2", 
    sectorId: "sec_1",
    title: "Weekend Coffee Dates",
    subtitle: "Our favorite cozy spots and morning rituals",
    cover: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    members: 2,
    updatedAt: "2025-08-19",
    items: 89,
    favorite: false,
    privacy: "private",
    tags: ["Coffee", "Weekends"],
    recentMedia: ["https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=60&h=60&fit=crop", "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=60&h=60&fit=crop"],
  },
  {
    id: "t4",
    sectorId: "sec_2",
    title: "Friday Night Squad", 
    subtitle: "Weekly hangouts with the best friends ever",
    cover: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=400&h=300&fit=crop",
    members: 6,
    updatedAt: "2025-08-18",
    items: 312,
    favorite: true,
    privacy: "shared",
    tags: ["Friends", "Weekly"],
    recentMedia: ["https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=60&h=60&fit=crop", "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=60&h=60&fit=crop", "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=60&h=60&fit=crop"],
  },
  {
    id: "t5",
    sectorId: "sec_2",
    title: "College Memories",
    subtitle: "Epic adventures from our university days",
    cover: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop", 
    members: 8,
    updatedAt: "2025-08-10",
    items: 567,
    favorite: false,
    privacy: "shared",
    tags: ["College", "Nostalgia"],
    recentMedia: ["https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=60&h=60&fit=crop", "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=60&h=60&fit=crop"],
  },
  {
    id: "t6",
    sectorId: "sec_2",
    title: "Gaming Nights",
    subtitle: "Epic battles and gaming sessions", 
    cover: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop",
    members: 4,
    updatedAt: "2025-08-17",
    items: 234,
    favorite: false,
    privacy: "shared", 
    tags: ["Gaming", "Entertainment"],
    recentMedia: ["https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop"],
  },
  {
    id: "t7",
    sectorId: "sec_3",
    title: "Family Vacations",
    subtitle: "Precious moments from our trips around the world",
    cover: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
    members: 5,
    updatedAt: "2025-08-13",
    items: 420,
    favorite: true,
    privacy: "private",
    tags: ["Family", "Travel"],
    recentMedia: ["https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=60&h=60&fit=crop", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=60&h=60&fit=crop", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=60&h=60&fit=crop"],
  },
  {
    id: "t8",
    sectorId: "sec_3",
    title: "Childhood Stories",
    subtitle: "Growing up together through the years",
    cover: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=400&h=300&fit=crop",
    members: 4,
    updatedAt: "2025-08-05",
    items: 189,
    favorite: false,
    privacy: "private",
    tags: ["Childhood", "Stories"],
    recentMedia: ["https://images.unsplash.com/photo-1540479859555-17af45c78602?w=60&h=60&fit=crop", "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=60&h=60&fit=crop"],
  },
  {
    id: "t9", 
    sectorId: "sec_3",
    title: "Holiday Traditions",
    subtitle: "Special moments and family celebrations",
    cover: "https://images.unsplash.com/photo-1482849297070-f4fae2173efe?w=400&h=300&fit=crop",
    members: 6,
    updatedAt: "2025-08-01",
    items: 156,
    favorite: true,
    privacy: "private",
    tags: ["Holidays", "Traditions"],
    recentMedia: ["https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=60&h=60&fit=crop"],
  },
  {
    id: "t10",
    sectorId: "sec_4", 
    title: "Startup Journey",
    subtitle: "Building our dream project from scratch",
    cover: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
    members: 3,
    updatedAt: "2025-08-19",
    items: 78,
    favorite: true,
    privacy: "shared",
    tags: ["Startup", "Work"],
    recentMedia: ["https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=60&h=60&fit=crop", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=60&h=60&fit=crop"],
  },
  {
    id: "t11",
    sectorId: "sec_4",
    title: "Design Portfolio", 
    subtitle: "Creative projects and design explorations",
    cover: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop",
    members: 2,
    updatedAt: "2025-08-14",
    items: 92,
    favorite: false,
    privacy: "shared",
    tags: ["Design", "Creative"],
    recentMedia: ["https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=60&h=60&fit=crop"],
  },
  // Hidden Timeline Examples
  {
    id: "t12",
    sectorId: "sec_1",
    title: "Personal Diary",
    subtitle: "Private thoughts and moments",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    members: 1,
    updatedAt: "2025-08-21",
    items: 67,
    favorite: false,
    privacy: "private",
    tags: ["Personal", "Diary"],
    recentMedia: [],
    isHidden: true,
    authMethod: "biometric",
  },
  {
    id: "t13", 
    sectorId: "sec_1",
    title: "Gift Ideas",
    subtitle: "Surprise plans and gift inspirations",
    cover: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
    members: 1,
    updatedAt: "2025-08-20",
    items: 23,
    favorite: true,
    privacy: "private",
    tags: ["Gifts", "Surprises"],
    recentMedia: [],
    isHidden: true,
    authMethod: "password",
    passwordHash: "hashedPassword123",
  },
];

// Helper functions
export const getTimelinesBySector = (sectorId: string): Timeline[] => {
  return mockTimelines.filter(timeline => timeline.sectorId === sectorId);
};

export const getRecentTimelines = (limit = 4): Timeline[] => {
  return mockTimelines
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
};

export const getFavoriteTimelines = (): Timeline[] => {
  return mockTimelines.filter(timeline => timeline.favorite);
};

export const searchTimelines = (query: string): Timeline[] => {
  const lowerQuery = query.toLowerCase();
  return mockTimelines.filter(timeline => 
    timeline.title.toLowerCase().includes(lowerQuery) ||
    timeline.subtitle.toLowerCase().includes(lowerQuery) ||
    timeline.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};
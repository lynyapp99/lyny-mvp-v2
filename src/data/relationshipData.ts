import { Member } from "@/types/timeline";

export interface Relationship {
  id: string;
  name: string;
  type: "one-to-one" | "group";
  members: Member[];
  timelineIds: string[];
  isPinned: boolean;
  color: "pink" | "blue" | "green" | "yellow" | "purple" | "orange";
  emoji: string;
  createdBy: string;
  createdAt: string;
  privacy: "private" | "shared";
  canEdit: string[]; // Member IDs who can edit
  canView: string[]; // Member IDs who can view
}

export const mockRelationships: Relationship[] = []; const _UNUSED_OLD_MOCK = [
  {
    id: "rel_1",
    name: "Ana & Me",
    type: "one-to-one",
    members: [
      { id: "u1", name: "You", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
      { id: "u2", name: "Ana", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" }
    ],
    timelineIds: ["t1", "t2", "t3"],
    isPinned: true,
    color: "pink",
    emoji: "💕",
    createdBy: "u1",
    createdAt: "2025-01-15",
    privacy: "private",
    canEdit: ["u1", "u2"],
    canView: ["u1", "u2"],
  },
  {
    id: "rel_2",
    name: "Family Circle",
    type: "group",
    members: [
      { id: "u1", name: "You", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
      { id: "u4", name: "Mom", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" },
      { id: "u5", name: "Dad", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
      { id: "u9", name: "Sister", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face" }
    ],
    timelineIds: ["t7", "t8", "t9"],
    isPinned: false,
    color: "blue",
    emoji: "👨‍👩‍👧‍👦",
    createdBy: "u1",
    createdAt: "2025-01-10",
    privacy: "private",
    canEdit: ["u1"],
    canView: ["u1", "u4", "u5", "u9"],
  },
  {
    id: "rel_3",
    name: "Friday Squad",
    type: "group",
    members: [
      { id: "u1", name: "You", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
      { id: "u3", name: "Vini", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" },
      { id: "u6", name: "Sarah", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face" },
      { id: "u7", name: "Mike", avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=40&h=40&fit=crop&crop=face" },
      { id: "u8", name: "Lisa", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face" }
    ],
    timelineIds: ["t4", "t5", "t6"],
    isPinned: true,
    color: "green",
    emoji: "🎉",
    createdBy: "u1",
    createdAt: "2025-01-20",
    privacy: "shared",
    canEdit: ["u1", "u3", "u6"],
    canView: ["u1", "u3", "u6", "u7", "u8"],
  },
  {
    id: "rel_4",
    name: "Work Squad",
    type: "group", 
    members: [
      { id: "u1", name: "You", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
      { id: "u7", name: "Mike", avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=40&h=40&fit=crop&crop=face" },
      { id: "u8", name: "Lisa", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face" }
    ],
    timelineIds: ["t10", "t11"],
    isPinned: false,
    color: "purple",
    emoji: "💼",
    createdBy: "u1",
    createdAt: "2025-02-01",
    privacy: "shared",
    canEdit: ["u1"],
    canView: ["u1", "u7", "u8"],
  },
  {
    id: "rel_5",
    name: "Pedro & Rodrigo", 
    type: "one-to-one",
    members: [
      { id: "u10", name: "Pedro", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=face" },
      { id: "u11", name: "Rodrigo", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" }
    ],
    timelineIds: [],
    isPinned: false,
    color: "orange",
    emoji: "🤝",
    createdBy: "u10",
    createdAt: "2025-02-05",
    privacy: "private",
    canEdit: ["u10", "u11"],
    canView: ["u10", "u11"],
  },
];

// Helper functions
export const getPinnedRelationships = (): Relationship[] => {
  return mockRelationships.filter(rel => rel.isPinned);
};

export const getRelationshipById = (id: string): Relationship | undefined => {
  return mockRelationships.find(rel => rel.id === id);
};

export const getTimelinesByRelationship = (relationshipId: string) => {
  const relationship = getRelationshipById(relationshipId);
  return relationship?.timelineIds || [];
};

export const toggleRelationshipPin = (relationshipId: string): void => {
  const relationship = mockRelationships.find(rel => rel.id === relationshipId);
  if (relationship) {
    relationship.isPinned = !relationship.isPinned;
  }
};

export const createRelationship = (data: Omit<Relationship, 'id' | 'createdAt' | 'createdBy'>): Relationship => {
  const newRelationship: Relationship = {
    ...data,
    id: `rel_${Date.now()}`,
    createdAt: new Date().toISOString(),
    createdBy: "u1", // Current user
  };
  
  mockRelationships.push(newRelationship);
  return newRelationship;
};

export const updateRelationshipName = (relationshipId: string, newName: string): void => {
  const relationship = mockRelationships.find(rel => rel.id === relationshipId);
  if (relationship) {
    relationship.name = newName;
  }
};

export const deleteRelationship = (relationshipId: string): void => {
  const index = mockRelationships.findIndex(rel => rel.id === relationshipId);
  if (index > -1) {
    mockRelationships.splice(index, 1);
  }
};
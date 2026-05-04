export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  tagline?: string;
  username: string; // For public profile URL
  stats: {
    timelines: number;
    memories: number;
    relationships: number;
  };
  publicProfile: {
    enabled: boolean;
    displayName: string;
    bio: string;
    avatar: string;
    publicTimelineIds: string[];
    shareableLink: string;
  };
  privacy: {
    profileVisibility: "private" | "public";
    allowTimelineSharing: boolean;
    showMembersInPublic: boolean;
  };
}

export const mockUserProfile: UserProfile = {
  id: "u1",
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
  bio: "Memory collector and adventure seeker ✨",
  tagline: "Creating beautiful moments, one timeline at a time",
  username: "sarahjohnson",
  stats: {
    timelines: 26,
    memories: 247,
    relationships: 4,
  },
  publicProfile: {
    enabled: true, // Enable by default to showcase the flagship timeline
    displayName: "Sarah Johnson",
    bio: "Sharing my favorite memories and adventures 🌟",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
    publicTimelineIds: ["t1"], // Include "Our Restaurant Adventures" by default
    shareableLink: "https://lyny.app/sarahjohnson",
  },
  privacy: {
    profileVisibility: "public",
    allowTimelineSharing: true,
    showMembersInPublic: false,
  },
};

// Helper functions
export const getPublicTimelines = (timelineIds: string[]) => {
  // This would filter timelines that are marked as public
  // For now, return empty array - will be implemented with actual timeline data
  return [];
};

export const updatePublicProfile = (updates: Partial<UserProfile['publicProfile']>) => {
  Object.assign(mockUserProfile.publicProfile, updates);
};

export const togglePublicProfile = (enabled: boolean) => {
  mockUserProfile.publicProfile.enabled = enabled;
  mockUserProfile.privacy.profileVisibility = enabled ? "public" : "private";
};

export const addTimelineToPublic = (timelineId: string) => {
  if (!mockUserProfile.publicProfile.publicTimelineIds.includes(timelineId)) {
    mockUserProfile.publicProfile.publicTimelineIds.push(timelineId);
  }
};

export const removeTimelineFromPublic = (timelineId: string) => {
  mockUserProfile.publicProfile.publicTimelineIds = 
    mockUserProfile.publicProfile.publicTimelineIds.filter(id => id !== timelineId);
};
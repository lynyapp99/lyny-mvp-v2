export interface TimelineMemory {
  id: string;
  timelineId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  type: "photo" | "text" | "location" | "mixed" | "embed";
  content: {
    text?: string;
    photos?: string[];
    location?: {
      name: string;
      address: string;
      coordinates?: [number, number];
    };
    embed?: {
      url: string;
      provider: "youtube" | "instagram" | "tiktok" | "twitter" | "spotify" | "google-maps" | "generic";
      title: string;
      description?: string;
      thumbnail?: string;
      embedHtml?: string;
    };
  };
  createdAt: string;
  reactions: {
    userId: string;
    type: "love" | "laugh" | "wow" | "like";
  }[];
  comments: {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    text: string;
    createdAt: string;
  }[];
  tags?: string[];
  milestone?: boolean;
}

export const mockTimelineMemories: TimelineMemory[] = [
  // Milestone Post - La Brasserie (Paris)
  {
    id: "mem_1",
    timelineId: "t1",
    authorId: "u2",
    authorName: "Ana",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    type: "mixed",
    content: {
      text: "Our favorite dinner of the trip, unforgettable memory 💕",
      photos: [
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop", // Elegant entrée
        "https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400&h=300&fit=crop", // Wine
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop"  // Dessert
      ],
      location: {
        name: "La Brasserie",
        address: "15 Avenue des Champs-Élysées, Paris",
        coordinates: [2.3014, 48.8698]
      }
    },
    createdAt: "2025-06-05T20:30:00Z",
    reactions: [
      { userId: "u1", type: "love" },
      { userId: "u1", type: "wow" }
    ],
    comments: [
      {
        id: "c1",
        userId: "u1",
        userName: "Pedro",
        userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        text: "The wine pairing was perfect! Still dreaming about that soufflé 🥂",
        createdAt: "2025-06-05T21:15:00Z"
      }
    ],
    tags: ["milestone", "travel", "french-cuisine", "romantic"],
    milestone: true
  },
  // Post 1 - Osteria Italiana (São Paulo)
  {
    id: "mem_2",
    timelineId: "t1",
    authorId: "u2",
    authorName: "Ana",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    type: "mixed",
    content: {
      text: "Best carbonara ever. Tiramisu was unforgettable 💛",
      photos: [
        "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop", // Carbonara
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"  // Couple selfie at restaurant
      ],
      location: {
        name: "Osteria Italiana",
        address: "Rua Augusta, 1200 - Consolação, São Paulo",
        coordinates: [-46.6520, -23.5505]
      }
    },
    createdAt: "2025-08-12T21:00:00Z",
    reactions: [
      { userId: "u1", type: "love" }
    ],
    comments: [
      {
        id: "c2",
        userId: "u1",
        userName: "Pedro",
        userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        text: "That tiramisu literally melted in our mouths! 🍮",
        createdAt: "2025-08-12T21:30:00Z"
      }
    ],
    tags: ["italian-food", "carbonara", "são-paulo"]
  },
  // Post 2 - Sushi Lab (Campinas)
  {
    id: "mem_3",
    timelineId: "t1",
    authorId: "u1",
    authorName: "Pedro",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    type: "mixed",
    content: {
      text: "First time trying smoked sushi at the table — amazing experience 🍣",
      photos: [
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop" // Sushi preparation
      ],
      location: {
        name: "Sushi Lab",
        address: "Av. Dr. Moraes Sales, 1002 - Campinas",
        coordinates: [-47.0608, -22.9056]
      }
    },
    createdAt: "2025-07-29T19:45:00Z",
    reactions: [
      { userId: "u2", type: "wow" },
      { userId: "u2", type: "love" }
    ],
    comments: [
      {
        id: "c3",
        userId: "u2",
        userName: "Ana",
        userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
        text: "The chef was so skilled! Watching him work was like art 👨‍🍳",
        createdAt: "2025-07-29T20:00:00Z"
      }
    ],
    tags: ["japanese-food", "experience", "campinas", "sushi"]
  },
  // Post 4 - Bar do Juarez (São Paulo)
  {
    id: "mem_4",
    timelineId: "t1",
    authorId: "u1",
    authorName: "Pedro",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    type: "photo",
    content: {
      text: "Classic Friday night tradition 🍺",
      photos: [
        "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop" // Beer glass
      ],
      location: {
        name: "Bar do Juarez",
        address: "Rua Domingos de Morais, 2564 - Vila Mariana, São Paulo",
        coordinates: [-46.6333, -23.5975]
      }
    },
    createdAt: "2025-05-18T22:15:00Z",
    reactions: [
      { userId: "u2", type: "like" },
      { userId: "u2", type: "laugh" }
    ],
    comments: [
      {
        id: "c4",
        userId: "u2",
        userName: "Ana",
        userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
        text: "Our favorite spot to unwind! The ambient is perfect 🎵",
        createdAt: "2025-05-18T22:30:00Z"
      }
    ],
    tags: ["friday-night", "tradition", "vila-mariana", "beer"]
  },
  // Additional memory for variety
  {
    id: "mem_5",
    timelineId: "t1",
    authorId: "u2",
    authorName: "Ana",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    type: "mixed",
    content: {
      text: "Sunday brunch discovery! This place has the most amazing açaí bowls 🍓",
      photos: [
        "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop"
      ],
      location: {
        name: "Café da Vila",
        address: "Rua Fradique Coutinho, 563 - Pinheiros, São Paulo",
        coordinates: [-46.6911, -23.5629]
      }
    },
    createdAt: "2025-04-14T12:30:00Z",
    reactions: [
      { userId: "u1", type: "love" }
    ],
    comments: [
      {
        id: "c5",
        userId: "u1",
        userName: "Pedro",
        userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        text: "The granola was incredible too! Perfect Sunday vibes ☀️",
        createdAt: "2025-04-14T12:45:00Z"
      }
    ],
    tags: ["brunch", "açaí", "sunday", "pinheiros"]
  },
  {
    id: "mem_6",
    timelineId: "t1",
    authorId: "u1",
    authorName: "Pedro",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    type: "text",
    content: {
      text: "Trying to recreate that truffle pasta from Rome... let's see how this goes 🍝 Ana is supervising (and laughing) 😅"
    },
    createdAt: "2025-03-22T19:00:00Z",
    reactions: [
      { userId: "u2", type: "laugh" },
      { userId: "u2", type: "love" }
    ],
    comments: [
      {
        id: "c6",
        userId: "u2",
        userName: "Ana",
        userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
        text: "It actually turned out amazing! You're getting really good at this 👨‍🍳",
        createdAt: "2025-03-22T19:30:00Z"
      }
    ],
    tags: ["cooking", "home", "pasta", "truffle"]
  },
  // EMBED EXAMPLES - YouTube Review
  {
    id: "mem_7",
    timelineId: "t1",
    authorId: "u2",
    authorName: "Ana",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    type: "embed",
    content: {
      text: "Review do chef que inspirou nossa visita à Osteria! 🍝",
      embed: {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        provider: "youtube",
        title: "MELHOR CARBONARA de São Paulo - Review Completo",
        description: "Teste completo do novo restaurante italiano na Augusta",
        thumbnail: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop"
      }
    },
    createdAt: "2025-08-10T15:20:00Z",
    reactions: [
      { userId: "u1", type: "wow" }
    ],
    comments: [
      {
        id: "c7",
        userId: "u1",
        userName: "Pedro",
        userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        text: "Foi exatamente por esse vídeo que descobrimos o lugar! 🎯",
        createdAt: "2025-08-10T15:45:00Z"
      }
    ],
    tags: ["youtube", "review", "carbonara", "inspiration"]
  },
  // EMBED - Instagram Post
  {
    id: "mem_8",
    timelineId: "t1",
    authorId: "u1",
    authorName: "Pedro",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    type: "embed",
    content: {
      text: "O próprio restaurante postou nosso prato! 📸",
      embed: {
        url: "https://www.instagram.com/p/abcdefg/",
        provider: "instagram",
        title: "Osteria Italiana - Prato do Dia",
        description: "Nossa famosa carbonara com trufa negra 🍝✨",
        thumbnail: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop"
      }
    },
    createdAt: "2025-08-13T11:30:00Z",
    reactions: [
      { userId: "u2", type: "love" },
      { userId: "u2", type: "wow" }
    ],
    comments: [
      {
        id: "c8",
        userId: "u2",
        userName: "Ana",
        userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
        text: "Fomos os únicos que escolheram esse prato naquela noite! ⭐",
        createdAt: "2025-08-13T11:45:00Z"
      }
    ],
    tags: ["instagram", "featured", "restaurant", "special"]
  },
  // EMBED - Google Maps
  {
    id: "mem_9",
    timelineId: "t1",
    authorId: "u2",
    authorName: "Ana",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    type: "embed",
    content: {
      text: "Salvei nossa rota favorita para quando voltarmos! 🗺️",
      embed: {
        url: "https://maps.google.com/maps?q=Osteria+Italiana+São+Paulo",
        provider: "google-maps",
        title: "Osteria Italiana - Rua Augusta",
        description: "Rota otimizada: Casa → Restaurante (22 min de carro)",
        thumbnail: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=300&fit=crop"
      }
    },
    createdAt: "2025-08-11T18:00:00Z",
    reactions: [
      { userId: "u1", type: "like" }
    ],
    comments: [],
    tags: ["maps", "route", "planning", "location"]
  },
  // EMBED - TikTok
  {
    id: "mem_10",
    timelineId: "t1",
    authorId: "u1",
    authorName: "Pedro",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    type: "embed",
    content: {
      text: "Consegui filmar o chef preparando nosso prato! 🎬",
      embed: {
        url: "https://www.tiktok.com/@user/video/123456789",
        provider: "tiktok",
        title: "Chef preparando carbonara na bancada aberta",
        description: "O momento exato da finalização com a gema e o queijo ✨",
        thumbnail: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop"
      }
    },
    createdAt: "2025-08-12T20:45:00Z",
    reactions: [
      { userId: "u2", type: "wow" },
      { userId: "u2", type: "love" }
    ],
    comments: [
      {
        id: "c9",
        userId: "u2",
        userName: "Ana",
        userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
        text: "A técnica dele é impressionante! Ainda bem que você filmou 🤩",
        createdAt: "2025-08-12T21:00:00Z"
      }
    ],
    tags: ["tiktok", "chef", "cooking", "technique"]
  },
  // EMBED - Spotify Playlist
  {
    id: "mem_11",
    timelineId: "t1",
    authorId: "u2",
    authorName: "Ana",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    type: "embed",
    content: {
      text: "A trilha sonora perfeita para nossas noites de jantar 🎵",
      embed: {
        url: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd",
        provider: "spotify",
        title: "Dinner Vibes - Nossa Playlist",
        description: "Jazz suave e bossa nova para nossos jantares românticos",
        thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"
      }
    },
    createdAt: "2025-06-01T16:20:00Z",
    reactions: [
      { userId: "u1", type: "love" },
      { userId: "u1", type: "like" }
    ],
    comments: [
      {
        id: "c10",
        userId: "u1",
        userName: "Pedro",
        userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        text: "Essa playlist é perfeita! Sempre toca nos momentos certos 🎶",
        createdAt: "2025-06-01T16:35:00Z"
      }
    ],
    tags: ["spotify", "music", "romantic", "dinner", "playlist"]
  }
];

export const getMemoriesForTimeline = (timelineId: string): TimelineMemory[] => {
  return mockTimelineMemories
    .filter(memory => memory.timelineId === timelineId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const addReactionToMemory = (memoryId: string, userId: string, reactionType: "love" | "laugh" | "wow" | "like") => {
  const memory = mockTimelineMemories.find(m => m.id === memoryId);
  if (memory) {
    // Remove existing reaction from this user
    memory.reactions = memory.reactions.filter(r => r.userId !== userId);
    // Add new reaction
    memory.reactions.push({ userId, type: reactionType });
  }
};

export const addCommentToMemory = (memoryId: string, userId: string, userName: string, userAvatar: string, text: string) => {
  const memory = mockTimelineMemories.find(m => m.id === memoryId);
  if (memory) {
    memory.comments.push({
      id: `c_${Date.now()}`,
      userId,
      userName,
      userAvatar,
      text,
      createdAt: new Date().toISOString()
    });
  }
};
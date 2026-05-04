import { useState, useEffect } from "react";
import { Search, UserPlus, Loader2, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  connectionStatus?: "none" | "pending" | "connected";
}

// Mock users for demonstration when not authenticated
const mockUsers: UserProfile[] = [
  {
    id: 'mock-1',
    username: 'maria_silva',
    display_name: 'Maria Silva',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    connectionStatus: 'none'
  },
  {
    id: 'mock-2',
    username: 'joao_santos',
    display_name: 'João Santos',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    connectionStatus: 'none'
  },
  {
    id: 'mock-3',
    username: 'ana_costa',
    display_name: 'Ana Costa',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    connectionStatus: 'pending'
  },
  {
    id: 'mock-4',
    username: 'pedro_oliveira',
    display_name: 'Pedro Oliveira',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    connectionStatus: 'none'
  },
  {
    id: 'mock-5',
    username: 'camila_rodrigues',
    display_name: 'Camila Rodrigues',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    connectionStatus: 'connected'
  },
  {
    id: 'mock-6',
    username: 'lucas_ferreira',
    display_name: 'Lucas Ferreira',
    avatar_url: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=200&h=200&fit=crop&crop=face',
    connectionStatus: 'none'
  },
  {
    id: 'mock-7',
    username: 'juliana_alves',
    display_name: 'Juliana Alves',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    connectionStatus: 'none'
  },
  {
    id: 'mock-8',
    username: 'rafael_lima',
    display_name: 'Rafael Lima',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
    connectionStatus: 'pending'
  }
];

const UserSearchModal = ({ isOpen, onClose }: UserSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sendingRequestTo, setSendingRequestTo] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id || null);
    });
  }, []);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const searchUsers = async () => {
      setIsSearching(true);
      try {
        // If not authenticated, use mock users for demonstration
        if (!currentUserId) {
          const filtered = mockUsers.filter(user =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.display_name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
          );
          setSearchResults(filtered);
          setIsSearching(false);
          return;
        }

        // Otherwise, search real users
        const { data: users, error } = await supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url")
          .or(`username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`)
          .neq("id", currentUserId || "")
          .limit(10);

        if (error) throw error;

        if (users && currentUserId) {
          const usersWithStatus = await Promise.all(
            users.map(async (user) => {
              const { data: connection } = await supabase
                .from("connections")
                .select("id")
                .or(
                  `and(user1_id.eq.${currentUserId},user2_id.eq.${user.id}),and(user1_id.eq.${user.id},user2_id.eq.${currentUserId})`
                )
                .maybeSingle();

              if (connection) {
                return { ...user, connectionStatus: "connected" as const };
              }

              const { data: request } = await supabase
                .from("connection_requests")
                .select("id, status")
                .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${currentUserId})`)
                .eq("status", "pending")
                .maybeSingle();

              if (request) {
                return { ...user, connectionStatus: "pending" as const };
              }

              return { ...user, connectionStatus: "none" as const };
            })
          );

          setSearchResults(usersWithStatus);
        } else {
          setSearchResults(users || []);
        }
      } catch (error) {
        console.error("Error searching users:", error);
        toast({
          title: "Erro",
          description: "Não foi possível buscar usuários. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, currentUserId]);

  const handleSendRequest = async (userId: string) => {
    // For mock users (demonstration mode)
    if (userId.startsWith('mock-')) {
      setSendingRequestTo(userId);
      setTimeout(() => {
        toast({
          title: "Modo demonstração",
          description: "Este é um usuário de exemplo. Faça login para conectar com usuários reais.",
        });
        setSearchResults((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, connectionStatus: "pending" as const } : user
          )
        );
        setSendingRequestTo(null);
      }, 500);
      return;
    }

    if (!currentUserId) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para enviar solicitações.",
        variant: "destructive",
      });
      return;
    }

    setSendingRequestTo(userId);
    try {
      const { error } = await supabase.from("connection_requests").insert({
        sender_id: currentUserId,
        receiver_id: userId,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Solicitação enviada!",
        description: "Aguarde a confirmação do usuário.",
      });

      setSearchResults((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, connectionStatus: "pending" as const } : user
        )
      );
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSendingRequestTo(null);
    }
  };

  const getStatusButton = (user: UserProfile) => {
    if (user.connectionStatus === "connected") {
      return (
        <Button size="sm" variant="secondary" disabled>
          <Check size={16} className="mr-1" />
          Conectado
        </Button>
      );
    }

    if (user.connectionStatus === "pending") {
      return (
        <Button size="sm" variant="outline" disabled>
          <Loader2 size={16} className="mr-1 animate-spin" />
          Pendente
        </Button>
      );
    }

    return (
      <Button
        size="sm"
        onClick={() => handleSendRequest(user.id)}
        disabled={sendingRequestTo === user.id}
      >
        {sendingRequestTo === user.id ? (
          <Loader2 size={16} className="mr-1 animate-spin" />
        ) : (
          <UserPlus size={16} className="mr-1" />
        )}
        Conectar
      </Button>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Buscar Usuários</DialogTitle>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Digite o nome ou username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={32} className="animate-spin text-muted-foreground" />
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback>
                        {(user.display_name || user.username).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">
                        {user.display_name || user.username}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        @{user.username}
                      </div>
                    </div>
                  </div>
                  {getStatusButton(user)}
                </div>
              ))
            ) : searchQuery.length >= 2 ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">Nenhum usuário encontrado</div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-muted-foreground">
                  Digite pelo menos 2 caracteres para buscar
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserSearchModal;
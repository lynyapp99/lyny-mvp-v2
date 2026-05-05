import { Users as UsersIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import EmptyState from "@/components/EmptyState";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Relationships = () => {
  const { user } = useAuth();

  const { data: connections = [], isLoading } = useQuery({
    queryKey: ["connections", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("connections")
        .select("id, user1_id, user2_id, created_at")
        .or(`user1_id.eq.${user!.id},user2_id.eq.${user!.id}`);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader />

      <div className="max-w-md mx-auto px-4 py-6">
        {!isLoading && connections.length === 0 && (
          <EmptyState
            icon={UsersIcon}
            title="Nenhum relacionamento ainda"
            description="Conecte-se com pessoas para ver seus relacionamentos aqui."
            actionLabel="Adicionar pessoa"
            onAction={() => toast({ title: "Em breve", description: "Convites estarão disponíveis em breve." })}
          />
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default Relationships;
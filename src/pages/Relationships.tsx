import { useState } from "react";
import { Plus, Users as UsersIcon, Heart, Search, UserPlus } from "lucide-react";
import Navigation from "@/components/Navigation";
import RelationshipCard from "@/components/RelationshipCard";
import AddRelationshipModal from "@/components/AddRelationshipModal";
import UserSearchModal from "@/components/UserSearchModal";
import { GlassCard } from "@/components/ui/glass-card";
import { IOSButton } from "@/components/ui/ios-button";
import { Button } from "@/components/ui/button";
import { mockRelationships, type Relationship } from "@/data/relationshipData";
import { mockTimelines } from "@/data/mockData";

const Relationships = () => {
  const [relationships, setRelationships] = useState<Relationship[]>(mockRelationships);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUpdate = () => {
    setRelationships([...mockRelationships]);
  };

  const handleRelationshipAdded = (newRelationship: Relationship) => {
    setRelationships([...relationships, newRelationship]);
  };

  const filteredRelationships = relationships.filter(rel =>
    rel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rel.members.some(member => 
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const pinnedRelationships = filteredRelationships.filter(rel => rel.isPinned);
  const unpinnedRelationships = filteredRelationships.filter(rel => !rel.isPinned);

  const totalTimelines = relationships.reduce((sum, rel) => sum + rel.timelineIds.length, 0);
  const totalMemories = mockTimelines.reduce((sum, timeline) => sum + timeline.items, 0);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <UsersIcon size={24} className="text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-foreground mb-2">Nenhum Relacionamento Ainda</h3>
      <p className="text-muted-foreground text-center text-sm max-w-xs mb-6">
        Crie seu primeiro relacionamento para começar a organizar e compartilhar linhas do tempo com as pessoas que mais importam.
      </p>
      <IOSButton
        onClick={() => setIsAddModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors"
      >
        <Plus size={16} />
        Adicionar Relacionamento
      </IOSButton>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-divider">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-headline text-foreground">Relacionamentos</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Organize pelas pessoas que mais importam
              </p>
            </div>
            
            <IOSButton
              onClick={() => setIsAddModalOpen(true)}
              size="icon"
              className="rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <Plus size={20} />
            </IOSButton>
          </div>
          
          {/* Search */}
          <div className="relative mb-3">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar relacionamentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface border border-divider rounded-2xl
                       text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30
                       transition-all duration-200"
            />
          </div>

          {/* Connect with Users Button */}
          <Button
            onClick={() => setIsUserSearchOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-surface border border-divider hover:border-primary/30"
            variant="outline"
          >
            <UserPlus size={18} />
            Conectar com Outros Usuários
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {relationships.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-8">
            {/* Pinned Relationships */}
            {pinnedRelationships.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Heart size={16} className="text-red-500" fill="currentColor" />
                  <h2 className="font-semibold text-foreground">Fixados na Home</h2>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {pinnedRelationships.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {pinnedRelationships.map((relationship) => (
                    <RelationshipCard
                      key={relationship.id}
                      {...relationship}
                      onUpdate={handleUpdate}
                      onClick={() => console.log(`Open relationship: ${relationship.name}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Relationships */}
            {unpinnedRelationships.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <UsersIcon size={16} className="text-muted-foreground" />
                  <h2 className="font-semibold text-foreground">Todos os Relacionamentos</h2>
                  <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs font-medium">
                    {unpinnedRelationships.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {unpinnedRelationships.map((relationship) => (
                    <RelationshipCard
                      key={relationship.id}
                      {...relationship}
                      onUpdate={handleUpdate}
                      onClick={() => console.log(`Open relationship: ${relationship.name}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {filteredRelationships.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Nenhum Resultado</h3>
                <p className="text-muted-foreground text-sm">
                  Tente ajustar os termos de busca
                </p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-card rounded-2xl p-4 border border-border">
              <h3 className="font-semibold text-foreground mb-4">Estatísticas Rápidas</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{relationships.length}</div>
                  <div className="text-xs text-muted-foreground">Relacionamentos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{totalTimelines}</div>
                  <div className="text-xs text-muted-foreground">Linhas do Tempo</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{totalMemories}</div>
                  <div className="text-xs text-muted-foreground">Memórias</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Relationship Modal */}
      <AddRelationshipModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRelationshipAdded={handleRelationshipAdded}
      />

      {/* User Search Modal */}
      <UserSearchModal
        isOpen={isUserSearchOpen}
        onClose={() => setIsUserSearchOpen(false)}
      />

      <Navigation />
    </div>
  );
};

export default Relationships;
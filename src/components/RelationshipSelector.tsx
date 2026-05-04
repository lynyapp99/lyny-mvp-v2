import { useState } from "react";
import { Plus, Users, Heart } from "lucide-react";
import { mockRelationships, type Relationship } from "@/data/relationshipData";
import { Button } from "@/components/ui/button";
import { getRelationshipIcon } from "@/lib/relationshipIcons";

interface RelationshipSelectorProps {
  selectedRelationshipId?: string;
  onSelect: (relationshipId: string) => void;
  onCreateNew: () => void;
}

const RelationshipSelector = ({ 
  selectedRelationshipId, 
  onSelect, 
  onCreateNew 
}: RelationshipSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredRelationships = mockRelationships.filter(rel =>
    rel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Select Relationship</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onCreateNew}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          New
        </Button>
      </div>

      <input
        type="text"
        placeholder="Search relationships..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 
                 text-foreground placeholder:text-muted-foreground
                 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
      />

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredRelationships.map((relationship) => {
          const RelIcon = getRelationshipIcon(relationship.emoji);
          return (
          <button
            key={relationship.id}
            onClick={() => onSelect(relationship.id)}
            className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 
                      hover:shadow-md ${
              selectedRelationshipId === relationship.id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-divider bg-surface hover:border-primary/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-2 border border-divider flex items-center justify-center shrink-0">
                <RelIcon className="w-5 h-5 text-foreground" strokeWidth={1.75} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground">{relationship.name}</h4>
                  {relationship.type === "one-to-one" && (
                    <Heart size={16} className="text-primary" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {relationship.members.length} members
                  </span>
                  <span>{relationship.timelineIds.length} timelines</span>
                </div>
              </div>
            </div>
          </button>
          );
        })}
      </div>

      {filteredRelationships.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No relationships found</p>
          <Button onClick={onCreateNew} className="flex items-center gap-2">
            <Plus size={16} />
            Create New Relationship
          </Button>
        </div>
      )}
    </div>
  );
};

export default RelationshipSelector;
import { Users as UsersIcon } from "lucide-react";
import Navigation from "@/components/Navigation";

const Relationships = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-divider">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-headline text-foreground">Relacionamentos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Organize pelas pessoas que mais importam
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-muted/40 flex items-center justify-center mb-5">
            <UsersIcon size={32} className="text-muted-foreground" strokeWidth={1.5} />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Em breve</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            A área de relacionamentos vai chegar para você organizar timelines pelas pessoas que mais importam.
          </p>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Relationships;
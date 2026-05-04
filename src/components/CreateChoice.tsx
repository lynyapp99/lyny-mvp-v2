import { Palette, Camera, Edit3, Layers, type LucideIcon } from "lucide-react";

interface CreateChoiceProps {
  onSelectFlow: (flow: "timeline" | "memory" | "edit" | "deepen") => void;
}

const CreateChoice = ({ onSelectFlow }: CreateChoiceProps) => {
  const options: Array<{
    id: "timeline" | "memory" | "edit" | "deepen";
    icon: LucideIcon;
    title: string;
    description: string;
  }> = [
    {
      id: "timeline",
      icon: Palette,
      title: "Nova timeline",
      description: "Crie uma coleção temática de memórias",
    },
    {
      id: "memory",
      icon: Camera,
      title: "Adicionar memória",
      description: "Inclua fotos ou vídeos em uma timeline existente",
    },
    {
      id: "edit",
      icon: Edit3,
      title: "Editar timeline",
      description: "Ajuste detalhes de uma timeline existente",
    },
    {
      id: "deepen",
      icon: Layers,
      title: "Aprofundar timeline",
      description: "Adicione subcategorias e marcos",
    },
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-display text-foreground mb-1">Criar</h1>
        <p className="text-muted-foreground">O que você quer criar agora?</p>
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => {
                if ("vibrate" in navigator) navigator.vibrate(10);
                onSelectFlow(option.id);
              }}
              className="w-full p-5 bg-surface border border-divider rounded-app-xl
                         transition-lyny hover:border-primary/30 hover:-translate-y-[2px]
                         text-left active:scale-[0.99] group min-h-[88px]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-divider flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
                  <Icon className="w-6 h-6 text-foreground" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-title text-foreground">{option.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CreateChoice;
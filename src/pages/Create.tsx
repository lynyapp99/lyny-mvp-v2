import { useRef, useState } from "react";
import { Upload, Lock, Users, ArrowLeft, Shield, Fingerprint, Star } from "lucide-react";
import Navigation from "@/components/Navigation";
import { IOSButton } from "@/components/ui/ios-button";
import CreateChoice from "@/components/CreateChoice";
import AddMemoryFlow from "@/components/AddMemoryFlow";
import EditTimelineFlow from "@/components/EditTimelineFlow";
import DeepenTimelineFlow from "@/components/DeepenTimelineFlow";
import RelationshipSelector from "@/components/RelationshipSelector";
import AddRelationshipModal from "@/components/AddRelationshipModal";

type Flow = "choose" | "timeline" | "memory" | "edit" | "deepen";

type TimelineColor = "pink" | "blue" | "green" | "yellow" | "purple" | "orange";
type TimelinePrivacy = "private" | "shared" | "public";
type TimelineAuth = "biometric" | "password";

interface TimelineDataState {
  relationshipId: string;
  color: TimelineColor;
  privacy: TimelinePrivacy;
  favorite: boolean;
  isHidden: boolean;
  authMethod: TimelineAuth;
}

const colorsList: ReadonlyArray<{ name: TimelineColor; label: string }> = [
  { name: "pink", label: "Pink" },
  { name: "blue", label: "Blue" },
  { name: "green", label: "Green" },
  { name: "yellow", label: "Yellow" },
  { name: "purple", label: "Purple" },
  { name: "orange", label: "Orange" },
];

const privacyOptionsList = [
  { value: "private" as const, label: "Private", description: "Only relationship members can view", icon: Lock },
  { value: "shared" as const, label: "Shared", description: "Members can view and contribute", icon: Users },
  { value: "public" as const, label: "Public", description: "Anyone with link can view", icon: Users },
];

interface CreateTimelineFormProps {
  onBack: () => void;
  onOpenRelationshipSelector: () => void;
  timelineData: TimelineDataState;
  setTimelineData: React.Dispatch<React.SetStateAction<TimelineDataState>>;
  titleRef: React.RefObject<HTMLInputElement>;
  descriptionRef: React.RefObject<HTMLTextAreaElement>;
  passwordRef: React.RefObject<HTMLInputElement>;
}

const CreateTimelineForm = ({
  onBack,
  onOpenRelationshipSelector,
  timelineData,
  setTimelineData,
  titleRef,
  descriptionRef,
  passwordRef,
}: CreateTimelineFormProps) => {
  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <IOSButton variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
          <ArrowLeft size={22} className="text-muted-foreground" />
        </IOSButton>
        <div>
          <h1 className="font-display font-semibold text-2xl text-foreground">Nova timeline</h1>
          <p className="text-muted-foreground text-sm">Crie sua coleção de memórias</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Imagem de capa (opcional)
          </label>
          <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Upload size={22} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Toque para adicionar capa</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Título</label>
          <input
            ref={titleRef}
            type="text"
            placeholder="ex.: Nossas aventuras gastronômicas"
            defaultValue=""
            className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Descrição</label>
          <textarea
            ref={descriptionRef}
            placeholder="Que tipo de memórias você vai guardar aqui?"
            defaultValue=""
            rows={3}
            className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Relacionamento</label>
          <button
            onClick={onOpenRelationshipSelector}
            className="w-full p-4 bg-card rounded-2xl border border-border text-left hover:border-primary/30 transition-all duration-200"
          >
            {timelineData.relationshipId ? (
              <div className="text-foreground">Relacionamento selecionado</div>
            ) : (
              <div className="text-muted-foreground">Escolha quem vai compartilhar essa timeline...</div>
            )}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Cor da timeline</label>
          <div className="grid grid-cols-3 gap-3">
            {colorsList.map((color) => (
              <button
                key={color.name}
                onClick={() => setTimelineData((p) => ({ ...p, color: color.name }))}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 sector-card-${color.name} ${
                  timelineData.color === color.name
                    ? "border-white shadow-lg scale-105"
                    : "border-transparent hover:border-white/30"
                }`}
              >
                <div className="text-sm font-medium text-center text-white">{color.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Privacidade</label>
          <div className="space-y-2">
            {privacyOptionsList.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setTimelineData((p) => ({ ...p, privacy: option.value }))}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 ${
                    timelineData.privacy === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <Icon size={22} className="text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <button
            onClick={() => setTimelineData((p) => ({ ...p, isHidden: !p.isHidden }))}
            className={`w-full p-4 rounded-2xl border transition-all duration-200 ${
              timelineData.isHidden ? "border-orange-500 bg-orange-500/5" : "border-border bg-card hover:border-orange-500/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted/50 rounded-lg">
                <Lock size={22} className={timelineData.isHidden ? "text-primary" : "text-muted-foreground"} />
              </div>
              <div className="text-left">
                <div className="font-medium text-foreground">Tornar timeline oculta</div>
                <div className="text-sm text-muted-foreground">
                  {timelineData.isHidden ? "Requer autenticação para acessar" : "Timeline visível para os membros"}
                </div>
              </div>
            </div>
          </button>
        </div>

        {timelineData.isHidden && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-2xl border border-orange-500/20">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Método de autenticação</label>
              <div className="space-y-2">
                <button
                  onClick={() => setTimelineData((p) => ({ ...p, authMethod: "biometric" }))}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 ${
                    timelineData.authMethod === "biometric"
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <Fingerprint size={22} className="text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Autenticação biométrica</div>
                      <div className="text-sm text-muted-foreground">Usar Face ID ou Touch ID</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setTimelineData((p) => ({ ...p, authMethod: "password" }))}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 ${
                    timelineData.authMethod === "password"
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <Shield size={22} className="text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Proteção por senha</div>
                      <div className="text-sm text-muted-foreground">Defina uma senha personalizada</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {timelineData.authMethod === "password" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Definir senha</label>
                <input
                  ref={passwordRef}
                  type="password"
                  placeholder="Digite uma senha segura"
                  defaultValue=""
                  className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Escolha uma senha que você lembre, mas que outros não adivinhem
                </p>
              </div>
            )}
          </div>
        )}

        <div>
          <button
            onClick={() => setTimelineData((p) => ({ ...p, favorite: !p.favorite }))}
            className={`w-full p-4 rounded-2xl border transition-all duration-200 ${
              timelineData.favorite ? "border-yellow-500 bg-yellow-500/5" : "border-border bg-card hover:border-yellow-500/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-surface-2 rounded-lg">
                <Star
                  size={22}
                  className={timelineData.favorite ? "text-primary" : "text-muted-foreground"}
                  fill={timelineData.favorite ? "currentColor" : "none"}
                  strokeWidth={1.75}
                />
              </div>
              <div className="text-left">
                <div className="font-medium text-foreground">Fixar na Home</div>
                <div className="text-sm text-muted-foreground">
                  {timelineData.favorite ? "Aparece na tela inicial" : "Adicionar aos favoritos"}
                </div>
              </div>
            </div>
          </button>
        </div>

        <IOSButton className="w-full py-3 rounded-2xl font-medium">
          {timelineData.isHidden ? "Criar timeline oculta" : "Criar timeline"}
        </IOSButton>
      </div>
    </div>
  );
};

const Create = () => {
  const [currentFlow, setCurrentFlow] = useState<Flow>("choose");
  const [showRelationshipSelector, setShowRelationshipSelector] = useState(false);
  const [showAddRelationshipModal, setShowAddRelationshipModal] = useState(false);
  const [timelineData, setTimelineData] = useState<TimelineDataState>({
    relationshipId: "",
    color: "pink",
    privacy: "private",
    favorite: false,
    isHidden: false,
    authMethod: "biometric",
  });

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleFlowSelect = (flow: Flow) => {
    setCurrentFlow(flow);
  };

  const handleBackToChoice = () => {
    setCurrentFlow("choose");
  };

  const handleRelationshipSelect = (relationshipId: string) => {
    setTimelineData((p) => ({ ...p, relationshipId }));
    setShowRelationshipSelector(false);
  };

  const handleCreateNewRelationship = () => {
    setShowRelationshipSelector(false);
    setShowAddRelationshipModal(true);
  };

  if (currentFlow === "memory") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <AddMemoryFlow onBack={handleBackToChoice} />
        <Navigation />
      </div>
    );
  }

  if (currentFlow === "edit") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <EditTimelineFlow onBack={handleBackToChoice} />
        <Navigation />
      </div>
    );
  }

  if (currentFlow === "deepen") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <DeepenTimelineFlow onBack={handleBackToChoice} />
        <Navigation />
      </div>
    );
  }

  if (currentFlow === "choose") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <CreateChoice onSelectFlow={handleFlowSelect} />
        <Navigation />
      </div>
    );
  }

  // Timeline creation flow
  if (currentFlow === "timeline") {
    if (showRelationshipSelector) {
      return (
        <div className="min-h-screen bg-background pb-20">
          <div className="max-w-md mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-6">
              <IOSButton
                variant="ghost"
                size="icon"
                onClick={() => setShowRelationshipSelector(false)}
                className="rounded-xl"
              >
                <ArrowLeft size={22} className="text-muted-foreground" />
              </IOSButton>
              <div>
                <h1 className="font-display font-semibold text-2xl text-foreground">Selecionar relacionamento</h1>
                <p className="text-muted-foreground text-sm">Quem vai compartilhar essa timeline?</p>
              </div>
            </div>
            <RelationshipSelector
              selectedRelationshipId={timelineData.relationshipId}
              onSelect={handleRelationshipSelect}
              onCreateNew={handleCreateNewRelationship}
            />
          </div>
          <Navigation />
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-background pb-20">
        <CreateTimelineForm
          onBack={handleBackToChoice}
          onOpenRelationshipSelector={() => setShowRelationshipSelector(true)}
          timelineData={timelineData}
          setTimelineData={setTimelineData}
          titleRef={titleRef}
          descriptionRef={descriptionRef}
          passwordRef={passwordRef}
        />
        {showAddRelationshipModal && (
          <AddRelationshipModal
            isOpen={showAddRelationshipModal}
            onClose={() => setShowAddRelationshipModal(false)}
            onSuccess={(relationshipId) => {
              setTimelineData((p) => ({ ...p, relationshipId }));
              setShowAddRelationshipModal(false);
            }}
          />
        )}
        <Navigation />
      </div>
    );
  }

  // This should never be reached, but just in case
  return (
    <div className="min-h-screen bg-background pb-20">
      <CreateChoice onSelectFlow={handleFlowSelect} />
      <Navigation />
    </div>
  );
};

export default Create;
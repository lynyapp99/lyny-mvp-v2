import { useRef, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { IOSButton } from "@/components/ui/ios-button";
import CreateChoice from "@/components/CreateChoice";
import AddMemoryFlow from "@/components/AddMemoryFlow";
import EditTimelineFlow from "@/components/EditTimelineFlow";
import DeepenTimelineFlow from "@/components/DeepenTimelineFlow";
import { useSectors, useCreateSector, useCreateTimeline } from "@/lib/api/timelines";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

type Flow = "choose" | "timeline" | "memory" | "edit" | "deepen";

const NO_SECTOR = "__none__";
const NEW_SECTOR = "__new__";

interface CreateTimelineFormProps {
  onBack: () => void;
  titleRef: React.RefObject<HTMLInputElement>;
  descriptionRef: React.RefObject<HTMLTextAreaElement>;
  newSectorRef: React.RefObject<HTMLInputElement>;
  sectorChoice: string;
  setSectorChoice: (v: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}

const CreateTimelineForm = ({
  onBack,
  titleRef,
  descriptionRef,
  newSectorRef,
  sectorChoice,
  setSectorChoice,
  onSubmit,
  submitting,
}: CreateTimelineFormProps) => {
  const { data: sectors = [] } = useSectors();

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

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Nome *</label>
          <input
            ref={titleRef}
            type="text"
            placeholder="ex.: Nossas aventuras gastronômicas"
            defaultValue=""
            className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Descrição (opcional)</label>
          <textarea
            ref={descriptionRef}
            placeholder="Que tipo de memórias você vai guardar aqui?"
            defaultValue=""
            rows={3}
            className="w-full px-4 py-3 bg-muted/50 rounded-2xl border-0 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Setor (opcional)</label>
          <Select value={sectorChoice} onValueChange={setSectorChoice}>
            <SelectTrigger className="rounded-2xl bg-muted/50 border-0 h-12">
              <SelectValue placeholder="Sem setor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_SECTOR}>Sem setor</SelectItem>
              {sectors.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
              <SelectItem value={NEW_SECTOR}>+ Criar novo setor</SelectItem>
            </SelectContent>
          </Select>
          {sectorChoice === NEW_SECTOR && (
            <input
              ref={newSectorRef}
              type="text"
              placeholder="Nome do novo setor"
              defaultValue=""
              className="w-full px-4 py-3 mt-2 bg-muted/50 rounded-2xl border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card"
            />
          )}
        </div>

        <div className="opacity-50 pointer-events-none">
          <label className="block text-sm font-medium text-foreground mb-2">
            Relacionamento <span className="text-xs text-muted-foreground">(em breve)</span>
          </label>
          <div className="w-full p-4 bg-card rounded-2xl border border-border text-left">
            <div className="text-muted-foreground">Em breve você poderá vincular timelines a relacionamentos</div>
          </div>
        </div>

        <IOSButton
          className="w-full py-3 rounded-2xl font-medium"
          onClick={onSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Criando…
            </span>
          ) : (
            "Criar timeline"
          )}
        </IOSButton>
      </div>
    </div>
  );
};

const Create = () => {
  const navigate = useNavigate();
  const [currentFlow, setCurrentFlow] = useState<Flow>("choose");
  const [sectorChoice, setSectorChoice] = useState<string>(NO_SECTOR);
  const [submitting, setSubmitting] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const newSectorRef = useRef<HTMLInputElement>(null);

  const createTimeline = useCreateTimeline();
  const createSector = useCreateSector();

  const handleFlowSelect = (flow: Flow) => {
    setCurrentFlow(flow);
  };

  const handleBackToChoice = () => {
    setCurrentFlow("choose");
  };

  const handleSubmitTimeline = async () => {
    const title = titleRef.current?.value.trim() ?? "";
    const subtitle = descriptionRef.current?.value.trim() ?? "";
    if (!title) {
      toast({ title: "Nome obrigatório", description: "Dê um nome à sua timeline.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      let sectorId: string | null = null;
      if (sectorChoice === NEW_SECTOR) {
        const newName = newSectorRef.current?.value.trim() ?? "";
        if (!newName) {
          toast({ title: "Nome do setor", description: "Digite um nome para o novo setor.", variant: "destructive" });
          setSubmitting(false);
          return;
        }
        const sector = await createSector.mutateAsync({ name: newName, emoji: "📁", color: "blue" });
        sectorId = sector.id;
      } else if (sectorChoice !== NO_SECTOR) {
        sectorId = sectorChoice;
      }
      const timeline = await createTimeline.mutateAsync({
        title,
        subtitle: subtitle || undefined,
        sector_id: sectorId,
      });
      toast({ title: "Timeline criada!", description: title });
      navigate(`/timeline/${timeline.id}`);
    } catch (e: unknown) {
      toast({
        title: "Não foi possível criar",
        description: e instanceof Error ? e.message : String(e),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
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
    return (
      <div className="min-h-screen bg-background pb-20">
        <CreateTimelineForm
          onBack={handleBackToChoice}
          titleRef={titleRef}
          descriptionRef={descriptionRef}
          newSectorRef={newSectorRef}
          sectorChoice={sectorChoice}
          setSectorChoice={setSectorChoice}
          onSubmit={handleSubmitTimeline}
          submitting={submitting}
        />
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
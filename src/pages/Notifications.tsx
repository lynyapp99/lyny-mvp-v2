import { Bell } from "lucide-react";
import Navigation from "@/components/Navigation";
import EmptyState from "@/components/EmptyState";

const Notifications = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Notificações</h1>
        </div>

        <EmptyState
          icon={Bell}
          title="Nenhuma notificação por enquanto"
          description="Quando alguém interagir com suas timelines, você verá aqui."
        />
      </div>

      <Navigation />
    </div>
  );
};

export default Notifications;
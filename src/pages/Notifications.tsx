import { Bell } from "lucide-react";
import Navigation from "@/components/Navigation";
import EmptyState from "@/components/EmptyState";
import AppHeader from "@/components/AppHeader";

const Notifications = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader />
      <div className="max-w-md mx-auto px-4 py-6">
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
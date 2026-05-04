import { Bell } from "lucide-react";
import Navigation from "@/components/Navigation";

const Notifications = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notificações</h1>
            <p className="text-muted-foreground">Tudo em dia</p>
          </div>
          <div className="p-2 rounded-xl">
            <Bell size={20} className="text-muted-foreground" />
          </div>
        </div>

        <div className="text-center py-16">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={24} className="text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Nenhuma notificação</h3>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Quando alguém interagir com suas timelines, você verá aqui.
          </p>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Notifications;
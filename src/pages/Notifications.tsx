import { useEffect } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import EmptyState from "@/components/EmptyState";
import AppHeader from "@/components/AppHeader";
import { useNotifications, useMarkAllNotificationsRead } from "@/lib/api/notifications";

const formatRelative = (iso: string) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "agora";
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(iso).toLocaleDateString("pt-BR");
};

const Notifications = () => {
  const navigate = useNavigate();
  const { data: notifications = [], isLoading } = useNotifications();
  const markAllRead = useMarkAllNotificationsRead();

  useEffect(() => {
    if (notifications.some((n) => !n.read)) {
      markAllRead.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications.length]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader />
      <div className="max-w-md mx-auto px-4 py-6">
        {!isLoading && notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="Nenhuma notificação por enquanto"
            description="Quando alguém interagir com suas timelines, você verá aqui."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {notifications.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => {
                    if ("vibrate" in navigator) navigator.vibrate(10);
                    if (n.timeline_id) navigate(`/timeline/${n.timeline_id}`);
                  }}
                  className="w-full text-left min-h-[64px] rounded-app bg-card border border-border px-4 py-3 flex items-start gap-3 active:scale-[0.99] transition-transform touch-manipulation"
                >
                  <div className="mt-1 flex-shrink-0">
                    {!n.read ? (
                      <span className="block w-2.5 h-2.5 rounded-full bg-primary" aria-label="Não lida" />
                    ) : (
                      <Bell className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatRelative(n.created_at)}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default Notifications;

import { Bell, Heart, Camera, Users, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: "new_memory",
      title: "New memory added",
      message: "Emma added 3 photos to 'Friday Night Squad'",
      timestamp: "2 min ago",
      isRead: false,
      user: { name: "Emma Davis", avatar: "" },
      icon: Camera,
      color: "green",
    },
    {
      id: 2,
      type: "timeline_invite",
      title: "Timeline invitation",
      message: "James invited you to join 'Workout Journey'",
      timestamp: "1 hour ago",
      isRead: false,
      user: { name: "James Wilson", avatar: "" },
      icon: Users,
      color: "blue",
    },
    {
      id: 3,
      type: "memory_like",
      title: "Someone loved your memory",
      message: "Alex loved your photo in 'Our Restaurant Adventures'",
      timestamp: "3 hours ago",
      isRead: true,
      user: { name: "Alex Thompson", avatar: "" },
      icon: Heart,
      color: "pink",
    },
    {
      id: 4,
      type: "new_memory",
      title: "New memory added",
      message: "Mom added a video to 'Family Vacations'",
      timestamp: "Yesterday",
      isRead: true,
      user: { name: "Mom", avatar: "" },
      icon: Camera,
      color: "purple",
    },
    {
      id: 5,
      type: "reminder",
      title: "Timeline reminder",
      message: "It's been a while since you added to 'Cooking Experiments'",
      timestamp: "2 days ago",
      isRead: true,
      user: null,
      icon: Clock,
      color: "yellow",
    },
  ];

  const getColorClasses = (color: string, isRead: boolean) => {
    const opacity = isRead ? "/5" : "/10";
    const borderOpacity = isRead ? "/10" : "/20";
    
    return `bg-timeline-${color}${opacity} border-timeline-${color}${borderOpacity}`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground">
              {notifications.filter(n => !n.isRead).length} unread
            </p>
          </div>
          
          <button className="p-2 hover:bg-muted rounded-xl transition-colors">
            <Bell size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification) => {
            const IconComponent = notification.icon;
            
            return (
              <div
                key={notification.id}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer
                          hover:shadow-card active:scale-95 ${
                            notification.isRead 
                              ? "bg-card border-border" 
                              : "bg-primary/5 border-primary/10"
                          }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon or Avatar */}
                  <div className="flex-shrink-0">
                    {notification.user ? (
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={notification.user.avatar} />
                          <AvatarFallback className="text-sm bg-muted">
                            {notification.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${
                          notification.color === 'green' ? 'bg-timeline-green' :
                          notification.color === 'blue' ? 'bg-timeline-blue' :
                          notification.color === 'pink' ? 'bg-timeline-pink' :
                          notification.color === 'purple' ? 'bg-timeline-purple' :
                          'bg-timeline-yellow'
                        }`}>
                          <IconComponent size={12} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className={`p-2 rounded-xl ${
                        notification.color === 'yellow' ? 'bg-timeline-yellow/20 text-timeline-yellow' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        <IconComponent size={20} />
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={`font-medium text-sm ${
                          notification.isRead ? "text-muted-foreground" : "text-foreground"
                        }`}>
                          {notification.title}
                        </h3>
                        <p className={`text-sm mt-1 ${
                          notification.isRead ? "text-muted-foreground" : "text-foreground/80"
                        }`}>
                          {notification.message}
                        </p>
                      </div>
                      
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {notification.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State (if needed) */}
        {notifications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={24} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">All caught up!</h3>
            <p className="text-muted-foreground text-sm">
              No new notifications right now
            </p>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default Notifications;
import { ChevronRight, Users } from "lucide-react";

interface RelationshipGroupProps {
  title: string;
  timelineCount: number;
  color: "pink" | "blue" | "green" | "yellow" | "purple" | "orange";
  icon?: React.ReactNode;
  onClick?: () => void;
}

const RelationshipGroup = ({
  title,
  timelineCount,
  color,
  icon,
  onClick,
}: RelationshipGroupProps) => {
  const colorClasses = {
    pink: "timeline-card-pink",
    blue: "timeline-card-blue",
    green: "timeline-card-green", 
    yellow: "timeline-card-yellow",
    purple: "timeline-card-purple",
    orange: "timeline-card-orange",
  };

  return (
    <div
      onClick={onClick}
      className={`${colorClasses[color]} rounded-card p-4 cursor-pointer 
                 transition-all duration-300 hover:shadow-card hover:-translate-y-1 
                 active:scale-95 bg-card shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-current/10">
            {icon || <Users size={20} />}
          </div>
          
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {timelineCount} timeline{timelineCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <ChevronRight size={20} className="text-muted-foreground" />
      </div>
    </div>
  );
};

export default RelationshipGroup;
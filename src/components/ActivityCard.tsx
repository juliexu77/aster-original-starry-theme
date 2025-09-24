import { Clock, Baby, Palette, Moon, StickyNote, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export interface Activity {
  id: string;
  type: "feed" | "diaper" | "nap" | "note";
  time: string;
  details: {
    quantity?: string;
    diaperType?: "pee" | "poop" | "both";
    startTime?: string;
    endTime?: string;
    note?: string;
  };
}

interface ActivityCardProps {
  activity: Activity;
  onEdit?: (activity: Activity) => void;
  onDelete?: (activityId: string) => void;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "feed":
      return <Baby className="h-4 w-4" />;
    case "diaper":
      return <Palette className="h-4 w-4" />;
    case "nap":
      return <Moon className="h-4 w-4" />;
    case "note":
      return <StickyNote className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getActivityGradient = (type: string) => {
  switch (type) {
    case "feed":
      return "bg-gradient-feed";
    case "diaper":
      return "bg-gradient-diaper";
    case "nap":
      return "bg-gradient-nap";
    case "note":
      return "bg-gradient-note";
    default:
      return "bg-gradient-primary";
  }
};

const getActivityDetails = (activity: Activity) => {
  switch (activity.type) {
    case "feed":
      return activity.details.quantity ? `${activity.details.quantity} oz` : "";
    case "diaper":
      return activity.details.diaperType ? 
        activity.details.diaperType.charAt(0).toUpperCase() + activity.details.diaperType.slice(1) : "";
    case "nap":
      return activity.details.startTime && activity.details.endTime 
        ? `${activity.details.startTime} - ${activity.details.endTime}` : "";
    case "note":
      return activity.details.note || "";
    default:
      return "";
  }
};

export const ActivityCard = ({ activity, onEdit, onDelete }: ActivityCardProps) => {
  const details = getActivityDetails(activity);
  const activityText = details ? `${activity.type} ${details}` : activity.type;

  return (
    <div className="relative flex items-center gap-3 py-1 group hover:bg-accent/30 rounded-md px-2 transition-colors">
      {/* Timeline line */}
      <div className="absolute left-3 top-5 bottom-0 w-0.5 bg-border group-last:hidden"></div>
      
      {/* Timeline marker */}
      <div className={`relative z-10 flex-shrink-0 w-6 h-6 rounded-full ${getActivityGradient(activity.type)} flex items-center justify-center text-white`}>
        {getActivityIcon(activity.type)}
      </div>
      
      {/* Content - single line */}
      <div className="flex-1 flex items-center justify-between min-w-0">
        <p className="text-sm text-foreground font-medium capitalize truncate">
          {activityText}
        </p>
        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          <span className="text-xs text-muted-foreground">
            {activity.time}
          </span>
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(activity)}>
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(activity.id)} 
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};
import { CheckCircle, Circle, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface StageViewProps {
  stages: string[];
  currentStage: string;
  completedStages: string[];
}

export const StageView = ({ stages, currentStage, completedStages }: StageViewProps) => {
  return (
    <div className="space-y-4">
      {stages.map((stage) => {
        const isCompleted = completedStages.includes(stage);
        const isCurrent = currentStage === stage;
        return (
          <div key={stage} className="flex items-center gap-4">
            <div>
              {isCompleted ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : isCurrent ? (
                <Loader className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className={cn("text-lg", {
              "font-bold text-primary": isCurrent,
              "text-muted-foreground": !isCurrent && !isCompleted,
            })}>
              {stage}
            </div>
          </div>
        );
      })}
    </div>
  );
};

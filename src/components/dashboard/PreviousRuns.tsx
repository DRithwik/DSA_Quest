import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { History, RefreshCw, Clock, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { apiClient, AnalysisRun } from "@/lib/api";

interface PreviousRunsProps {
  onSelectRun: (runId: string) => void;
  selectedRun: string | null;
}

export const PreviousRuns = ({ onSelectRun, selectedRun }: PreviousRunsProps) => {
  const [runs, setRuns] = useState<AnalysisRun[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPreviousRuns = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getAllRuns();
      setRuns(response.runs);
      toast.success("Previous runs loaded");
    } catch (error) {
      toast.error("Failed to load previous runs");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviousRuns();
  }, []);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="w-80 border-r border-border bg-card/50 backdrop-blur rounded-none h-screen flex flex-col">
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Previous Runs</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchPreviousRuns}
            disabled={loading}
            className="h-8 w-8"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Select an analysis run to view its results
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {runs.map((run) => (
            <button
              key={run.id}
              onClick={() => onSelectRun(run.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg border transition-all hover:bg-secondary/50",
                selectedRun === run.id
                  ? "bg-primary/20 border-primary"
                  : "bg-secondary/20 border-border"
              )}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FolderOpen className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="font-medium text-sm truncate">{run.project_name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    v{run.version}
                  </Badge>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(run.timestamp)}</span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground">
                    {run.file_count} files
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span
                    className={cn(
                      "font-medium",
                      run.issue_count > 50
                        ? "text-destructive"
                        : run.issue_count > 20
                        ? "text-chart-4"
                        : "text-success"
                    )}
                  >
                    {run.issue_count} issues
                  </span>
                </div>
              </div>
            </button>
          ))}

          {runs.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No previous runs found
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network } from "lucide-react";
import { apiClient } from "@/lib/api";

interface DependencyGraphProps {
  projectId: string;
}

export const DependencyGraph = ({ projectId }: DependencyGraphProps) => {
  const [deps, setDeps] = useState<Array<{ name: string; version: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.getDependencies(projectId);
        const dependencies = res?.dependencies || {};
        const list = Object.entries(dependencies).map(([name, version]) => ({ name, version }));
        if (mounted) setDeps(list);
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load dependencies");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (projectId) load();

    return () => {
      mounted = false;
    };
  }, [projectId]);

  return (
    <Card className="bg-card/50 backdrop-blur border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-accent" />
          <CardTitle>Project Dependencies</CardTitle>
        </div>
        <CardDescription>External packages and libraries used in your project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading && <div className="text-sm text-muted-foreground">Loading dependencies…</div>}
          {error && <div className="text-sm text-destructive">{error}</div>}
          {!loading && !error && deps.length === 0 && (
            <div className="text-sm text-muted-foreground">No dependencies found.</div>
          )}
          {deps.map((dep) => (
            <div
              key={dep.name}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span className="font-mono font-medium">{dep.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={"default"}>{"runtime"}</Badge>
                <span className="text-sm text-muted-foreground font-mono">{dep.version}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

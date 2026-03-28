import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { apiClient } from "@/lib/api";

interface TechnicalRequirementsProps {
  projectId: string;
}

export const TechnicalRequirements = ({ projectId }: TechnicalRequirementsProps) => {
  const [requirements, setRequirements] = useState<Array<{ category: string; items: string[] }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Prefer explicit endpoint for dependencies/technical requirements
        const depRes = await apiClient.getDependencies(projectId).catch(() => ({ technical_requirements: [] }));
        const tech = depRes?.technical_requirements || [];

        // Fallback: try run details for `Technical_requirements` if present
        if (tech.length === 0) {
          const run = await apiClient.getRunDetails(projectId).catch(() => null);
          const fallback = run?.latest?.Technical_requirements || run?.latest?.technical_requirements || [];
          if (mounted) setRequirements([{ category: "Requirements", items: fallback }]);
        } else {
          if (mounted) setRequirements([{ category: "Requirements", items: tech }]);
        }
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load technical requirements");
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
          <Settings className="h-5 w-5 text-primary" />
          <CardTitle>Technical Requirements</CardTitle>
        </div>
        <CardDescription>System and environment requirements for the project</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <div className="text-sm text-muted-foreground">Loading technical requirements…</div>}
        {error && <div className="text-sm text-destructive">{error}</div>}
        {!loading && !error && requirements.length === 0 && (
          <div className="text-sm text-muted-foreground">No technical requirements found.</div>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {requirements.map((req) => (
            <div key={req.category} className="space-y-2">
              <Badge variant="outline" className="mb-2">
                {req.category}
              </Badge>
              <ul className="space-y-1">
                {req.items.map((item, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-accent mt-1">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

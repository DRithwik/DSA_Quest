import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Code2, AlertTriangle, CheckCircle, FileCode } from "lucide-react";
import { DependencyGraph } from "./DependencyGraph";
import { TechnicalRequirements } from "./TechinalRequirements";
import { apiClient } from "@/lib/api";

interface AnalyticsDashboardProps {
  projectId: string;
}

export const AnalyticsDashboard = ({ projectId }: AnalyticsDashboardProps) => {
  const [project, setProject] = useState<any>(null);
  const [deps, setDeps] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [projRes, depsRes] = await Promise.all([
          apiClient.getRunDetails(projectId).catch(() => null),
          apiClient.getDependencies(projectId).catch(() => ({ dependencies: {} })),
        ]);

        if (mounted) {
          setProject(projRes);
          setDeps(depsRes?.dependencies || {});
        }
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load dashboard data");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (projectId) load();

    return () => {
      mounted = false;
    };
  }, [projectId]);

  const fileTypeData = useMemo(() => {
    // Derive file type counts from project.latest.root if available
    if (!project?.latest?.root) return [];
    const counts: Record<string, number> = {};
    for (const item of project.latest.root) {
      const cat = item.file_category || (item.type === "file" ? "Code Files" : "Directory");
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return Object.entries(counts).map(([name, value], i) => ({ name, value, color: `hsl(var(--chart-${(i % 5) + 1}))` }));
  }, [project]);

  const issuesData = useMemo(() => {
    if (!project?.latest?.root) return [];
    // Aggregate issues by category & severity if present
    const map: Record<string, { category: string; critical: number; medium: number; low: number }> = {};
    for (const item of project.latest.root) {
      for (const issue of item.issues || []) {
        const cat = issue.type_of_issue || "Other";
        if (!map[cat]) map[cat] = { category: cat, critical: 0, medium: 0, low: 0 };
        const sev = (issue?.severity || "medium").toLowerCase();
        if (sev === "critical") map[cat].critical += 1;
        else if (sev === "low") map[cat].low += 1;
        else map[cat].medium += 1;
      }
    }
    return Object.values(map);
  }, [project]);

  const stats = useMemo(() => {
    const totalFiles = project?.latest?.root?.filter((r: any) => r.type === "file")?.length || 0;
    const issuesFound = project?.latest?.root?.reduce((acc: number, r: any) => acc + (r.issues?.length || 0), 0) || 0;
    const fixesApplied = 0; // not tracked yet
    const codeFiles = project?.latest?.root?.filter((r: any) => r.file_category === "Code Files")?.length || 0;

    return [
      { label: "Total Files", value: String(totalFiles), icon: FileCode, color: "text-primary" },
      { label: "Issues Found", value: String(issuesFound), icon: AlertTriangle, color: "text-destructive" },
      { label: "Fixes Applied", value: String(fixesApplied), icon: CheckCircle, color: "text-success" },
      { label: "Code Files", value: String(codeFiles), icon: Code2, color: "text-accent" },
    ];
  }, [project]);

  return (
    <div className="space-y-6">
      {loading && <div className="text-sm text-muted-foreground">Loading dashboard…</div>}
      {error && <div className="text-sm text-destructive">{error}</div>}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card/50 backdrop-blur border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* File Types Distribution */}
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle>File Types Distribution</CardTitle>
            <CardDescription>Breakdown of file categories in your project</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fileTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fileTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Issues by Category */}
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle>Issues by Category</CardTitle>
            <CardDescription>Critical, medium, and low severity issues</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={issuesData}>
                <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Legend />
                <Bar dataKey="critical" fill="hsl(var(--destructive))" />
                <Bar dataKey="medium" fill="hsl(var(--chart-4))" />
                <Bar dataKey="low" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Dependency Graph */}
      <DependencyGraph projectId={projectId} />

      {/* Technical Requirements */}
      <TechnicalRequirements projectId={projectId} />
    </div>
  );
};

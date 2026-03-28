import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, FileCode, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Tooltip as RechartTooltip } from "recharts";
import { CodeComparison } from "./CodeComparsion";
import { apiClient } from "@/lib/api";

interface FileAnalysisViewProps {
  filePath: string;
  projectId: string;
}

export const FileAnalysisView = ({ filePath, projectId }: FileAnalysisViewProps) => {
  const [applyingFix, setApplyingFix] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient.getFileAnalysis(projectId, filePath);
        if (mounted) setAnalysis(data);
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load file analysis");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (projectId && filePath) load();

    return () => {
      mounted = false;
    };
  }, [projectId, filePath]);

  const handleApplyFix = async () => {
    setApplyingFix(true);
    // TODO: Implement API call to apply fixes
    setTimeout(() => setApplyingFix(false), 1500);
  };

  if (loading) return <div className="text-sm text-muted-foreground">Loading analysis…</div>;
  if (error) return <div className="text-sm text-destructive">{error}</div>;
  if (!analysis) return <div className="text-sm text-muted-foreground">No analysis found for this file.</div>;

  // derive file metadata (type, language / dependency kind)
  const filename = filePath.split("/").pop() || filePath;
  const ext = filename.includes(".") ? filename.split('.').pop()!.toLowerCase() : filename.toLowerCase();

  const detect = () => {
    let fileType = analysis.category || 'unknown';
    let language: string | null = null;
    let dependencyKind: string | null = null;

    const lower = filename.toLowerCase();

    if (lower === 'package.json') {
      fileType = 'dependencies';
      dependencyKind = 'npm';
      language = 'json';
    } else if (lower === 'requirements.txt' || lower.endsWith('requirements.txt')) {
      fileType = 'requirements';
      dependencyKind = 'pip';
      language = 'text';
    } else if (lower === 'pyproject.toml') {
      fileType = 'dependencies';
      dependencyKind = 'pip/poetry';
      language = 'toml';
    } else if (lower === 'pipfile') {
      fileType = 'dependencies';
      dependencyKind = 'pipenv';
      language = 'toml';
    } else if (lower === 'dockerfile' || lower.startsWith('dockerfile')) {
      fileType = 'config';
      language = 'dockerfile';
    } else if (['json', 'yaml', 'yml', 'toml'].includes(ext)) {
      fileType = 'config';
      language = ext === 'yml' ? 'yaml' : ext;
    } else if (['py', 'js', 'ts', 'tsx', 'jsx', 'java', 'go', 'c', 'cpp', 'rs'].includes(ext)) {
      fileType = 'code';
      language = ext === 'py' ? 'python' : ext;
    } else if (lower.endsWith('.lock')) {
      fileType = 'dependencies';
      dependencyKind = 'lockfile';
      language = 'text';
    }

    if ((analysis.dependencies && Object.keys(analysis.dependencies || {}).length > 0) && fileType === 'unknown') {
      fileType = 'dependencies';
    }

    return { fileType, language, dependencyKind };
  };

  const { fileType, language, dependencyKind } = detect();

  // issue buckets
  const issues = Array.isArray(analysis.issues) ? analysis.issues : [];
  let critical = 0;
  let high = 0;
  let medium = 0;
  let low = 0;

  issues.forEach((issue: any) => {
    const sev = (issue.severity || "").toString().toLowerCase();
    const errs = Array.isArray(issue.errors_or_vulnerabilities)
      ? issue.errors_or_vulnerabilities.length
      : Array.isArray(issue.errors || [])
      ? issue.errors.length
      : 0;
    const hasSuggestion = !!(issue.suggestion || issue.suggested_fix || issue.suggested_fix_text);

    if (sev.includes("critical") || sev.includes("vuln") || sev.includes("vulnerability")) {
      critical += 1;
    } else if (sev === "high" || errs > 0) {
      high += 1;
    } else if (hasSuggestion) {
      medium += 1;
    } else {
      low += 1;
    }
  });

  const chartData = [
    { name: "Critical", value: critical },
    { name: "High", value: high },
    { name: "Medium", value: medium },
    { name: "Low", value: low },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FileCode className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold font-mono">{filename}</h2>
        </div>
        <p className="text-sm text-muted-foreground font-mono">{filePath}</p>
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="secondary" className="capitalize">{fileType}</Badge>
          {language ? <Badge variant="outline">{language}</Badge> : null}
          {fileType === 'dependencies' && dependencyKind ? <Badge variant="outline">{dependencyKind}</Badge> : null}
          <Badge variant="destructive">{issues.length} issues</Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-secondary">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="issues">Issues ({issues.length})</TabsTrigger>
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
          <TabsTrigger value="code">Code Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className={"grid grid-cols-1 sm:grid-cols-" + (fileType === 'dependencies' ? '3' : '2') + " gap-4"}>
            <div>
              <h4 className="font-semibold text-sm mb-1">Type</h4>
              <p className="text-sm text-muted-foreground capitalize">{fileType || '-'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">Language / Format</h4>
              <p className="text-sm text-muted-foreground">{language || '-'}</p>
            </div>
            {fileType === 'dependencies' ? (
              <div>
                <h4 className="font-semibold text-sm mb-1">Dependency manager</h4>
                <p className="text-sm text-muted-foreground">{dependencyKind || '-'}</p>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Purpose</h3>
              <p className="text-sm text-muted-foreground">{analysis.use_of_file || analysis.use || "-"}</p>
            </div>

            <div className="w-full sm:w-56">
              <h3 className="font-semibold mb-2">Issue summary</h3>
              {chartData.length === 0 ? (
                <div className="text-sm text-muted-foreground">No issues detected</div>
              ) : (
                <ChartContainer
                  config={{
                    Critical: { color: "var(--chart-1)" },
                    High: { color: "var(--chart-2)" },
                    Medium: { color: "var(--chart-3)" },
                    Low: { color: "var(--chart-4)" },
                  }}
                >
                  <PieChart>
                    <Pie dataKey="value" data={chartData} cx="50%" cy="50%" innerRadius={18} outerRadius={30} paddingAngle={3} labelLine={false}>
                      {chartData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={idx === 0 ? "var(--chart-1)" : idx === 1 ? "var(--chart-2)" : idx === 2 ? "var(--chart-3)" : "var(--chart-4)"} />
                      ))}
                    </Pie>
                    <RechartTooltip />
                  </PieChart>
                </ChartContainer>
              )}
            </div>
          </div>

          {fileType === 'dependencies' && (
            <div>
              <h3 className="font-semibold mb-2">Dependencies</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(analysis.dependencies || {}).map(([name, version]) => (
                  <Badge key={name} variant="outline" className="font-mono">
                    {name}@{String(version)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="documentation" className="space-y-4 mt-4">
          <div>
            <h3 className="font-semibold mb-2">Documentation</h3>
            <div className="prose max-w-none">
              {analysis.documentation ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis.documentation}</ReactMarkdown>
              ) : (
                <p className="text-sm text-muted-foreground">-</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4 mt-4">
          {(analysis.issues || []).map((issue: any, idx: number) => (
            <div key={idx} className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">{issue.type_of_issue || issue.type || "Issue"}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Errors:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {(issue.errors_or_vulnerabilities || issue.errors || []).map((error: string, i: number) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Explanation:</h4>
                    <p className="text-sm text-muted-foreground">{issue.explanation || "-"}</p>
                  </div>
                  <div className="bg-success/10 border border-success/20 p-3 rounded">
                    <h4 className="font-semibold text-sm mb-1 flex items-center gap-2 text-success">
                      <CheckCircle className="h-4 w-4" />
                      Suggested Fix:
                    </h4>
                    <p className="text-sm">{issue.suggestion || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="improvements" className="space-y-4 mt-4">
          {(analysis.basic_improvements || analysis.improvements || []).map((improvement: any, idx: number) => (
            <div key={idx} className="p-4 rounded-lg border border-accent/20 bg-accent/5">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-accent mt-0.5" />
                <div className="flex-1 space-y-2">
                  <Badge variant="outline">{improvement.type_of_improvement || improvement.type}</Badge>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Explanation:</h4>
                    <p className="text-sm text-muted-foreground">{improvement.explanation || "-"}</p>
                  </div>
                  <div className="bg-primary/10 border border-primary/20 p-3 rounded">
                    <h4 className="font-semibold text-sm mb-1">Suggestion:</h4>
                    <p className="text-sm">{improvement.suggestion || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="code" className="mt-4">
          <CodeComparison filePath={filePath} projectId={projectId} />
          <div className="mt-4 flex justify-end">
            <Button onClick={handleApplyFix} disabled={applyingFix} className="bg-success hover:bg-success/90">
              {applyingFix ? "Applying..." : "Apply Fix"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Folder, Play } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

const Index = () => {
  const [folderPath, setFolderPath] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleStartAnalysis = async () => {
    if (!folderPath.trim()) {
      toast.error("Please enter a valid folder path");
      return;
    }

    setIsAnalyzing(true);
    toast.loading("Starting analysis...");

    try {
      const result = await apiClient.startAnalysis(folderPath);
      setIsAnalyzing(false);
      toast.success("Analysis completed! Redirecting to dashboard...");
      setTimeout(() => navigate(`/dashboard?projectId=${result.project_id}`), 1000);
    } catch (error) {
      setIsAnalyzing(false);
      toast.error(error instanceof Error ? error.message : "Failed to start analysis");
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-8 text-center">
          {/* Logo/Icon */}
          <div className="flex justify-center">
            <div className="rounded-2xl bg-gradient-to-br from-primary to-accent p-4">
              <Code2 className="h-16 w-16 text-background" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Code Analysis
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Analyze your codebase for issues, dependencies, and improvements
            </p>
          </div>

          {/* Input Card */}
          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-center">
                <Folder className="h-5 w-5 text-accent" />
                Start Analysis
              </CardTitle>
              <CardDescription>
                Enter the path to your project folder to begin analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="/path/to/your/project"
                  value={folderPath}
                  onChange={(e) => setFolderPath(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleStartAnalysis()}
                  className="font-mono bg-secondary/50 border-border"
                />
                <Button
                  onClick={handleStartAnalysis}
                  disabled={isAnalyzing}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                >
                  {isAnalyzing ? (
                    "Analyzing..."
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>

              {/* Features */}
              <div className="grid gap-3 pt-4 text-left">
                <div className="flex items-start gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-accent mt-1.5" />
                  <span className="text-muted-foreground">
                    Comprehensive file and dependency analysis
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                  <span className="text-muted-foreground">
                    AI-powered issue detection and fixes
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-success mt-1.5" />
                  <span className="text-muted-foreground">
                    Interactive visualizations and reports
                  </span>
                </div>
              </div>
              <div className="flex justify-center gap-3 p-4">
                <Button variant="secondary" onClick={() => navigate('/dashboard?open=previousRuns')}>
                  View Previous Runs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;

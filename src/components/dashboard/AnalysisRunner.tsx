import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export const AnalysisRunner = ({ onAnalysisComplete }: { onAnalysisComplete: (projectId: string) => void }) => {
  const [path, setPath] = useState('');
  const [gitUrl, setGitUrl] = useState('');
  const [analysisType, setAnalysisType] = useState('path');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('');

  const handleAnalysis = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    let url = `${API_URL}/api/analyze/stream`;
    let body: any = {};

    if (analysisType === 'path') {
      if (!path) {
        toast.error('Please enter a path to analyze.');
        return;
      }
      url += `?path=${encodeURIComponent(path)}`;
      body = { path };
    } else {
      if (!gitUrl) {
        toast.error('Please enter a git URL to analyze.');
        return;
      }
      url += `?git_url=${encodeURIComponent(gitUrl)}`;
      body = { git_url: gitUrl };
    }

    setLoading(true);
    setProgress(0);
    setStep('Initializing...');

    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
        eventSource.close();
        return;
      }

      if (data.step === 'done') {
        toast.success('Analysis complete!');
        setLoading(false);
        eventSource.close();
        onAnalysisComplete(data.project_id);
        return;
      }

      setStep(data.step);
      // This is a rough estimation of progress.
      // A more accurate progress would require more information from the backend.
      setProgress((prev) => Math.min(prev + 10, 90));
    };

    eventSource.onerror = (error) => {
      toast.error('An error occurred during analysis.');
      console.error('EventSource failed:', error);
      setLoading(false);
      eventSource.close();
    };
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-2">Run New Analysis</h3>
      <RadioGroup defaultValue="path" onValueChange={setAnalysisType} className="mb-4">
        <div className="flex items-center space-x-2">
            <RadioGroupItem value="path" id="path" />
            <Label htmlFor="path">Local Path</Label>
        </div>
        <div className="flex items-center space-x-2">
            <RadioGroupItem value="git" id="git" />
            <Label htmlFor="git">Git URL</Label>
        </div>
      </RadioGroup>
      <div className="flex gap-2">
        {analysisType === 'path' ? (
          <Input
            type="text"
            placeholder="Enter absolute path to your project" 
            value={path}
            onChange={(e) => setPath(e.target.value)}
            disabled={loading}
          />
        ) : (
          <Input
            type="text"
            placeholder="Enter Git repository URL" 
            value={gitUrl}
            onChange={(e) => setGitUrl(e.target.value)}
            disabled={loading}
          />
        )}
        <Button onClick={handleAnalysis} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>
      {loading && (
        <div className="mt-4">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground mt-2">{step}</p>
        </div>
      )}
    </div>
  );
};
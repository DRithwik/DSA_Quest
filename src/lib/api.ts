
/**
 * API client for code analysis backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface AnalysisRun {
  id: string;
  project_id: string;
  project_name: string;
  version: number;
  timestamp: string;
  file_count: number;
  issue_count: number;
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  parent?: string | null;
  children?: FileNode[];
  content?: string;
  file_category?: string;
  use_of_file?: string;
  documentation?: string;
  dependencies?: Record<string, string>;
  technical_requirements?: string[];
  issues?: Array<{
    type_of_issue: string;
    errors_or_vulnerabilities: string[];
    explanation: string;
    suggestion: string;
  }>;
  basic_improvements?: Array<{
    type_of_improvement: string;
    explanation: string;
    suggestion: string;
  }>;
  fix?: string;
}

export interface ProjectDetails {
  _id: string;
  project_id: string;
  latest: {
    root: FileNode[];
    directory_graph?: FileNode;
    dependencies?: Record<string, string>;
    Technical_requirements?: string[];
  };
  version: number;
  updated_at: string;
  history?: Array<{
    version: number;
    state: any;
    timestamp: string;
  }>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request('/api/health');
  }

  async startAnalysis(path: string): Promise<{
    success: boolean;
    project_id: string;
    message: string;
    version: number;
    updated_at: string;
  }> {
    return this.request('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ path }),
    });
  }

  async getAllRuns(): Promise<{ runs: AnalysisRun[] }> {
    return this.request('/api/runs');
  }

  async getRunDetails(projectId: string): Promise<ProjectDetails> {
    return this.request(`/api/runs/${projectId}`);
  }

  async getFileTree(projectId: string): Promise<{ tree: FileNode | FileNode[] }> {
    return this.request(`/api/files/${projectId}`);
  }

  async getFileAnalysis(projectId: string, filePath: string): Promise<FileNode> {
    const encodedPath = encodeURIComponent(filePath);
    return this.request(`/api/files/${projectId}/analysis/${encodedPath}`);
  }

  async getDependencies(projectId: string): Promise<{
    dependencies: Record<string, string>;
    technical_requirements: string[];
  }> {
    return this.request(`/api/dependencies/${projectId}`);
  }

  async startGitAnalysis(url: string): Promise<{
    success: boolean;
    project_id: string;
    message: string;
    version: number;
    updated_at: string;
  }> {
    return this.request('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ git_url: url }),
    });
  }

  startAnalysisStream(
    params: { path?: string; git_url?: string },
    onProgress: (step: string) => void,
    onComplete: (projectId: string) => void,
    onError: (error: string) => void
  ) {
    const query = new URLSearchParams();
    if (params.path) query.set('path', params.path);
    if (params.git_url) query.set('git_url', params.git_url);

    const eventSource = new EventSource(`${this.baseUrl}/api/analyze/stream?${query.toString()}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.error) {
        onError(data.error);
        eventSource.close();
        return;
      }

      if (data.step === 'done') {
        onComplete(data.project_id);
        eventSource.close();
        return;
      }
      
      onProgress(data.step);
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      onError('Failed to connect to the analysis stream.');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }
}

export const apiClient = new ApiClient(API_URL);

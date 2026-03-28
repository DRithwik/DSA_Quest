import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Code2, Folder, Play, ArrowLeft, Layout, Shield, Cpu, Terminal, Zap, Sparkles, Brain, Bug, CpuIcon, Activity, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import MarketingNavbar from "@/components/MarketingNavbar";
import PageBackground from "@/components/PageBackground";

const CodeAnalysis = () => {
  const navigate = useNavigate();
  const [path, setPath] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  // Auto-navigate 10s countdown after analysis is complete
  useEffect(() => {
    if (projectId) {
      setCountdown(10);
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownRef.current!);
            navigate(`/analysis/project/${projectId}`);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [projectId]);

  const startAnalysis = () => {
    if (!path || analyzing) return;
    setAnalyzing(true);
    setProjectId(null);
    setCountdown(null);
    setLogs(["[SYSTEM] Initializing Neural Link..."]);

    const source = new EventSource(`http://localhost:5000/api/analyze/stream?git_url=${encodeURIComponent(path)}`);
    
    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          setLogs(prev => [...prev, `[ERROR] ${data.error}`]);
          setAnalyzing(false);
          source.close();
        } else if (data.step === 'done') {
          setLogs(prev => [...prev, `[SUCCESS] Analysis complete. Project ID: ${data.project_id}`]);
          setProjectId(data.project_id);
          setAnalyzing(false);
          source.close();
        } else {
          setLogs(prev => [...prev, `[NEURAL AGENT] ${data.step}`]);
        }
      } catch (err) {
        console.error("Parse Error:", err);
      }
    };
    
    source.onerror = (err) => {
      setLogs(prev => [...prev, "[CRITICAL FAULT] Connection to analysis engine lost. Are you running the Python backend on port 5000?"]);
      setAnalyzing(false);
      source.close();
    };
  };

  const FEATURES = [
    { label: "Comprehensive file and dependency analysis", color: "bg-cyan-400 shadow-cyan-500/50", icon: <CpuIcon className="h-4 w-4" /> },
    { label: "AI-powered issue detection and fixes", color: "bg-violet-500 shadow-violet-500/50", icon: <Brain className="h-4 w-4" /> },
    { label: "Interactive visualizations and reports", color: "bg-emerald-500 shadow-emerald-500/50", icon: <Activity className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0c10] text-foreground flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Background decoration */}
      <PageBackground />

      <MarketingNavbar />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-20">
        <div className="max-w-4xl w-full text-center space-y-12">
          {/* Header Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
              <div className="relative w-28 h-28 rounded-[2rem] bg-gradient-to-tr from-violet-600 to-cyan-500 p-0.5 shadow-2xl transition-transform hover:scale-110 hover:rotate-3 duration-500">
                <div className="w-full h-full bg-[#0d1117] rounded-[1.8rem] flex items-center justify-center">
                  <Bug className="h-10 w-10 text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase font-display italic">
              Code <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">Analysis</span>
            </h1>
            <p className="text-muted-foreground text-xl md:text-2xl font-medium max-w-2xl mx-auto font-body leading-relaxed">
              Analyze your codebase for issues, dependencies, and improvements via our neural engine.
            </p>
          </div>

          {/* Analysis Card */}
          <div className="max-w-3xl mx-auto w-full mt-12 bg-[#0d1117]/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-16 shadow-[0_0_100px_rgba(0,0,0,1)] relative group overflow-hidden">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/30 to-cyan-500/30 rounded-[3rem] blur opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
            
            <div className="relative space-y-10">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3 text-cyan-400 font-display font-black text-xl uppercase tracking-[0.3em]">
                  <Folder className="h-6 w-6" />
                  <span>Deployment Link</span>
                </div>
                <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-50">Specify the relative path or repository ID</p>
              </div>

              <div className="flex flex-col md:flex-row gap-5 items-stretch">
                <div className="flex-1 relative group">
                  <div className="absolute inset-0 bg-cyan-400/5 rounded-[1.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                  <input
                    type="text"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    placeholder="/path/to/protocol"
                    className="relative z-10 w-full h-16 bg-black/60 border border-white/10 rounded-[1.5rem] px-8 text-white font-mono text-base focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all placeholder:text-white/10"
                  />
                  <Terminal className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/10 pointer-events-none z-20" />
                </div>
                <Button 
                  size="lg"
                  onClick={startAnalysis}
                  disabled={analyzing || !path}
                  className="h-16 px-12 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white font-black text-xs uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl shadow-cyan-500/20 flex gap-4 transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:opacity-50 border-0 shrink-0"
                >
                  {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                  {analyzing ? "Analyzing..." : "Analyze Core"}
                </Button>
              </div>

              {/* Terminal Logs Output */}
              {logs.length > 0 && (
                <div className="mt-8 bg-black/80 rounded-[1.5rem] border border-cyan-500/30 overflow-hidden text-left shadow-[0_0_30px_rgba(34,211,238,0.15)] flex flex-col">
                  <div className="bg-white/5 border-b border-white/10 px-6 py-3 flex items-center gap-3">
                    <Terminal className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Neural Logs</span>
                    <div className="ml-auto flex gap-2">
                       <span className="w-3 h-3 rounded-full bg-rose-500/50" />
                       <span className="w-3 h-3 rounded-full bg-amber-500/50" />
                       <span className="w-3 h-3 rounded-full bg-emerald-500/50" />
                    </div>
                  </div>
                  <div ref={terminalRef} className="p-6 max-h-64 overflow-y-auto font-mono text-sm space-y-2 custom-scrollbar">
                    {logs.map((log, idx) => (
                      <div key={idx} className={`${log.includes('[ERROR]') || log.includes('[CRITICAL FAULT]') ? 'text-rose-400' : log.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : log.includes('[SYSTEM]') ? 'text-violet-400 opacity-80' : 'text-cyan-300'}`}>
                        <span className="opacity-50 mr-3">[{new Date().toLocaleTimeString()}]</span>
                        {log}
                      </div>
                    ))}
                    {analyzing && (
                       <div className="text-cyan-400 animate-pulse">
                         <span className="opacity-50 mr-3">[{new Date().toLocaleTimeString()}]</span>
                         <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-ping" />
                       </div>
                    )}
                  </div>
                  {projectId && (
                    <div className="bg-emerald-500/10 border-t border-emerald-500/20 p-4 flex justify-between items-center px-6">
                       <span className="text-emerald-400 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                         <Activity className="h-4 w-4" /> Ready for review
                       </span>
                       <div className="flex items-center gap-4">
                         {countdown !== null && (
                           <span className="text-white/40 font-mono text-xs">
                             Auto-opening in <span className="text-cyan-400 font-black text-sm">{countdown}s</span>
                           </span>
                         )}
                         <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase tracking-widest text-[10px] px-6 transition-all border border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]" onClick={() => navigate(`/analysis/project/${projectId}`)}>
                           VIEW
                         </Button>
                       </div>
                    </div>
                  )}
                </div>
              )}

              {/* Features bullets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {FEATURES.map((f, i) => (
                   <div key={i} className="flex flex-col items-center gap-3 group/feat">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 transition-all group-hover/feat:scale-110 group-hover/feat:bg-white/10 ${f.label.includes('AI') ? 'text-violet-400' : f.label.includes('file') ? 'text-cyan-400' : 'text-emerald-400'}`}>
                         {f.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/50 group-hover/feat:text-white transition-colors">{f.label}</span>
                   </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional info footer */}
          <div className="pt-12 flex flex-col items-center gap-8">
             <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 animate-pulse">
                <div className="h-px w-12 bg-white/10" />
                Neural Bridge Ready
                <div className="h-px w-12 bg-white/10" />
             </div>
             <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-3 text-muted-foreground hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em] mx-auto bg-white/5 px-8 py-3 rounded-xl border border-white/5 hover:border-white/10 group active:scale-95"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Return Control
              </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CodeAnalysis;

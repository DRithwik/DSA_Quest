import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Activity, ShieldAlert, Zap, Cpu, Code2, HeartPulse, HardDrive, CheckCircle2, TrendingUp, AlertTriangle, Bug } from "lucide-react";
import MarketingNavbar from "@/components/MarketingNavbar";
import PageBackground from "@/components/PageBackground";
import { Button } from "@/components/ui/button";

const AnalysisResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/runs/${id}`)
      .then(res => res.json())
      .then(json => {
         if (json.error) throw new Error(json.error);
         setData(json);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center font-mono">
      <div className="flex flex-col items-center gap-4 text-cyan-400">
        <Activity className="h-10 w-10 animate-spin" />
        <span className="uppercase tracking-[0.3em] text-xs font-black animate-pulse">Decrypting Neural Data</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0a0c10] text-rose-500 font-mono text-center flex flex-col items-center justify-center p-6 object-center">
       <ShieldAlert className="h-16 w-16 mb-6" />
       <h2>CRITICAL FAILURE</h2>
       <p>{error}</p>
       <Button onClick={() => navigate('/analysis')} className="mt-8 bg-rose-500 text-black font-black">Return</Button>
    </div>
  );

  // Parse data
  const files = (data?.root || []).filter((f: any) => f.type === 'file');
  let activeIssues: any[] = [];
  let improvements: any[] = [];
  let fileFixes: any[] = [];
  
  files.forEach((f: any) => {
    if (f.issues) {
       f.issues.forEach((i: any) => activeIssues.push({...i, file: f.name}));
    }
    if (f.basic_improvements) {
       f.basic_improvements.forEach((i: any) => improvements.push({...i, file: f.name}));
    }
    if (f.fix) {
       fileFixes.push({ name: f.name, original: f.content, fix: f.fix, issuesCount: f.issues?.length || 0 });
    }
  });

  const bugCount = activeIssues.filter(i => i.type_of_issue?.toLowerCase().includes('bug')).length;
  const securityCount = activeIssues.filter(i => i.type_of_issue?.toLowerCase().includes('security')).length;
  const perfCount = activeIssues.filter(i => i.type_of_issue?.toLowerCase().includes('redundancy')).length;
  
  const totalVulns = bugCount + securityCount + perfCount;
  const systemHealth = Math.max(10, 100 - (totalVulns * 5));

  return (
    <div className="min-h-screen bg-[#0a0c10] text-foreground flex flex-col font-sans selection:bg-cyan-500/30 pb-32">
      <PageBackground />
      <MarketingNavbar />

      <main className="relative z-10 container mx-auto px-6 pt-32">
        <button onClick={() => navigate('/analysis')} className="flex items-center gap-2 text-white/50 hover:text-cyan-400 transition-colors uppercase tracking-widest text-xs font-black mb-12">
          <ArrowLeft className="h-4 w-4" /> Initialize New Scan
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
           <div>
             <h1 className="text-5xl md:text-7xl font-black font-display uppercase italic tracking-tighter text-white mb-2">
               System <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">Telemetry</span>
             </h1>
             <p className="text-muted-foreground font-mono text-sm tracking-widest uppercase">ID: {id?.substring(0,16)}...</p>
           </div>
           
           <div className="flex items-center gap-6 bg-black/40 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
             <div>
               <div className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black mb-1">Code Health</div>
               <div className={`text-5xl font-black ${systemHealth > 80 ? 'text-emerald-400' : systemHealth > 50 ? 'text-amber-400' : 'text-rose-500'}`}>
                 {systemHealth}%
               </div>
             </div>
             <HeartPulse className={`h-12 w-12 ${systemHealth > 80 ? 'text-emerald-400/50' : systemHealth > 50 ? 'text-amber-400/50' : 'text-rose-500/50 animate-pulse'}`} />
           </div>
        </div>

        {/* Neural Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <GraphCard 
            title="Analysis Effect" 
            metric={bugCount} 
            subtitle="Logic Bugs Detected" 
            color="rose"
            icon={<Bug className="h-5 w-5" />}
            percent={Math.min(100, bugCount * 15)}
          />
          <GraphCard 
            title="Deployment Readiness" 
            metric={securityCount} 
            subtitle="Security Vectors" 
            color="amber"
            icon={<ShieldAlert className="h-5 w-5" />}
            percent={Math.min(100, securityCount * 25)}
          />
          <GraphCard 
            title="Optimization Scale" 
            metric={perfCount} 
            subtitle="Redundant Ops" 
            color="cyan"
            icon={<Zap className="h-5 w-5" />}
            percent={Math.min(100, perfCount * 10)}
          />
        </div>

        {/* Suggestions Section */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <TrendingUp className="h-8 w-8 text-violet-400" />
            <h2 className="text-3xl font-black uppercase tracking-widest text-white">Strategic Suggestions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {improvements.slice(0, 6).map((imp, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={idx} 
                className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white-[0.07] transition-colors relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-xs uppercase font-black tracking-widest text-violet-400 mb-2">{imp.file} • {imp.type_of_improvement}</div>
                <div className="text-white/90 font-medium mb-3">{imp.explanation}</div>
                <div className="text-sm text-cyan-300/70 font-mono border-l-2 border-cyan-500/30 pl-3">{imp.suggestion}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bug Fixation Section */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <Cpu className="h-8 w-8 text-emerald-400" />
            <h2 className="text-3xl font-black uppercase tracking-widest text-white">Bug Fixation / Refactored Code</h2>
          </div>
          
          <div className="space-y-8">
            {fileFixes.filter(f => f.issuesCount > 0 || f.fix.length > 50).map((file, idx) => (
               <div key={idx} className="bg-black/60 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-md">
                 <div className="bg-white/5 border-b border-white/10 p-6 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <Code2 className="text-emerald-400 h-5 w-5" />
                     <span className="font-mono font-bold text-white">{file.name}</span>
                   </div>
                   <div className="bg-rose-500/20 text-rose-300 text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full border border-rose-500/30">
                     {file.issuesCount} Issues Resolved
                   </div>
                 </div>
                 <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                   <div className="p-6">
                     <div className="text-xs uppercase tracking-widest font-black text-rose-400 mb-4 flex items-center gap-2">
                       <AlertTriangle className="h-4 w-4" /> Before (Original)
                     </div>
                     <pre className="text-xs font-mono text-white/50 whitespace-pre-wrap bg-white/5 p-4 rounded-xl max-h-96 overflow-y-auto custom-scrollbar">
                       {file.original}
                     </pre>
                   </div>
                   <div className="p-6 relative">
                     <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
                     <div className="text-xs uppercase tracking-widest font-black text-emerald-400 mb-4 flex items-center gap-2">
                       <CheckCircle2 className="h-4 w-4" /> After (Neural Fix)
                     </div>
                     <pre className="text-xs font-mono text-emerald-50 whitespace-pre-wrap bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl max-h-96 overflow-y-auto custom-scrollbar shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
                       {file.fix}
                     </pre>
                   </div>
                 </div>
               </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

// Internal component for sexy mock graphs
const GraphCard = ({ title, metric, subtitle, color, icon, percent }: any) => {
  const colorMap: any = {
    rose: "from-rose-500 to-rose-400 bg-rose-500/20 text-rose-400 border-rose-500/30",
    amber: "from-amber-500 to-amber-400 bg-amber-500/20 text-amber-400 border-amber-500/30",
    cyan: "from-cyan-500 to-cyan-400 bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    emerald: "from-emerald-500 to-emerald-400 bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  };
  
  const c = colorMap[color] || colorMap.cyan;

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-white/20 transition-all">
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h3 className="text-white/50 text-xs font-black uppercase tracking-[0.2em] mb-1">{title}</h3>
          <div className="text-white font-black text-4xl">{metric}</div>
          <div className={`text-[10px] font-black uppercase tracking-widest ${c.split(' ')[2]}`}>{subtitle}</div>
        </div>
        <div className={`p-3 rounded-2xl ${c.split(' ')[2]} bg-opacity-20 border border-opacity-30 backdrop-blur-md`}>
          {icon}
        </div>
      </div>
      
      {/* Visual Graph Area using Framer Motion */}
      <div className="h-16 flex items-end gap-2 mt-auto relative z-10">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ height: "10%" }}
            animate={{ height: `${Math.max(10, percent - (Math.random() * 40))}%` }}
            transition={{ type: "spring", bounce: 0.4, delay: i * 0.1 }}
            className={`flex-1 rounded-t-sm bg-gradient-to-t ${c.split(' ')[0]} ${c.split(' ')[1]} opacity-50 group-hover:opacity-100 transition-opacity`}
          />
        ))}
      </div>
    </div>
  );
}

export default AnalysisResults;

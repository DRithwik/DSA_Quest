import React, { useState } from "react";
import { 
  Book, 
  Search, 
  Terminal, 
  Shield, 
  Cpu, 
  Code2, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Database, 
  Lock, 
  Globe, 
  Menu, 
  X, 
  Layout, 
  Bug, 
  Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MarketingNavbar from "@/components/MarketingNavbar";
import PageBackground from "@/components/PageBackground";

// Internal icon hack since Ship isn't imported
const Ship = (props: any) => <Globe {...props} />;

const SECTIONS = [
  {
    id: "getting-started", icon: <Ship className="h-5 w-5 text-cyan-400" />, title: "The Protocol",
    articles: [
      { title: "Introduction", desc: "Understand the core architecture of DSA-QUEST and how our neural engine operates.", badge: "Core" },
      { title: "Execution Sandbox", desc: "Security first. All code runs in isolated Docker containers with 0ms overhead.", badge: "Tech" },
      { title: "The AI Mentor", desc: "Powered by Gemini 1.5. Real-time semantic analysis and feedback for every submission.", badge: "AI" },
    ]
  },
  {
    id: "system", icon: <Database className="h-5 w-5 text-violet-400" />, title: "Systems",
    articles: [
      { title: "REST Endpoints", desc: "Full reference for /api/quests, /api/submissions, /api/auth — with request/response schemas.", badge: "Tech" },
      { title: "WebSocket Events", desc: "All socket events: joinQueue, joinRoom, updateProgress, sendAttack, battleFinished.", badge: "Tech" },
      { title: "Authentication", desc: "JWT-based auth flow — how to generate, validate, and refresh tokens.", badge: "Auth" },
    ]
  },
  {
     id: "contribute", icon: <Code2 className="h-5 w-5 text-emerald-400" />, title: "Open Source",
     articles: [
       { title: "Contribution Guide", desc: "How to clone the repo, set up the Docker sandbox, and submit PRs for new quests.", badge: "Guide" },
       { title: "Local Development", desc: "Step-by-step instructions for running the frontend and backend with hot-reload.", badge: "Guide" },
       { title: "Reporting Issues", desc: "Found a bug in our AI mentor or execution sandbox? Open an issue on our GitHub.", badge: "Bug" },
     ]
  },
];

const BADGE_COLORS: Record<string, string> = {
  Core: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  Tech: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  AI: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Auth: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  Guide: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Bug: "text-red-400 bg-red-400/10 border-red-400/20",
};


const Docs = () => {
  const [active, setActive] = useState("getting-started");
  const [search, setSearch] = useState("");

  const filteredSections = SECTIONS.map(s => ({
    ...s,
    articles: s.articles.filter(a => 
      a.title.toLowerCase().includes(search.toLowerCase()) || 
      a.desc.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(s => s.articles.length > 0);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-foreground flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Background decoration */}
      <PageBackground />

      <MarketingNavbar />

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
        
        {/* Sidebar Nav */}
        <aside className="space-y-12 lg:sticky lg:top-32 h-fit">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-hover:text-cyan-400 transition-colors" />
              <input 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search Protocols..." 
                 className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-cyan-500/50 shadow-2xl focus:ring-4 focus:ring-cyan-500/10 transition-all font-mono"
              />
           </div>

           <nav className="space-y-6">
              <p className="px-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Knowledge Base</p>
              <div className="space-y-2">
                 {SECTIONS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActive(s.id)}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                        ${active === s.id 
                           ? "bg-violet-600/10 border border-violet-500/30 text-white shadow-xl shadow-violet-500/10" 
                           : "text-muted-foreground hover:bg-white/5 hover:text-white"}`}
                    >
                       <span className={active === s.id ? "" : "opacity-30"}>{s.icon}</span>
                       {s.title}
                    </button>
                 ))}
              </div>
           </nav>

           <div className="p-8 rounded-[2rem] bg-gradient-to-br from-violet-600/20 to-cyan-500/20 border border-white/5 space-y-4 shadow-2xl ring-1 ring-white/10 relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                 <Zap className="h-12 w-12 text-white fill-current" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Need Support?</p>
              <p className="text-xs text-white/60 font-medium leading-relaxed font-body">Connect with the AI Core on Discord for instant protocol debriefing.</p>
              <Button size="sm" variant="outline" className="w-full h-10 border-white/20 hover:bg-white/10 uppercase font-black text-[10px] tracking-widest rounded-xl">Join Hub</Button>
           </div>
        </aside>

        {/* Content Area */}
        <div className="space-y-20 min-h-[60vh]">
           {filteredSections.map((s) => (
              <section key={s.id} id={s.id} className={`space-y-10 transition-opacity duration-1000 ${active === s.id ? "opacity-100" : "opacity-40"}`}>
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
                       {s.icon}
                    </div>
                    <div>
                       <h2 className="text-3xl font-black font-display uppercase tracking-tight text-white">{s.title}</h2>
                       <div className="h-1 w-12 bg-cyan-400 mt-1 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {s.articles.map((a) => (
                       <div key={a.title} className="group p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-violet-500/50 transition-all cursor-pointer shadow-2xl relative overflow-hidden flex flex-col justify-between">
                          <div className="space-y-4">
                             <div className="flex justify-between items-start">
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border ${BADGE_COLORS[a.badge]}`}>
                                   {a.badge}
                                </span>
                                <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                             </div>
                             <h3 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{a.title}</h3>
                             <p className="text-sm text-muted-foreground leading-relaxed font-body italic">
                                "{a.desc}"
                             </p>
                          </div>
                          
                          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Initialize Module</span>
                             <div className="h-1 w-12 bg-cyan-400" />
                          </div>
                       </div>
                    ))}
                 </div>
              </section>
           ))}

           {search && filteredSections.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 pt-20">
                 <div className="p-8 rounded-full bg-white/5 border border-white/5 border-dashed">
                    <Search className="h-12 w-12 text-muted-foreground/20" />
                 </div>
                 <p className="text-xl font-black font-display text-muted-foreground/40 uppercase tracking-[0.3em]">Protocol Not Found</p>
              </div>
           )}
        </div>
      </main>

      {/* Decorative Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} 
      />
    </div>
  );
};

export default Docs;
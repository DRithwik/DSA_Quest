import { useState } from "react";
import { Link } from "react-router-dom";
import { Map, CheckCircle2, Lock, ChevronRight, Code2, Zap, Clock, Star, ArrowLeft, Play, Send, Brain, Layout, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";
import MarketingNavbar from "@/components/MarketingNavbar";
import PageBackground from "@/components/PageBackground";

const QUESTS = [
  {
    id: 1, realm: "Array Realm", difficulty: "EASY", title: "Two Sum",
    desc: "Find two numbers in an array that add up to a target. Master the Hash Map approach.",
    xp: 150, time: "30 min", status: "COMPLETED", color: "emerald", icon: "⚔️",
    starterCode: "def solve(nums, target):\n    # Your code here\n    pass"
  },
  {
    id: 2, realm: "Array Realm", difficulty: "EASY", title: "Best Time to Buy Stock",
    desc: "Maximize your profit by choosing the right day to buy and sell.",
    xp: 150, time: "30 min", status: "COMPLETED", color: "emerald", icon: "📈",
    starterCode: "def maxProfit(prices):\n    # Your code here\n    pass"
  },
  {
    id: 3, realm: "Array Realm", difficulty: "MEDIUM", title: "3Sum",
    desc: "Find all unique triplets in an array that sum to zero. Avoid duplicates.",
    xp: 300, time: "45 min", status: "ACTIVE", color: "amber", icon: "⚒️",
    starterCode: "def threeSum(nums):\n    # Your code here\n    pass"
  },
  {
    id: 4, realm: "String Forest", difficulty: "EASY", title: "Valid Anagram",
    desc: "Determine if two strings are anagrams of each other.",
    xp: 150, time: "20 min", status: "ACTIVE", color: "sky", icon: "🔡",
    starterCode: "def isAnagram(s, t):\n    # Your code here\n    pass"
  },
  {
    id: 5, realm: "Graph Kingdom", difficulty: "MEDIUM", title: "Number of Islands",
    desc: "Count the number of islands using DFS/BFS traversal.",
    xp: 350, time: "50 min", status: "LOCKED", color: "violet", icon: "🏝️",
    starterCode: "def numIslands(grid):\n    # Your code here\n    pass"
  },
];

const DIFF_COLORS: Record<string, string> = {
  EASY: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-emerald-500/10",
  MEDIUM: "text-amber-400 bg-amber-400/10 border-amber-400/20 shadow-amber-500/10",
  HARD: "text-rose-400 bg-rose-400/10 border-rose-400/20 shadow-rose-500/10",
};

const STATUS_ICONS: Record<string, JSX.Element> = {
  COMPLETED: <CheckCircle2 className="h-5 w-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />,
  ACTIVE: <Zap className="h-5 w-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />,
  LOCKED: <Lock className="h-5 w-5 text-muted-foreground/30" />,
};

const Quests = () => {
  const [filter, setFilter] = useState<"ALL" | "EASY" | "MEDIUM" | "HARD">("ALL");
  const [selectedQuest, setSelectedQuest] = useState<any | null>(null);
  const [code, setCode] = useState("");
  const [view, setView] = useState<"LIST" | "EDITOR">("LIST");

  const filtered = filter === "ALL" ? QUESTS : QUESTS.filter(q => q.difficulty === filter);

  const openEditor = (quest: any) => {
    if (quest.status === "LOCKED") return;
    setSelectedQuest(quest);
    setCode(quest.starterCode);
    setView("EDITOR");
  };

  if (view === "EDITOR" && selectedQuest) {
    return (
      <div className="h-screen bg-[#0a0c10] text-foreground flex flex-col font-sans selection:bg-violet-500/30">
        {/* Editor Nav */}
        <nav className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-background/50 backdrop-blur-2xl z-50">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setView("LIST")}
              className="group text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-all flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-white/20"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Quests
            </button>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <span className="font-display font-black text-white italic text-lg">{selectedQuest.title}</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${DIFF_COLORS[selectedQuest.difficulty]}`}>
                {selectedQuest.difficulty}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white h-10 px-6 rounded-xl">Discard</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-500 font-black uppercase tracking-widest text-[10px] h-10 px-8 rounded-xl shadow-lg shadow-emerald-500/20">
              <Play className="h-3 w-3 mr-2 fill-current" /> Run Simulation
            </Button>
            <Button className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 font-black uppercase tracking-widest text-[10px] h-10 px-8 rounded-xl shadow-lg shadow-cyan-500/20 border-0">
              <Send className="h-3 w-3 mr-2" /> Submit Sol
            </Button>
          </div>
        </nav>

        <div className="flex-1 flex overflow-hidden">
          {/* Problem Spec */}
          <div className="w-[400px] border-r border-white/5 flex flex-col bg-white/[0.01] backdrop-blur-xl relative">
            <div className="p-8 overflow-y-auto space-y-8 h-full custom-scrollbar">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-violet-400">
                  <Layout className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Objective Detail</span>
                </div>
                <h2 className="text-3xl font-black font-display tracking-tight text-white">{selectedQuest.title}</h2>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">{selectedQuest.desc}</p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 opacity-5"><Terminal className="h-4 w-4" /></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400/80">Protocol Input</p>
                  <code className="text-xs font-mono text-white/90 bg-black/40 px-3 py-1.5 rounded-lg block">nums = [2, 7, 11, 15], target = 9</code>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 opacity-5"><Zap className="h-4 w-4" /></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400/80">Expected Result</p>
                  <code className="text-xs font-mono text-white/90 bg-black/40 px-3 py-1.5 rounded-lg block">[0, 1]</code>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-violet-600/10 border border-violet-500/20 space-y-3 shadow-2xl shadow-violet-500/5">
                <div className="flex items-center gap-2 text-violet-400">
                  <Brain className="h-4 w-4 drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Hint v1.0</span>
                </div>
                <p className="text-[11px] text-violet-300/80 leading-relaxed italic font-body">
                  "Utilize the Hash Map protocol to store complements... O(n) is the target complexity for this quest."
                </p>
              </div>
            </div>

            <div className="mt-auto p-6 border-t border-white/5 bg-background/80">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">
                <span>Outcome Registry</span>
                <span className="text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]">● Online</span>
              </div>
              <div className="p-4 rounded-xl bg-black font-mono text-[10px] text-muted-foreground/60 border border-white/5 min-h-[80px]">
                $ Waiting for neural bridge deployment...<br />
                $ Ready for code execution.
              </div>
            </div>
          </div>

          {/* Editor Container */}
          <div className="flex-1 bg-[#1e1e1e] relative">
            <div className="absolute top-4 right-4 z-10 opacity-20 pointer-events-none">
              <Code2 className="h-32 w-32" />
            </div>
            <Editor
              height="100%"
              defaultLanguage="python"
              value={code}
              onChange={(v) => setCode(v || "")}
              theme="vs-dark"
              options={{
                fontSize: 15,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontFamily: 'JetBrains Mono, monospace',
                cursorBlinking: "smooth",
                padding: { top: 32, bottom: 32 },
                lineHeight: 1.6,
                renderLineHighlight: 'all',
                scrollbar: { vertical: 'hidden', horizontal: 'hidden' }
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-foreground flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Background decoration */}
      <PageBackground />

      <MarketingNavbar />

      <div className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-16 space-y-6 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 bg-violet-500/10 rounded-2xl border border-violet-500/20 shadow-xl shadow-violet-500/10">
              <Map className="h-8 w-8 text-violet-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-display italic leading-none">
              Quest <span className="text-muted-foreground/30">Board</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl font-body leading-relaxed mx-auto md:mx-0">
            Venture into the Array Realms and DP Mountains. Solve problems, accumulate XP, and ascend the algorithm hierarchy.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center md:justify-start">
          {["ALL", "EASY", "MEDIUM", "HARD"].map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d as any)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border transition-all duration-300
                ${filter === d
                  ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/40 scale-105"
                  : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:border-white/20 hover:text-white"}`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Quest Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((q) => (
            <div
              key={q.id}
              onClick={() => openEditor(q)}
              className={`group relative p-8 rounded-[2rem] bg-white/[0.02] border backdrop-blur-3xl transition-all duration-500 flex flex-col gap-6 overflow-hidden
                ${q.status === "LOCKED"
                  ? "opacity-50 border-white/5 cursor-not-allowed"
                  : "border-white/10 hover:bg-white/[0.05] hover:border-violet-500/50 cursor-pointer hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-2 active:scale-95"}`}
            >
              {/* Background Glow Overlay */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-500/5 blur-[50px] group-hover:bg-violet-500/10 transition-colors rounded-full" />

              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-6">
                    {q.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">{q.realm}</p>
                    <h3 className="text-xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">{q.title}</h3>
                  </div>
                </div>
                {STATUS_ICONS[q.status]}
              </div>

              <p className="text-sm font-body text-muted-foreground leading-relaxed h-[3rem] overflow-hidden">
                {q.desc}
              </p>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${DIFF_COLORS[q.difficulty]}`}>
                    {q.difficulty}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                      <Clock className="h-3 w-3" /> {q.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-violet-500/50 transition-colors">
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>

              {/* Bottom stats overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Empty State / Coming Soon */}
        <div className="mt-20 p-12 rounded-[2.5rem] bg-white/[0.01] border border-white/5 border-dashed flex flex-col items-center gap-4 text-center">
          <Sparkles className="h-8 w-8 text-muted-foreground/20" />
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground/40">Expansion Protocol</p>
            <p className="text-xs text-muted-foreground/30 font-body mt-2">New realms and harder quests are currently being generated by our AI core.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quests;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sword, Zap, Shield, Flame, Trophy, Users, Code2, Clock, TrendingUp, Sparkles, Wand2, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import MarketingNavbar from "@/components/MarketingNavbar";
import PageBackground from "@/components/PageBackground";

const RECENT_BATTLES = [
  { id: 1, p1: "CodeKnight", p2: "BitWizard", winner: "CodeKnight", problem: "Two Sum", duration: "8m 42s", p1Elo: 1850, p2Elo: 1802 },
  { id: 2, p1: "AlgoNinja", p2: "StackMaster", winner: "StackMaster", problem: "Valid Parentheses", duration: "6m 18s", p1Elo: 1743, p2Elo: 1801 },
  { id: 3, p1: "RecursionLord", p2: "BTreeGod", winner: "RecursionLord", problem: "Number of Islands", duration: "11m 05s", p1Elo: 2001, p2Elo: 1988 },
  { id: 4, p1: "HashMapHero", p2: "DPSlayer", winner: "DPSlayer", problem: "LCS", duration: "14m 33s", p1Elo: 1654, p2Elo: 1700 },
];

const SPELLS = [
  { name: "Lag Spike", desc: "Slows opponent's editor for 10s", icon: <Zap className="h-6 w-6" />, color: "text-amber-400", cost: "2 charges", aura: "shadow-amber-500/10" },
  { name: "Syntax Fog", desc: "Blurs opponent code for 8s", icon: <Sparkles className="h-6 w-6" />, color: "text-cyan-400", cost: "3 charges", aura: "shadow-cyan-500/10" },
  { name: "Screen Flip", desc: "Inverts opponent's screen for 5s", icon: <Wand2 className="h-6 w-6" />, color: "text-rose-400", cost: "4 charges", aura: "shadow-rose-500/10" },
];

const Arena = () => {
  const [myProgress, setMyProgress] = useState(0);
  const [oppProgress, setOppProgress] = useState(0);
  const [inQueue, setInQueue] = useState(false);
  const [queueTime, setQueueTime] = useState(0);

  useEffect(() => {
    if (!inQueue) return;
    const t = setInterval(() => setQueueTime(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [inQueue]);

  useEffect(() => {
    const t = setTimeout(() => { setMyProgress(45); setOppProgress(62); }, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-foreground flex flex-col font-sans selection:bg-rose-500/30">
      {/* Background decoration */}
      <PageBackground />

      <MarketingNavbar />

      <div className="relative z-10 pt-28 pb-20 px-6 max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                <Sword className="h-8 w-8 text-rose-500" />
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase font-display italic">
                Arena <span className="text-muted-foreground/30">Preview</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl font-body">
              Real-time 1v1 algorithmic battles. ELO-ranked. No mercy.
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => setInQueue(q => !q)}
            className={`font-black px-10 py-8 rounded-[2rem] text-lg uppercase tracking-widest border-0 transition-all shadow-xl group ${
              inQueue
                ? "bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:bg-rose-500/30"
                : "bg-gradient-to-r from-rose-600 to-orange-500 hover:scale-105 active:scale-95 shadow-rose-500/20"
            }`}
          >
            {inQueue ? (
              <span className="flex items-center gap-3">
                <Clock className="h-5 w-5 animate-spin" />
                Searching... {queueTime}s
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Zap className="h-5 w-5 fill-current" /> Enter Matchmaking
              </span>
            )}
          </Button>
        </div>

        {/* Live Battle Preview */}
        <div className="relative p-1 rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-rose-500/40 via-white/5 to-violet-500/40 p-[1px] shadow-2xl">
          <div className="bg-[#0d1117]/90 backdrop-blur-3xl rounded-[2.4rem] p-8 md:p-12 space-y-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,1)]" />
              <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-400">Live Battle Protocol: Active</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-12">
              {/* Player 1 */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center font-black text-2xl text-violet-400 shadow-xl shadow-violet-500/10">Y</div>
                  <div>
                    <p className="font-black text-xl text-white">CodeKnight</p>
                    <p className="text-xs text-violet-400 font-bold uppercase tracking-widest">ELO 1850 | Master</p>
                  </div>
                </div>
                <div className="space-y-2">
                   <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                     <div
                        className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                        style={{ width: `${myProgress}%` }}
                     />
                   </div>
                   <div className="flex justify-between items-center px-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status: Solving</p>
                      <p className="text-xs font-mono text-cyan-400 font-bold">{myProgress}%</p>
                   </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 py-8 px-8 rounded-full bg-white/5 border border-white/5 backdrop-blur-3xl ring-8 ring-black/20">
                <div className="text-lg font-black tracking-[0.5em] text-rose-500 pl-[0.5em]">VS</div>
                <div className="h-px w-8 bg-white/10" />
                <Terminal className="h-6 w-6 text-muted-foreground/50" />
              </div>

              {/* Opponent */}
              <div className="space-y-6 text-right">
                <div className="flex items-center gap-4 justify-end">
                  <div>
                    <p className="font-black text-xl text-white">Shadow_Coder</p>
                    <p className="text-xs text-rose-400 font-bold uppercase tracking-widest">ELO 1910 | Challenger</p>
                  </div>
                  <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center font-black text-2xl text-rose-400 shadow-xl shadow-rose-500/10">S</div>
                </div>
                <div className="space-y-2">
                   <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                     <div
                        className="h-full bg-gradient-to-l from-rose-500 to-orange-400 rounded-full transition-all duration-1000 ease-out ml-auto shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                        style={{ width: `${oppProgress}%` }}
                     />
                   </div>
                   <div className="flex justify-between items-center px-1">
                      <p className="text-xs font-mono text-rose-400 font-bold">{oppProgress}%</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Opponent Status: High Speed</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spells */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
             <h2 className="text-2xl font-black tracking-[0.2em] uppercase font-display text-white/80">Battle Spells</h2>
             <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SPELLS.map((s) => (
              <div key={s.name} className={`group p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer shadow-2xl relative overflow-hidden ${s.aura}`}>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   {s.icon}
                </div>
                <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6 ${s.color}`}>
                   {s.icon}
                </div>
                <h3 className={`font-black text-xl mb-2 ${s.color}`}>{s.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-body">{s.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">{s.cost}</span>
                    <Button size="sm" variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-white hover:text-cyan-400 p-0">Preview</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Battles */}
        <div className="space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-cyan-400" />
                <h2 className="text-2xl font-black tracking-tighter font-display uppercase">Recent Wars</h2>
              </div>
              <Button variant="outline" className="text-[10px] font-black tracking-widest border-white/10 hover:bg-white/5 uppercase rounded-xl">Global History</Button>
           </div>
          
          <div className="rounded-[2rem] border border-white/5 overflow-hidden bg-white/[0.01] backdrop-blur-md shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    {["Problem", "Combatants", "Winner", "ELO Delta", "Duration"].map(h => (
                      <th key={h} className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {RECENT_BATTLES.map((b) => (
                    <tr key={b.id} className="hover:bg-white/[0.04] transition-colors group">
                      <td className="px-8 py-6">
                         <div className="flex flex-col">
                            <span className="font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{b.problem}</span>
                            <span className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest">Difficulty: Medium</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                           <span className="text-white font-bold">{b.p1}</span>
                           <span className="text-[10px] font-black decoration-rose-500/50 underline underline-offset-4">VS</span>
                           <span className="text-white/60">{b.p2}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest inline-flex items-center gap-2">
                           <Trophy className="h-3.5 w-3.5" /> {b.winner}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                            <TrendingUp className="h-3 w-3 text-cyan-400" />
                            <span>{b.p1Elo} <span className="text-white/20">→</span> {b.p1Elo + 15}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground/60 font-semibold font-mono">
                           <Clock className="h-3.5 w-3.5" />
                           {b.duration}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Arena;

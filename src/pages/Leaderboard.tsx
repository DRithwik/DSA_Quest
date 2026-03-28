import React from "react";
import { Link } from "react-router-dom";
import { Trophy, Medal, Star, Target, TrendingUp, Users, Crown, Zap, Shield, Sparkles, Wand2, Map, Code2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import MarketingNavbar from "@/components/MarketingNavbar";
import PageBackground from "@/components/PageBackground";

const LEADERBOARD_DATA = [
  { id: 1, name: "BitMaster", xp: 12540, level: 42, rank: 1, playerId: "U-7421", wins: 154, streak: 12, rating: 2840, highlight: "bg-amber-400/10 border-amber-400/20 shadow-amber-500/10 text-amber-400" },
  { id: 2, name: "CodeKnight", xp: 11820, level: 38, rank: 2, playerId: "U-1092", wins: 132, streak: 8, rating: 2715, highlight: "bg-sky-400/10 border-sky-400/20 shadow-sky-500/10 text-sky-400" },
  { id: 3, name: "AlgoWizard", xp: 11200, level: 35, rank: 3, playerId: "U-8832", wins: 121, streak: 15, rating: 2680, highlight: "bg-rose-400/10 border-rose-400/20 shadow-rose-500/10 text-rose-400" },
  { id: 4, name: "StackOverlord", xp: 9840, level: 32, rank: 4, playerId: "U-4421", wins: 98, streak: 5, rating: 2450, highlight: "bg-white/5 border-white/10 text-white/60" },
  { id: 5, name: "RecursionKing", xp: 9210, level: 30, rank: 5, playerId: "U-9022", wins: 87, streak: 4, rating: 2320, highlight: "bg-white/5 border-white/10 text-white/60" },
  { id: 6, name: "HashHero", xp: 8750, level: 28, rank: 6, playerId: "U-6610", wins: 76, streak: 3, rating: 2210, highlight: "bg-white/5 border-white/10 text-white/60" },
];

const Leaderboard = () => {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-foreground flex flex-col font-sans selection:bg-amber-500/30">
      {/* Background decoration */}
      <PageBackground />

      <MarketingNavbar />

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full space-y-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-white/5">
          <div className="space-y-4">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-xl shadow-amber-500/10">
                   <Trophy className="h-8 w-8 text-amber-500" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-display italic leading-none">
                  Global <span className="text-muted-foreground/30">Lords</span>
                </h1>
             </div>
             <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl font-body leading-relaxed">
               The elite circle of algorithm warriors. Ascend the rankings by conquering quests and winning arena battles.
             </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-3xl shadow-2xl">
               <div className="p-2 bg-sky-500/20 rounded-xl"><Users className="h-5 w-5 text-sky-400" /></div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Fighters</p>
                  <p className="text-xl font-black text-white">41,200+</p>
               </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-3xl shadow-2xl">
               <div className="p-2 bg-emerald-500/20 rounded-xl"><Shield className="h-5 w-5 text-emerald-400" /></div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Season Reset</p>
                  <p className="text-xl font-black text-white">12:04:33</p>
               </div>
            </div>
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
           {LEADERBOARD_DATA.slice(0, 3).map((user, idx) => (
              <div key={user.id} className={`group relative p-8 rounded-[2.5rem] bg-white/[0.02] border backdrop-blur-3xl transition-all duration-500 flex flex-col gap-6 overflow-hidden ${idx === 0 ? "border-amber-400/50 shadow-amber-500/10 mb-8 md:-translate-y-8" : "border-white/10 hover:border-white/20 shadow-2xl"}`}>
                 {idx === 0 && <Crown className="absolute top-8 right-8 h-10 w-10 text-amber-500 animate-bounce" />}
                 
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-[1.8rem] bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-black font-mono shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform text-white/40">
                       {user.playerId}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Rank #{user.rank}</span>
                           <Medal className={`h-3 w-3 ${user.highlight.split(' ').find(c => c.startsWith('text-'))}`} />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">{user.name}</h3>
                    </div>
                 </div>

                 <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-end border-b border-white/5 pb-3">
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Neural Rating</span>
                       <span className="text-xl font-black font-mono text-white flex items-center gap-2"><Zap className="h-4 w-4 text-amber-500 fill-current" /> {user.rating}</span>
                    </div>
                    <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
                       <span className="text-muted-foreground/40">Combat Wins</span>
                       <span className="text-emerald-400">{user.wins} Full Executes</span>
                    </div>
                 </div>

                 <div className="mt-auto pt-4 flex gap-3">
                    <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-3 text-center">
                       <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">Level</p>
                       <p className="text-lg font-black text-white">{user.level}</p>
                    </div>
                    <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-3 text-center">
                       <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">Streak</p>
                       <p className="text-lg font-black text-rose-500">{user.streak}D</p>
                    </div>
                 </div>
              </div>
           ))}
        </div>

        {/* List View for ranks 4+ */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 px-4">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-black uppercase tracking-[0.4em] text-muted-foreground/60">Protocol Rankings 4 - 100</h2>
           </div>
           
           <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.01] backdrop-blur-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 border-b border-white/10 uppercase italic font-display">
                       <tr>
                          {["Position", "Player ID", "Neural Rating", "Combat Stats", "Level / XP"].map(h => (
                             <th key={h} className="px-10 py-6 text-[11px] font-black tracking-[0.2em] text-muted-foreground/40">{h}</th>
                          ))}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {LEADERBOARD_DATA.slice(3).map((user) => (
                          <tr key={user.id} className="hover:bg-white/[0.03] transition-all group">
                             <td className="px-10 py-7">
                                <span className="text-2xl font-black font-mono text-muted-foreground/20 group-hover:text-white/20">#{user.rank}</span>
                             </td>
                             <td className="px-10 py-7">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-[8px] font-black font-mono transition-transform group-hover:scale-110 shadow-xl group-hover:shadow-violet-500/10 text-white/30 tracking-tighter italic">
                                      {user.playerId}
                                   </div>
                                   <div className="flex flex-col">
                                      <span className="font-black text-lg text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{user.name}</span>
                                      <span className="text-[10px] text-muted-foreground/40 font-black tracking-widest uppercase">Verified CodeLord</span>
                                   </div>
                                </div>
                             </td>
                             <td className="px-10 py-7 font-mono font-black text-lg text-white">
                                {user.rating}
                             </td>
                             <td className="px-10 py-7">
                                <div className="flex gap-4">
                                   <div className="flex flex-col">
                                      <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Wins</span>
                                      <span className="text-sm font-bold text-emerald-400">{user.wins}</span>
                                   </div>
                                   <div className="flex flex-col">
                                      <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Streak</span>
                                      <span className="text-sm font-bold text-rose-500">{user.streak}D</span>
                                   </div>
                                </div>
                             </td>
                             <td className="px-10 py-7">
                                <div className="space-y-2">
                                   <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                                      <span className="text-muted-foreground/40">Level {user.level}</span>
                                      <span className="text-white/60">{Math.floor(user.xp/100)}% to {user.level + 1}</span>
                                   </div>
                                   <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                      <div className="h-full bg-violet-600 rounded-full w-3/4 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                                   </div>
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* CTA Section */}
        <div className="pt-20 text-center space-y-8">
           <div className="inline-flex flex-col items-center gap-2">
              <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/60">Ascend the Hierarchy</p>
           </div>
           <h2 className="text-4xl md:text-6xl font-black font-display tracking-tighter text-white">READY TO BECOME <span className="text-cyan-400">#1</span>?</h2>
           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/login">
                <Button size="lg" className="h-16 px-12 rounded-[2rem] bg-gradient-to-r from-violet-600 to-cyan-500 hover:scale-105 active:scale-95 transition-all uppercase font-black tracking-widest text-sm shadow-xl shadow-cyan-500/20 border-0">
                   Initiate Combat
                </Button>
              </Link>
           </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;

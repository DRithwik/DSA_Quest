import MarketingFooter from "@/components/MarketingFooter";

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
    <div className="min-h-screen bg-[#080810] text-foreground flex flex-col font-body selection:bg-rose-500/30 overflow-x-hidden">
      {/* Background decoration */}
      <PageBackground />
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Floating Cinematic Glows */}
      <div className="absolute top-[15%] left-[-5%] w-[600px] h-[600px] bg-rose-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-5%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

      <MarketingNavbar />

      <div className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full space-y-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.2)] backdrop-blur-xl transition-transform hover:scale-110">
                <Sword className="h-10 w-10 text-rose-500" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-500/80 mb-2">Combat Protocol v4.0</p>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase font-display italic leading-none text-white drop-shadow-2xl">
                  Arena <span className="text-white/20">Alpha</span>
                </h1>
              </div>
            </div>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl font-body leading-relaxed">
              Real-time 1v1 algorithmic warfare. Ascend the ELO hierarchy by outperforming the network's <span className="text-rose-500 font-bold">Coldest Coders</span>.
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => setInQueue(q => !q)}
            className={`font-black px-12 py-10 rounded-[2.5rem] text-sm uppercase tracking-[0.3em] border-0 transition-all shadow-2xl group relative overflow-hidden active:scale-95 ${
              inQueue
                ? "bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:bg-rose-500/30 font-display shadow-rose-500/10"
                : "bg-gradient-to-r from-rose-600 to-orange-500 hover:scale-105 shadow-rose-500/30 text-white font-display"
            }`}
          >
            {inQueue ? (
              <span className="flex items-center gap-4 relative z-10">
                <Clock className="h-6 w-6 animate-spin text-rose-400" />
                Interrogating... {queueTime}s
              </span>
            ) : (
              <span className="flex items-center gap-4 relative z-10">
                <Zap className="h-6 w-6 fill-current text-white animate-pulse" /> Find Opponent
              </span>
            )}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>

        {/* Live Battle Preview */}
        <div className="relative p-[1px] rounded-[3rem] overflow-hidden bg-gradient-to-br from-rose-500/40 via-white/5 to-violet-500/40 shadow-2xl group">
          <div className="bg-[#0b0b14]/95 backdrop-blur-3xl rounded-[2.9rem] p-10 md:p-16 space-y-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(244,63,94,1)]" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-500">Live Global War: Priority 1</p>
              </div>
              <div className="px-5 py-2 rounded-full border border-white/5 bg-white/5 flex items-center gap-3">
                <Terminal className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Simulating Protocol Sequence...</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-16 md:gap-24 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-rose-500/10 blur-[60px] rounded-full pointer-events-none" />

              {/* Player 1 */}
              <div className="space-y-8 relative">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-violet-600/20 to-transparent border border-violet-500/30 flex items-center justify-center font-black text-3xl text-violet-400 shadow-xl shadow-violet-500/10 group-hover:scale-110 transition-transform duration-500 italic">Y</div>
                  <div>
                    <h3 className="font-black text-2xl text-white font-display uppercase italic tracking-tighter">CodeKnight</h3>
                    <div className="flex items-center gap-2">
                       <Shield className="h-3 w-3 text-violet-400" />
                       <p className="text-[10px] text-violet-400 font-black uppercase tracking-[0.2em]">Rating 1850 | Grandmaster</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                   <div className="h-5 bg-white/[0.03] rounded-full overflow-hidden border border-white/5 p-1 relative shadow-inner">
                     <div
                        className="h-full bg-gradient-to-r from-violet-600 to-cyan-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                        style={{ width: `${myProgress}%` }}
                     />
                     <div className="absolute inset-0 bg-white/5 opacity-50 animate-pulse" style={{ width: `${myProgress}%` }} />
                   </div>
                   <div className="flex justify-between items-center px-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Execution Phase: 12/24 Lines</p>
                      <p className="text-lg font-mono-code text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">{myProgress}%</p>
                   </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-5 py-10 px-10 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-3xl ring-[12px] ring-black/20 relative z-10 group-hover:rotate-180 transition-transform duration-700">
                <div className="text-2xl font-black tracking-[0.5em] text-rose-500 pl-[0.5em] drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]">VS</div>
                <div className="h-px w-10 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <Activity className="h-6 w-6 text-slate-500 animate-pulse" />
              </div>

              {/* Opponent */}
              <div className="space-y-8 text-right relative">
                <div className="flex items-center gap-6 justify-end text-right">
                  <div>
                    <h3 className="font-black text-2xl text-white font-display uppercase italic tracking-tighter">Shadow_Coder</h3>
                    <div className="flex items-center gap-2 justify-end">
                       <p className="text-[10px] text-rose-500 font-black uppercase tracking-[0.2em]">Rating 1910 | Sovereign</p>
                       <Zap className="h-3 w-3 text-rose-500 fill-current" />
                    </div>
                  </div>
                  <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-bl from-rose-600/20 to-transparent border border-rose-500/30 flex items-center justify-center font-black text-3xl text-rose-400 shadow-xl shadow-rose-500/10 group-hover:scale-110 transition-transform duration-500 italic">S</div>
                </div>
                <div className="space-y-4">
                   <div className="h-5 bg-white/[0.03] rounded-full overflow-hidden border border-white/5 p-1 relative shadow-inner">
                     <div
                        className="h-full bg-gradient-to-l from-rose-600 to-orange-500 rounded-full transition-all duration-1000 ease-out ml-auto shadow-[0_0_20px_rgba(244,63,94,0.5)]"
                        style={{ width: `${oppProgress}%` }}
                     />
                     <div className="absolute inset-0 bg-white/5 opacity-50 animate-pulse right-0" style={{ width: `${oppProgress}%` }} />
                   </div>
                   <div className="flex justify-between items-center px-1">
                      <p className="text-lg font-mono-code text-rose-500 font-bold drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">{oppProgress}%</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-right">Execution Phase: High Efficiency</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spells */}
        <div className="space-y-12">
          <div className="flex items-center gap-6">
             <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
             <h2 className="text-3xl font-black tracking-[0.4em] uppercase font-display italic text-white/50">Combat Spells</h2>
             <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SPELLS.map((s) => (
              <div key={s.name} className={`group p-10 rounded-[3rem] bg-[#0c0c16]/80 border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 cursor-pointer shadow-2xl relative overflow-hidden backdrop-blur-xl ${s.aura} hover:-translate-y-4`}>
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-all group-hover:rotate-12 group-hover:scale-150">
                   {s.icon}
                </div>
                <div className={`p-5 rounded-3xl bg-white/5 w-fit mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 bg-gradient-to-br from-white/10 to-transparent border border-white/10 ${s.color}`}>
                   {s.icon}
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-2">Neural Disruptor</p>
                <h3 className={`font-black text-2xl mb-4 font-display uppercase tracking-tighter ${s.color}`}>{s.name}</h3>
                <p className="text-[13px] text-slate-400 leading-relaxed mb-8 font-body font-medium">{s.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-white/5 px-6 py-2 rounded-full border border-white/10 backdrop-blur-3xl group-hover:border-current/40 transition-colors">Cost: {s.cost}</span>
                    <Button size="sm" variant="ghost" className="text-[10px] font-black uppercase tracking-[0.3em] text-white hover:text-cyan-400 p-0 transition-colors">Manifest →</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Battles */}
        <div className="space-y-12 pt-12">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                  <TrendingUp className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tighter font-display uppercase italic text-white">War History</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Verified Combat Logs</p>
                </div>
              </div>
              <Button variant="outline" className="text-[10px] font-black tracking-[0.3em] border-white/10 hover:bg-white/5 uppercase rounded-2xl px-8 h-12 bg-white/5 shadow-xl transition-all hover:scale-105 active:scale-95">Global Archive</Button>
           </div>
          
          <div className="rounded-[3rem] border border-white/10 overflow-hidden bg-[#0c0c16]/80 backdrop-blur-3xl shadow-2xl relative">
            <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/[0.03] border-b border-white/10">
                  <tr>
                    {["Protocol / Problem", "Combatants", "Executor", "Neural Rating Delta", "Duration"].map(h => (
                      <th key={h} className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {RECENT_BATTLES.map((b) => (
                    <tr key={b.id} className="hover:bg-white/[0.04] transition-all duration-500 group">
                      <td className="px-10 py-8">
                         <div className="flex flex-col gap-1">
                            <span className="font-black text-xl text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tighter italic font-display">{b.problem}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-white/5">Complexity: Standard</span>
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                              <span className="text-[9px] text-emerald-500/50 font-black uppercase tracking-[0.2em]">Verified</span>
                            </div>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4 text-sm text-slate-500 font-bold uppercase tracking-tight">
                           <span className="text-white group-hover:text-violet-400 transition-colors">{b.p1}</span>
                           <div className="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-[9px] font-black text-rose-500 italic">VS</div>
                           <span className="text-slate-500 group-hover:text-white transition-colors">{b.p2}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="px-5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] inline-flex items-center gap-3 shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:scale-105 transition-transform duration-500">
                           <Trophy className="h-4 w-4 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> {b.winner}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-3 font-mono-code text-xs text-slate-400 font-bold">
                            <TrendingUp className="h-4 w-4 text-cyan-400 animate-bounce" />
                            <span className="flex items-center gap-2">
                              <span className="text-white/40">{b.p1Elo}</span> 
                              <span className="text-cyan-400">→</span> 
                              <span className="text-cyan-400">{b.p1Elo + 15}</span>
                            </span>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-black font-mono-code">
                           <Clock className="h-4 w-4 text-slate-600" />
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

      <MarketingFooter />
    </div>
  );
};

export default Arena;


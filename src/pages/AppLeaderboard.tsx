import Navbar from '@/components/Navbar';
import { Trophy, Medal, Crown } from 'lucide-react';

const leaderboardData = [
  { rank: 1, username: 'AlgoGod', playerId: 'U-7421', level: 42, elo: 2450, solved: 387 },
  { rank: 2, username: 'BitWizard', playerId: 'U-1092', level: 38, elo: 2310, solved: 352 },
  { rank: 3, username: 'RecursionQueen', playerId: 'U-8832', level: 35, elo: 2180, solved: 319 },
  { rank: 4, username: 'GraphMaster', playerId: 'U-4421', level: 33, elo: 2050, solved: 298 },
  { rank: 5, username: 'DPSlayer', playerId: 'U-9022', level: 30, elo: 1980, solved: 276 },
  { rank: 6, username: 'HashKing', playerId: 'U-6610', level: 28, elo: 1890, solved: 254 },
  { rank: 7, username: 'CodeWarrior', playerId: 'U-9921', level: 7, elo: 1320, solved: 42 },
  { rank: 8, username: 'TreeHugger', playerId: 'U-3321', level: 25, elo: 1780, solved: 231 },
  { rank: 9, username: 'StackOverflow', playerId: 'U-0092', level: 23, elo: 1720, solved: 215 },
  { rank: 10, username: 'AlgoNinja', playerId: 'U-1123', level: 22, elo: 1680, solved: 198 },
];

const rankIcons = [
  <Crown className="w-5 h-5 text-amber-500" />,
  <Medal className="w-5 h-5 text-sky-400" />,
  <Medal className="w-5 h-5 text-rose-400" />,
];

const Leaderboard = () => (
  <div className="min-h-screen bg-background bg-grid-pattern">
    <Navbar />
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="w-8 h-8 text-amber-500" />
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground uppercase tracking-widest">Global Leaderboard</h1>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[leaderboardData[1], leaderboardData[0], leaderboardData[2]].map((p, i) => {
          const order = [2, 1, 3][i];
          const heights = ['h-28', 'h-36', 'h-24'];
          const glows = ['', 'shadow-[0_-5px_20px_rgba(245,158,11,0.2)] bg-amber-500/10 border-amber-500/30', ''];
          return (
            <div key={p.rank} className="flex flex-col items-center">
              <div className="font-mono text-xs font-black bg-white/5 border border-white/10 px-3 py-1 rounded-md text-muted-foreground mb-3">{p.playerId}</div>
              <p className="font-display font-bold text-foreground text-sm uppercase mb-1">{p.username}</p>
              <p className="text-primary font-mono text-xs mb-3">Elo {p.elo}</p>
              <div className={`w-full ${heights[i]} rounded-t-xl bg-card border border-border flex items-end justify-center pb-3 transition-all ${glows[i]}`}>
                <span className="font-display font-black text-foreground text-2xl drop-shadow">#{order}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full list */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-[60px_1fr_80px_80px_80px] gap-2 px-4 py-4 border-b border-border text-muted-foreground font-body text-xs uppercase tracking-widest bg-muted/20">
          <span>Rank</span>
          <span>Player</span>
          <span className="text-right">Level</span>
          <span className="text-right">Elo</span>
          <span className="text-right">Solved</span>
        </div>
        {leaderboardData.map((p) => (
          <div
            key={p.rank}
            className={`grid grid-cols-[60px_1fr_80px_80px_80px] gap-2 px-4 py-4 items-center border-b border-border/50 hover:bg-secondary/30 transition-colors ${
              p.username === 'CodeWarrior' ? 'bg-primary/5 border-l-2 border-l-primary' : ''
            }`}
          >
            <span className="flex items-center gap-1 shrink-0">
              {p.rank <= 3 ? rankIcons[p.rank - 1] : (
                <span className="font-mono text-muted-foreground text-sm font-black">#{p.rank}</span>
              )}
            </span>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] font-black tracking-widest bg-white/5 border border-white/10 px-2 py-1 rounded text-muted-foreground">{p.playerId}</span>
              <span className="font-body font-black text-foreground text-sm uppercase">{p.username}</span>
              {p.username === 'CodeWarrior' && (
                <span className="text-[10px] font-black uppercase text-primary bg-primary/20 border border-primary/30 px-3 py-1 rounded-full ml-auto">You</span>
              )}
            </div>
            <span className="text-right font-mono text-foreground text-sm font-black">{p.level}</span>
            <span className="text-right font-mono text-primary text-sm font-black">{p.elo}</span>
            <span className="text-right font-mono text-muted-foreground text-sm">{p.solved}</span>
          </div>
        ))}
      </div>
    </main>
  </div>
);

export default Leaderboard;

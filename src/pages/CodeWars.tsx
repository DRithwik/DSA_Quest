import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import { updateXP } from '@/store/authSlice';
import {
  startSearching, matchFound, startBattle, updateMyProgress,
  updateOpponentProgress, tickTimer, endBattle, resetBattle, cancelSearch,
} from '@/store/battleSlice';
import Navbar from '@/components/Navbar';
import { Swords, Loader2, Zap, Clock, Trophy, XCircle, RotateCcw } from 'lucide-react';

const mockOpponent = {
  id: 'opp1',
  username: 'AlgoNinja',
  avatar: '🥷',
  level: 9,
  elo: 1450,
};

const CodeWars = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const battle = useSelector((state: RootState) => state.battle);
  const user = useSelector((state: RootState) => state.auth.user);
  const [searchDots, setSearchDots] = useState('');

  // Searching animation dots
  useEffect(() => {
    if (battle.status !== 'searching') return;
    const iv = setInterval(() => setSearchDots(d => (d.length >= 3 ? '' : d + '.')), 400);
    return () => clearInterval(iv);
  }, [battle.status]);

  // Mock matchmaking: find opponent after 3s
  useEffect(() => {
    if (battle.status !== 'searching') return;
    const t = setTimeout(() => {
      dispatch(matchFound({ opponent: mockOpponent, problemId: 'a2' }));
    }, 3000);
    return () => clearTimeout(t);
  }, [battle.status, dispatch]);

  // Auto-start battle 2s after match
  useEffect(() => {
    if (battle.status !== 'matched') return;
    const t = setTimeout(() => dispatch(startBattle()), 2000);
    return () => clearTimeout(t);
  }, [battle.status, dispatch]);

  // Timer countdown
  useEffect(() => {
    if (battle.status !== 'inProgress') return;
    const iv = setInterval(() => dispatch(tickTimer()), 1000);
    return () => clearInterval(iv);
  }, [battle.status, dispatch]);

  // Mock opponent progress
  useEffect(() => {
    if (battle.status !== 'inProgress') return;
    const iv = setInterval(() => {
      dispatch(updateOpponentProgress(battle.opponentProgress + Math.random() * 8));
    }, 2500);
    return () => clearInterval(iv);
  }, [battle.status, battle.opponentProgress, dispatch]);

  // Check for battle end
  useEffect(() => {
    if (battle.status !== 'inProgress') return;
    if (battle.myProgress >= 100) {
      dispatch(endBattle({ result: 'win', xpGained: 200, eloChange: 25 }));
      dispatch(updateXP(200));
    } else if (battle.opponentProgress >= 100) {
      dispatch(endBattle({ result: 'lose', xpGained: 30, eloChange: -15 }));
      dispatch(updateXP(30));
    } else if (battle.timeLeft <= 0) {
      const result = battle.myProgress > battle.opponentProgress ? 'win' : battle.myProgress < battle.opponentProgress ? 'lose' : 'draw';
      const xp = result === 'win' ? 150 : result === 'draw' ? 50 : 20;
      const elo = result === 'win' ? 15 : result === 'draw' ? 0 : -10;
      dispatch(endBattle({ result, xpGained: xp, eloChange: elo }));
      dispatch(updateXP(xp));
    }
  }, [battle, dispatch]);

  const handleSolveStep = useCallback(() => {
    dispatch(updateMyProgress(battle.myProgress + 20));
  }, [battle.myProgress, dispatch]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* IDLE */}
        {battle.status === 'idle' && (
          <div className="text-center space-y-8">
            <Swords className="w-20 h-20 text-primary mx-auto animate-float" />
            <h1 className="text-3xl font-display font-bold text-foreground">Code Wars</h1>
            <p className="text-muted-foreground font-body text-lg max-w-md mx-auto">
              Challenge another coder in real-time. Solve the problem faster to win XP and climb the ranks.
            </p>
            <button
              onClick={() => dispatch(startSearching())}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold px-10 py-4 rounded-xl glow-primary hover:brightness-110 transition-all tracking-wider uppercase"
            >
              <Swords className="w-5 h-5" /> Find Opponent
            </button>
          </div>
        )}

        {/* SEARCHING */}
        {battle.status === 'searching' && (
          <div className="text-center space-y-8">
            <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
            <h2 className="text-2xl font-display font-bold text-foreground">Searching for opponent{searchDots}</h2>
            <p className="text-muted-foreground font-body">Matching you with a worthy challenger</p>
            <div className="flex justify-center gap-4">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse-glow" />
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse-glow" style={{ animationDelay: '0.3s' }} />
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse-glow" style={{ animationDelay: '0.6s' }} />
            </div>
            <button
              onClick={() => dispatch(cancelSearch())}
              className="text-muted-foreground hover:text-foreground font-body text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* MATCHED */}
        {battle.status === 'matched' && battle.opponent && (
          <div className="text-center space-y-8">
            <h2 className="text-2xl font-display font-bold text-primary text-glow-primary">OPPONENT FOUND!</h2>
            <div className="flex items-center justify-center gap-12">
              <div className="text-center">
                <span className="text-5xl block mb-2">{user?.avatar}</span>
                <p className="font-display font-bold text-foreground">{user?.username}</p>
                <p className="text-muted-foreground font-body text-sm">Lv.{user?.level}</p>
              </div>
              <Swords className="w-10 h-10 text-accent animate-pulse-glow" />
              <div className="text-center">
                <span className="text-5xl block mb-2">{battle.opponent.avatar}</span>
                <p className="font-display font-bold text-foreground">{battle.opponent.username}</p>
                <p className="text-muted-foreground font-body text-sm">Lv.{battle.opponent.level}</p>
              </div>
            </div>
            <p className="text-muted-foreground font-body animate-pulse-glow">Battle starting...</p>
          </div>
        )}

        {/* IN PROGRESS */}
        {battle.status === 'inProgress' && (
          <div className="space-y-8">
            {/* Timer */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-card border border-border rounded-xl px-6 py-3">
                <Clock className="w-5 h-5 text-medium-amber" />
                <span className={`font-mono text-2xl font-bold ${battle.timeLeft <= 60 ? 'text-destructive' : 'text-foreground'}`}>
                  {formatTime(battle.timeLeft)}
                </span>
              </div>
            </div>

            {/* Progress bars */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              {/* My progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{user?.avatar}</span>
                    <span className="font-display font-bold text-foreground text-sm">{user?.username}</span>
                    <span className="text-primary font-body text-xs">(You)</span>
                  </div>
                  <span className="font-mono text-sm text-primary">{Math.round(battle.myProgress)}%</span>
                </div>
                <div className="h-4 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-500 glow-primary"
                    style={{ width: `${battle.myProgress}%` }}
                  />
                </div>
              </div>

              {/* Opponent progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{battle.opponent?.avatar}</span>
                    <span className="font-display font-bold text-foreground text-sm">{battle.opponent?.username}</span>
                  </div>
                  <span className="font-mono text-sm text-destructive">{Math.round(battle.opponentProgress)}%</span>
                </div>
                <div className="h-4 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-destructive/80 to-destructive rounded-full transition-all duration-500"
                    style={{ width: `${battle.opponentProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Solve button (mock) */}
            <div className="text-center">
              <button
                onClick={handleSolveStep}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold px-8 py-3 rounded-xl glow-primary hover:brightness-110 transition-all tracking-wider uppercase text-sm"
              >
                <Zap className="w-4 h-4" /> Submit Test Case (+20%)
              </button>
              <p className="text-muted-foreground font-body text-xs mt-2">In production, this progresses as you pass test cases</p>
            </div>
          </div>
        )}

        {/* FINISHED */}
        {battle.status === 'finished' && (
          <div className="text-center space-y-8">
            {battle.result === 'win' && (
              <>
                <Trophy className="w-20 h-20 text-gold mx-auto animate-float" />
                <h2 className="text-4xl font-display font-bold text-gold text-glow-primary">VICTORY!</h2>
              </>
            )}
            {battle.result === 'lose' && (
              <>
                <XCircle className="w-20 h-20 text-destructive mx-auto" />
                <h2 className="text-4xl font-display font-bold text-destructive">DEFEAT</h2>
              </>
            )}
            {battle.result === 'draw' && (
              <h2 className="text-4xl font-display font-bold text-medium-amber">DRAW</h2>
            )}

            <div className="flex justify-center gap-8">
              <div className="bg-card border border-border rounded-xl p-6 min-w-[140px]">
                <p className="text-muted-foreground font-body text-sm uppercase tracking-wider mb-1">XP Gained</p>
                <p className="text-primary font-display font-bold text-2xl">+{battle.xpGained}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 min-w-[140px]">
                <p className="text-muted-foreground font-body text-sm uppercase tracking-wider mb-1">Elo</p>
                <p className={`font-display font-bold text-2xl ${battle.eloChange >= 0 ? 'text-easy-green' : 'text-destructive'}`}>
                  {battle.eloChange >= 0 ? '+' : ''}{battle.eloChange}
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => dispatch(resetBattle())}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold px-8 py-3 rounded-xl glow-primary hover:brightness-110 transition-all tracking-wider uppercase text-sm"
              >
                <RotateCcw className="w-4 h-4" /> Play Again
              </button>
              <button
                onClick={() => { dispatch(resetBattle()); navigate('/dashboard'); }}
                className="inline-flex items-center gap-2 bg-secondary text-foreground font-display font-bold px-8 py-3 rounded-xl hover:bg-muted transition-all tracking-wider uppercase text-sm border border-border"
              >
                Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CodeWars;

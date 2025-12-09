import { useEffect, useState } from 'react';
import { Play, Trophy, Swords, Clock, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Battle {
  id: string;
  status: string;
  player1_id: string;
  player2_id?: string;
  player1_elo?: number;
  player2_elo?: number;
  difficulty: string;
  time_limit_seconds: number;
  started_at?: string;
  created_at: string;
}

export default function CodeBattleArena() {
  const { profile } = useAuth();
  const [battles, setBattles] = useState<Battle[]>([]);
  const [activeBattle, setActiveBattle] = useState<Battle | null>(null);
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [loading, setLoading] = useState(true);
  const [matchmaking, setMatchmaking] = useState(false);

  useEffect(() => {
    loadBattles();
  }, [profile]);

  const loadBattles = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('code_battles')
      .select('*')
      .in('status', ['waiting', 'in_progress'])
      .order('created_at', { ascending: false });

    if (data && !error) {
      setBattles(data);
    }
    setLoading(false);
  };

  const createBattle = async () => {
    if (!profile) return;
    setMatchmaking(true);

    try {
      const { data, error } = await supabase
        .from('code_battles')
        .insert({
          status: 'waiting',
          difficulty,
          player1_id: profile.id,
          player1_elo: profile.total_xp / 10,
          time_limit_seconds: 900,
        })
        .select()
        .single();

      if (data && !error) {
        setActiveBattle(data);
        setBattles([data, ...battles]);
      }
    } finally {
      setMatchmaking(false);
    }
  };

  const joinBattle = async (battleId: string) => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('code_battles')
        .update({
          player2_id: profile.id,
          player2_elo: profile.total_xp / 10,
          status: 'in_progress',
          started_at: new Date().toISOString(),
        })
        .eq('id', battleId)
        .select()
        .single();

      if (data && !error) {
        setActiveBattle(data);
      }
    } catch (err) {
      console.error('Error joining battle:', err);
    }
  };

  if (activeBattle && activeBattle.status === 'in_progress') {
    return <BattleInProgress battle={activeBattle} onBack={() => setActiveBattle(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center">
            <Swords className="mr-4 text-amber-400" />
            Code Battle Arena
          </h1>
          <p className="text-gray-400">
            Challenge other players in real-time competitive programming battles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl p-6 border-2 border-slate-700 sticky top-8">
              <h2 className="text-2xl font-bold text-white mb-4">Create Battle</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-amber-500"
                >
                  <option value="easy">Easy (3-5 min)</option>
                  <option value="medium">Medium (5-10 min)</option>
                  <option value="hard">Hard (10-15 min)</option>
                </select>
              </div>

              <button
                onClick={createBattle}
                disabled={matchmaking}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                <Zap className="mr-2" size={20} />
                {matchmaking ? 'Matchmaking...' : 'Create Battle'}
              </button>

              <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <p className="text-sm text-gray-400 mb-2">Quick Stats</p>
                <div className="space-y-1">
                  <p className="text-white">
                    <span className="text-gray-400">Rating:</span> {Math.round(profile?.total_xp || 0 / 10)}
                  </p>
                  <p className="text-white">
                    <span className="text-gray-400">Level:</span> {profile?.current_level}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-xl p-6 border-2 border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">Available Battles</h2>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-2"></div>
                  <p className="text-gray-400">Loading battles...</p>
                </div>
              ) : battles.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No battles available. Be the first to create one!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {battles.map((battle) => (
                    <BattleCard
                      key={battle.id}
                      battle={battle}
                      isCreator={battle.player1_id === profile?.id}
                      onJoin={() => joinBattle(battle.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface BattleCardProps {
  battle: Battle;
  isCreator: boolean;
  onJoin: () => void;
}

function BattleCard({ battle, isCreator, onJoin }: BattleCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'from-green-500 to-emerald-600';
      case 'medium':
        return 'from-yellow-500 to-orange-600';
      case 'hard':
        return 'from-red-500 to-rose-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-amber-500 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`bg-gradient-to-br ${getDifficultyColor(battle.difficulty)} w-12 h-12 rounded-lg flex items-center justify-center`}>
            <Swords className="text-white" size={24} />
          </div>
          <div>
            <p className="font-semibold text-white">
              {battle.difficulty.toUpperCase()} Battle
            </p>
            <p className="text-sm text-gray-400">
              {battle.status === 'waiting' ? 'Waiting for opponent...' : 'In Progress'}
            </p>
          </div>
        </div>
        <span className={`text-xs font-bold uppercase px-3 py-1 rounded ${
          battle.status === 'waiting'
            ? 'bg-amber-500/20 text-amber-400'
            : 'bg-green-500/20 text-green-400'
        }`}>
          {battle.status}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm mb-3">
        <span className="text-gray-400 flex items-center">
          <Clock size={16} className="mr-1" />
          15 minutes
        </span>
        <span className="text-gray-400">
          Rating: {battle.player1_elo}
        </span>
      </div>

      {!isCreator && battle.status === 'waiting' && (
        <button
          onClick={onJoin}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Join Battle
        </button>
      )}
      {isCreator && (
        <div className="text-sm text-gray-400">Your battle • Waiting for opponent</div>
      )}
    </div>
  );
}

interface BattleInProgressProps {
  battle: Battle;
  onBack: () => void;
}

function BattleInProgress({ battle, onBack }: BattleInProgressProps) {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(900);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Swords className="mr-3 text-amber-400" />
            Live Battle
          </h1>
          <div className="flex items-center gap-4">
            <div className={`text-2xl font-bold ${timeRemaining < 60 ? 'text-red-400' : 'text-amber-400'}`}>
              {formatTime(timeRemaining)}
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Exit Battle
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-xl p-6 border-2 border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Problem</h2>
            <div className="bg-slate-900 rounded-lg p-4 text-gray-300 mb-4">
              <p className="mb-4">Given an array of integers, find the two numbers that add up to a target.</p>
              <p className="text-sm text-gray-500">Sample Input: [2, 7, 11, 15], target = 9</p>
              <p className="text-sm text-gray-500">Sample Output: [0, 1]</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">
                <span className="font-semibold">Time Complexity:</span> O(n)
              </p>
              <p className="text-sm text-gray-400">
                <span className="font-semibold">Space Complexity:</span> O(n)
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border-2 border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Your Solution</h2>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 bg-slate-900 text-gray-100 font-mono text-sm p-4 rounded-lg border border-slate-600 focus:outline-none focus:border-amber-500 resize-none"
                spellCheck={false}
                placeholder="// Write your solution here"
              />
              <button
                onClick={() => setOutput('Running tests...')}
                className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-2 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all flex items-center justify-center"
              >
                <Play size={18} className="mr-2" />
                Submit Solution
              </button>
            </div>

            {output && (
              <div className="bg-slate-800 rounded-xl p-6 border-2 border-slate-700">
                <h3 className="text-lg font-bold text-white mb-3">Results</h3>
                <div className="bg-slate-900 rounded-lg p-4 text-gray-300 text-sm">
                  {output}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

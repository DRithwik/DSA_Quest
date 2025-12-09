import { useEffect, useState } from 'react';
import { Crown, Lock, Skull, Timer, Award, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface BossFight {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  unlock_level: number;
  problems: any[];
  time_limit_minutes: number;
  xp_reward: number;
  special_rewards: any;
  created_at: string;
}

interface BossAttempt {
  id: string;
  boss_id: string;
  completed: boolean;
  problems_solved: number;
  total_problems: number;
  completed_at?: string;
}

export default function BossesView() {
  const { profile } = useAuth();
  const [bosses, setBosses] = useState<BossFight[]>([]);
  const [attempts, setAttempts] = useState<Map<string, BossAttempt>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBosses();
    loadAttempts();
  }, [profile]);

  const loadBosses = async () => {
    const { data, error } = await supabase
      .from('boss_fights')
      .select('*')
      .order('unlock_level');

    if (data && !error) {
      setBosses(data);
    }
    setLoading(false);
  };

  const loadAttempts = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('boss_attempts')
      .select('*')
      .eq('user_id', profile.id)
      .eq('completed', true);

    if (data && !error) {
      const attemptsMap = new Map<string, BossAttempt>();
      data.forEach((attempt) => {
        attemptsMap.set(attempt.boss_id, attempt);
      });
      setAttempts(attemptsMap);
    }
  };

  const isUnlocked = (boss: BossFight) => {
    return profile && profile.current_level >= boss.unlock_level;
  };

  const isDefeated = (bossId: string) => {
    return attempts.get(bossId)?.completed || false;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'from-green-500 to-emerald-600';
      case 'medium':
        return 'from-yellow-500 to-orange-600';
      case 'hard':
        return 'from-red-500 to-rose-600';
      case 'legendary':
        return 'from-purple-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center">
            <Crown className="mr-4 text-amber-400" />
            Boss Challenges
          </h1>
          <p className="text-gray-400">
            Face legendary algorithmic challenges. High stakes, high rewards. Do you have what it takes?
          </p>
        </div>

        {bosses.length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-12 border-2 border-slate-700 text-center">
            <Skull className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No boss challenges available yet</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon for epic battles!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bosses.map((boss) => (
              <BossCard
                key={boss.id}
                boss={boss}
                unlocked={isUnlocked(boss)}
                defeated={isDefeated(boss.id)}
                currentLevel={profile?.current_level || 1}
                getDifficultyColor={getDifficultyColor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface BossCardProps {
  boss: BossFight;
  unlocked: boolean;
  defeated: boolean;
  currentLevel: number;
  getDifficultyColor: (difficulty: string) => string;
}

function BossCard({ boss, unlocked, defeated, currentLevel, getDifficultyColor }: BossCardProps) {
  return (
    <div
      className={`bg-slate-800 rounded-xl p-6 border-2 transition-all duration-300 ${
        defeated
          ? 'border-green-500 hover:shadow-lg hover:shadow-green-500/20'
          : unlocked
          ? 'border-slate-700 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20 cursor-pointer transform hover:scale-105'
          : 'border-slate-700 opacity-60'
      }`}
    >
      <div className="relative mb-4">
        <div
          className={`w-full h-32 rounded-lg bg-gradient-to-br ${getDifficultyColor(
            boss.difficulty
          )} flex items-center justify-center relative overflow-hidden`}
        >
          {defeated ? (
            <CheckCircle className="w-16 h-16 text-white z-10" />
          ) : unlocked ? (
            <Skull className="w-16 h-16 text-white z-10" />
          ) : (
            <Lock className="w-16 h-16 text-white z-10" />
          )}
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>
        {defeated && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            DEFEATED
          </div>
        )}
        {!unlocked && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
            <Lock size={12} className="mr-1" />
            LVL {boss.unlock_level}
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{boss.name}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-3">{boss.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 flex items-center">
            <Timer size={16} className="mr-1" />
            Time Limit
          </span>
          <span className="text-white font-semibold">{boss.time_limit_minutes} min</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 flex items-center">
            <Award size={16} className="mr-1" />
            XP Reward
          </span>
          <span className="text-amber-400 font-semibold">+{boss.xp_reward} XP</span>
        </div>
      </div>

      {!unlocked && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-center">
          <p className="text-red-400 text-sm font-semibold">
            Reach Level {boss.unlock_level} to unlock
          </p>
          <p className="text-red-400/70 text-xs mt-1">
            {boss.unlock_level - currentLevel} levels to go
          </p>
        </div>
      )}

      {unlocked && !defeated && (
        <button
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          Challenge Boss
        </button>
      )}

      {defeated && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 text-center">
          <p className="text-green-400 text-sm font-semibold flex items-center justify-center">
            <CheckCircle size={16} className="mr-1" />
            Victory Achieved!
          </p>
        </div>
      )}

      {boss.special_rewards && Object.keys(boss.special_rewards).length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-gray-500 mb-2">Special Rewards:</p>
          <div className="flex flex-wrap gap-1">
            {Object.entries(boss.special_rewards).map(([key, value]) => (
              <span key={key} className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">
                {String(value)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

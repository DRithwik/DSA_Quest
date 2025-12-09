import { useEffect, useState } from 'react';
import { Sword, Trophy, Target, Zap, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Quest, Achievement } from '../../lib/supabase';

export default function Dashboard() {
  const { profile } = useAuth();
  const [recentQuests, setRecentQuests] = useState<Quest[]>([]);
  const [stats, setStats] = useState({
    questsCompleted: 0,
    achievementsUnlocked: 0,
    currentStreak: 0,
    bossesDefeated: 0,
  });

  useEffect(() => {
    if (profile) {
      loadDashboardData();
    }
  }, [profile]);

  const loadDashboardData = async () => {
    if (!profile) return;

    const { data: leaderboard } = await supabase
      .from('leaderboards')
      .select('*')
      .eq('user_id', profile.id)
      .maybeSingle();

    if (leaderboard) {
      setStats({
        questsCompleted: leaderboard.quests_completed,
        achievementsUnlocked: leaderboard.achievements_unlocked,
        currentStreak: leaderboard.current_streak,
        bossesDefeated: leaderboard.bosses_defeated,
      });
    }

    const { data: quests } = await supabase
      .from('quests')
      .select('*')
      .order('order_index')
      .limit(4);

    if (quests) {
      setRecentQuests(quests);
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {profile.display_name}!
          </h1>
          <p className="text-xl text-amber-400 font-semibold">{profile.title}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Target className="w-8 h-8" />}
            label="Quests Completed"
            value={stats.questsCompleted}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={<Award className="w-8 h-8" />}
            label="Achievements"
            value={stats.achievementsUnlocked}
            color="from-amber-500 to-orange-500"
          />
          <StatCard
            icon={<Zap className="w-8 h-8" />}
            label="Day Streak"
            value={stats.currentStreak}
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            icon={<Trophy className="w-8 h-8" />}
            label="Bosses Defeated"
            value={stats.bossesDefeated}
            color="from-red-500 to-pink-500"
          />
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 mb-8 border-2 border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="mr-3 text-amber-400" />
            Your Progress
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Level {profile.current_level}</span>
                <span className="text-amber-400 font-semibold">
                  {profile.current_xp} / {profile.xp_to_next_level} XP
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{
                    width: `${Math.min((profile.current_xp / profile.xp_to_next_level) * 100, 100)}%`,
                  }}
                >
                  {profile.current_xp > 0 && (
                    <span className="text-xs font-bold text-white">
                      {Math.round((profile.current_xp / profile.xp_to_next_level) * 100)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              {profile.xp_to_next_level - profile.current_xp} XP needed to reach Level{' '}
              {profile.current_level + 1}
            </p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border-2 border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Sword className="mr-3 text-amber-400" />
            Available Quests
          </h2>
          {recentQuests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No quests available yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border-2 border-slate-700 hover:border-amber-500/50 transition-all duration-200">
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${color} mb-4`}>
        {icon}
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

interface QuestCardProps {
  quest: Quest;
}

function QuestCard({ quest }: QuestCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-400';
      case 'intermediate':
        return 'text-yellow-400';
      case 'advanced':
        return 'text-orange-400';
      case 'expert':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-all duration-200 cursor-pointer border border-slate-600 hover:border-amber-500">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-white">{quest.title}</h3>
        <span className={`text-xs font-bold uppercase ${getDifficultyColor(quest.difficulty)}`}>
          {quest.difficulty}
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{quest.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 bg-slate-800 px-2 py-1 rounded">
          {quest.category}
        </span>
        <span className="text-amber-400 font-semibold text-sm">+{quest.xp_reward} XP</span>
      </div>
    </div>
  );
}

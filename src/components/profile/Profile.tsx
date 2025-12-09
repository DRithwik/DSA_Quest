import { useEffect, useState } from 'react';
import { User, Award, Target, Calendar, Crown, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Achievement } from '../../lib/supabase';

export default function Profile() {
  const { profile } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({
    questsCompleted: 0,
    bossesDefeated: 0,
    achievementsUnlocked: 0,
    currentStreak: 0,
    longestStreak: 0,
  });

  useEffect(() => {
    if (profile) {
      loadProfileData();
    }
  }, [profile]);

  const loadProfileData = async () => {
    if (!profile) return;

    const { data: leaderboard } = await supabase
      .from('leaderboards')
      .select('*')
      .eq('user_id', profile.id)
      .maybeSingle();

    if (leaderboard) {
      setStats({
        questsCompleted: leaderboard.quests_completed,
        bossesDefeated: leaderboard.bosses_defeated,
        achievementsUnlocked: leaderboard.achievements_unlocked,
        currentStreak: leaderboard.current_streak,
        longestStreak: leaderboard.longest_streak,
      });
    }

    const { data: achievementsData } = await supabase
      .from('achievements')
      .select('*')
      .order('rarity');

    if (achievementsData) {
      setAchievements(achievementsData);
    }

    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', profile.id);

    if (userAchievements) {
      setUnlockedAchievements(new Set(userAchievements.map(ua => ua.achievement_id)));
    }
  };

  if (!profile) return null;

  const levelProgress = (profile.current_xp / profile.xp_to_next_level) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border-2 border-slate-700">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
                  <User className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{profile.display_name}</h2>
                <p className="text-gray-400 mb-2">@{profile.username}</p>
                <p className="text-amber-400 font-semibold mb-4">{profile.title}</p>

                <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
                <div className="flex justify-between w-full text-sm">
                  <span className="text-gray-400">Level {profile.current_level}</span>
                  <span className="text-amber-400 font-semibold">
                    {profile.current_xp}/{profile.xp_to_next_level} XP
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border-2 border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <TrendingUp className="mr-2 text-amber-400" />
                Statistics
              </h3>
              <div className="space-y-4">
                <StatRow icon={<Target />} label="Quests Completed" value={stats.questsCompleted} />
                <StatRow icon={<Crown />} label="Bosses Defeated" value={stats.bossesDefeated} />
                <StatRow icon={<Award />} label="Achievements" value={stats.achievementsUnlocked} />
                <StatRow icon={<Calendar />} label="Current Streak" value={`${stats.currentStreak} days`} />
                <StatRow icon={<Calendar />} label="Longest Streak" value={`${stats.longestStreak} days`} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-xl p-6 border-2 border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Award className="mr-3 text-amber-400" />
                Achievements
              </h3>

              {achievements.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No achievements available yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => {
                    const isUnlocked = unlockedAchievements.has(achievement.id);
                    return (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        unlocked={isUnlocked}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function StatRow({ icon, label, value }: StatRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center text-gray-400">
        <span className="mr-2">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}

interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
}

function AchievementCard({ achievement, unlocked }: AchievementCardProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-500 to-gray-600';
      case 'rare':
        return 'from-blue-500 to-blue-600';
      case 'epic':
        return 'from-purple-500 to-purple-600';
      case 'legendary':
        return 'from-amber-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div
      className={`rounded-lg p-4 border-2 transition-all duration-200 ${
        unlocked
          ? 'bg-slate-700 border-amber-500 hover:shadow-lg hover:shadow-amber-500/20'
          : 'bg-slate-900 border-slate-700 opacity-50'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getRarityColor(
            achievement.rarity
          )} flex items-center justify-center flex-shrink-0`}
        >
          <span className="text-2xl">{achievement.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold mb-1 flex items-center">
            {achievement.name}
            {!unlocked && <span className="ml-2 text-gray-500 text-xs">🔒</span>}
          </h4>
          <p className="text-gray-400 text-sm mb-2">{achievement.description}</p>
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                achievement.rarity === 'legendary'
                  ? 'bg-amber-500/20 text-amber-400'
                  : achievement.rarity === 'epic'
                  ? 'bg-purple-500/20 text-purple-400'
                  : achievement.rarity === 'rare'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-gray-500/20 text-gray-400'
              }`}
            >
              {achievement.rarity}
            </span>
            {unlocked && achievement.xp_reward > 0 && (
              <span className="text-xs text-amber-400">+{achievement.xp_reward} XP</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

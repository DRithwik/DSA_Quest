import { useEffect, useState } from 'react';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';
import { supabase, LeaderboardEntry } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function Leaderboard() {
  const { profile } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'xp' | 'quests' | 'bosses'>('xp');

  useEffect(() => {
    loadLeaderboard();
  }, [sortBy]);

  const loadLeaderboard = async () => {
    setLoading(true);

    const sortColumn = sortBy === 'xp' ? 'total_xp' : sortBy === 'quests' ? 'quests_completed' : 'bosses_defeated';

    const { data, error } = await supabase
      .from('leaderboards')
      .select(`
        *,
        user_profiles (
          username,
          display_name,
          current_level,
          title
        )
      `)
      .order(sortColumn, { ascending: false })
      .limit(100);

    if (data && !error) {
      setLeaderboard(data as any);
    }

    setLoading(false);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-gray-500 font-bold">#{rank}</span>;
    }
  };

  const userRank = leaderboard.findIndex(entry => entry.user_id === profile?.id) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center">
            <Trophy className="mr-4 text-amber-400" />
            Global Leaderboard
          </h1>
          <p className="text-gray-400">Compete with the best DSA warriors from around the world</p>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <SortButton
            label="Total XP"
            icon={<TrendingUp size={18} />}
            active={sortBy === 'xp'}
            onClick={() => setSortBy('xp')}
          />
          <SortButton
            label="Quests Completed"
            icon={<Trophy size={18} />}
            active={sortBy === 'quests'}
            onClick={() => setSortBy('quests')}
          />
          <SortButton
            label="Bosses Defeated"
            icon={<Crown size={18} />}
            active={sortBy === 'bosses'}
            onClick={() => setSortBy('bosses')}
          />
        </div>

        {profile && userRank > 0 && userRank > 10 && (
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500 rounded-xl p-4 mb-6">
            <p className="text-white font-semibold">
              Your Rank: <span className="text-amber-400">#{userRank}</span>
            </p>
          </div>
        )}

        <div className="bg-slate-800 rounded-xl border-2 border-slate-700 overflow-hidden">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No entries yet. Be the first!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900 border-b-2 border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Total XP
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Quests
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Bosses
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Streak
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {leaderboard.map((entry, index) => {
                    const isCurrentUser = entry.user_id === profile?.id;
                    return (
                      <tr
                        key={entry.id}
                        className={`transition-colors ${
                          isCurrentUser
                            ? 'bg-amber-500/10 border-l-4 border-amber-500'
                            : 'hover:bg-slate-700/50'
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">{getRankIcon(index + 1)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className={`font-semibold ${isCurrentUser ? 'text-amber-400' : 'text-white'}`}>
                              {(entry.user_profiles as any)?.display_name || 'Unknown'}
                            </p>
                            <p className="text-sm text-gray-500">
                              @{(entry.user_profiles as any)?.username || 'unknown'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-amber-400 font-semibold">
                            {(entry.user_profiles as any)?.current_level || 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-white font-semibold">{entry.total_xp.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-300">{entry.quests_completed}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-300">{entry.bosses_defeated}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-green-400 font-semibold">{entry.current_streak} days</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface SortButtonProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function SortButton({ label, icon, active, onClick }: SortButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        active
          ? 'bg-amber-500 text-white shadow-lg'
          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

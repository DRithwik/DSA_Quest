import { Sword, Trophy, Map, Crown, User, LogOut, Swords, Shield, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onAuthClick: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function Header({ onAuthClick, currentView, onViewChange }: HeaderProps) {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b-4 border-amber-500 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <Sword className="text-amber-400 w-10 h-10" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                DSA-QUEST
              </h1>
            </div>

            {user && (
              <nav className="hidden md:flex space-x-1">
                <NavButton
                  icon={<Map size={20} />}
                  label="Quests"
                  active={currentView === 'quests'}
                  onClick={() => onViewChange('quests')}
                />
                <NavButton
                  icon={<Crown size={20} />}
                  label="Bosses"
                  active={currentView === 'bosses'}
                  onClick={() => onViewChange('bosses')}
                />
                <NavButton
                  icon={<Swords size={20} />}
                  label="Battles"
                  active={currentView === 'battles'}
                  onClick={() => onViewChange('battles')}
                />
                <NavButton
                  icon={<Shield size={20} />}
                  label="Clans"
                  active={currentView === 'clans'}
                  onClick={() => onViewChange('clans')}
                />
                <NavButton
                  icon={<Trophy size={20} />}
                  label="Leaderboard"
                  active={currentView === 'leaderboard'}
                  onClick={() => onViewChange('leaderboard')}
                />
                <NavButton
                  icon={<User size={20} />}
                  label="Profile"
                  active={currentView === 'profile'}
                  onClick={() => onViewChange('profile')}
                />
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user && profile ? (
              <>
                <div className="hidden sm:flex items-center space-x-4 bg-slate-800/50 px-4 py-2 rounded-lg border border-amber-500/30">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{profile.display_name}</p>
                    <p className="text-xs text-amber-400">Level {profile.current_level}</p>
                  </div>
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(profile.current_xp / profile.xp_to_next_level) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-400">
                    {profile.current_xp}/{profile.xp_to_next_level} XP
                  </div>
                </div>
                <button
                  onClick={() => onViewChange('character')}
                  className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
                >
                  <User size={18} />
                  <span>Character</span>
                </button>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Start Quest
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, active, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        active
          ? 'bg-amber-500 text-white shadow-lg'
          : 'text-gray-300 hover:bg-slate-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import QuestsView from './components/quests/QuestsView';
import BossesView from './components/bosses/BossesView';
import Leaderboard from './components/leaderboard/Leaderboard';
import Profile from './components/profile/Profile';
import AuthModal from './components/auth/AuthModal';
import CodeBattleArena from './components/battles/CodeBattleArena';
import CharacterCustomization from './components/character/CharacterCustomization';
import ClansView from './components/clans/ClansView';
import StudyGroups from './components/study/StudyGroups';
import SkillTrees from './components/skills/SkillTrees';

function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading DSA-QUEST...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <Header
            onAuthClick={() => setAuthModalOpen(true)}
            currentView={currentView}
            onViewChange={setCurrentView}
          />
          <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-6">
                DSA-QUEST
              </h1>
              <p className="text-2xl text-gray-300 mb-4">
                The Next Generation Learning Engine
              </p>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Master Data Structures and Algorithms through gamified quests, epic boss battles,
                and competitive multiplayer challenges. Level up your coding skills while having fun!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <FeatureCard
                  icon="⚔️"
                  title="Epic Quests"
                  description="Solve algorithmic challenges wrapped in engaging narratives"
                />
                <FeatureCard
                  icon="👑"
                  title="Boss Battles"
                  description="Test your skills against legendary programming challenges"
                />
                <FeatureCard
                  icon="🏆"
                  title="Compete & Climb"
                  description="Climb the leaderboard and prove your mastery"
                />
              </div>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xl font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-2xl"
              >
                Begin Your Quest
              </button>
            </div>
          </div>
        </div>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header
          onAuthClick={() => setAuthModalOpen(true)}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'quests' && <QuestsView />}
        {currentView === 'bosses' && <BossesView />}
        {currentView === 'battles' && <CodeBattleArena />}
        {currentView === 'character' && <CharacterCustomization />}
        {currentView === 'skills' && <SkillTrees />}
        {currentView === 'study' && <StudyGroups />}
        {currentView === 'clans' && <ClansView />}
        {currentView === 'leaderboard' && <Leaderboard />}
        {currentView === 'profile' && <Profile />}
      </div>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border-2 border-slate-700 hover:border-amber-500 transition-all duration-200">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

export default App;

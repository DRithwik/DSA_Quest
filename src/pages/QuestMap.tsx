import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import { setActiveQuest, Difficulty } from '@/store/questSlice';
import { Lock, CheckCircle2, Swords } from 'lucide-react';
import Navbar from '@/components/Navbar';

const difficultyConfig: Record<Difficulty, { bg: string; text: string; border: string }> = {
  Easy: { bg: 'bg-easy-green/10', text: 'text-easy-green', border: 'border-easy-green/30' },
  Medium: { bg: 'bg-medium-amber/10', text: 'text-medium-amber', border: 'border-medium-amber/30' },
  Hard: { bg: 'bg-hard-red/10', text: 'text-hard-red', border: 'border-hard-red/30' },
  Boss: { bg: 'bg-accent/10', text: 'text-accent', border: 'border-accent/30' },
};

const realmColors: Record<string, string> = {
  primary: 'border-primary/40 hover:border-primary/70',
  'cyber-blue': 'border-cyber-blue/40 hover:border-cyber-blue/70',
  accent: 'border-accent/40 hover:border-accent/70',
  'easy-green': 'border-easy-green/40 hover:border-easy-green/70',
};

const realmGlows: Record<string, string> = {
  primary: 'glow-primary',
  'cyber-blue': '',
  accent: 'glow-accent',
  'easy-green': '',
};

const QuestMap = () => {
  const { realms } = useSelector((state: RootState) => state.quest);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <Swords className="w-8 h-8 text-primary" /> Quest Map
          </h1>
          <p className="text-muted-foreground font-body text-lg mt-1">Choose your realm and conquer the quests</p>
        </div>

        <div className="space-y-10">
          {realms.map(realm => (
            <div key={realm.id}>
              {/* Realm header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{realm.icon}</span>
                <h2 className="font-display font-bold text-xl text-foreground">{realm.name}</h2>
                {!realm.unlocked && (
                  <span className="inline-flex items-center gap-1 text-xs font-body font-semibold text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                )}
              </div>

              {/* Quests grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {realm.quests.map(quest => {
                  const dc = difficultyConfig[quest.difficulty];
                  const isLocked = quest.locked || !realm.unlocked;

                  return (
                    <button
                      key={quest.id}
                      disabled={isLocked}
                      onClick={() => {
                        dispatch(setActiveQuest(quest));
                        navigate(`/problem/${quest.id}`);
                      }}
                      className={`relative text-left p-5 rounded-xl border bg-card transition-all duration-200
                        ${isLocked
                          ? 'border-border opacity-50 cursor-not-allowed'
                          : `${realmColors[realm.color]} cursor-pointer hover:bg-secondary/50 ${quest.completed ? '' : realmGlows[realm.color]}`
                        }`}
                    >
                      {quest.completed && (
                        <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-easy-green" />
                      )}
                      {isLocked && (
                        <Lock className="absolute top-3 right-3 w-5 h-5 text-muted-foreground" />
                      )}
                      <span className={`inline-block text-xs font-body font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border mb-3 ${dc.bg} ${dc.text} ${dc.border}`}>
                        {quest.difficulty}
                      </span>
                      <h3 className="font-display font-semibold text-foreground text-sm mb-2">{quest.title}</h3>
                      <p className="font-mono text-xs text-primary">+{quest.xpReward} XP</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default QuestMap;

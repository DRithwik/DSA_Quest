import { useEffect, useState } from 'react';
import { Sword, Lock, CheckCircle, Clock, Award } from 'lucide-react';
import { supabase, Quest, QuestCompletion } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import QuestDetail from './QuestDetail';

export default function QuestsView() {
  const { profile } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [completions, setCompletions] = useState<Map<string, QuestCompletion>>(new Map());
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadQuests();
    loadCompletions();
  }, [profile]);

  const loadQuests = async () => {
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .order('order_index');

    if (data && !error) {
      setQuests(data);
    }
  };

  const loadCompletions = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('quest_completions')
      .select('*')
      .eq('user_id', profile.id);

    if (data && !error) {
      const completionMap = new Map<string, QuestCompletion>();
      data.forEach((completion) => {
        completionMap.set(completion.quest_id, completion);
      });
      setCompletions(completionMap);
    }
  };

  const filteredQuests = quests.filter((quest) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return completions.get(quest.id)?.completed;
    if (filter === 'in-progress') return completions.has(quest.id) && !completions.get(quest.id)?.completed;
    if (filter === 'available') return !completions.has(quest.id);
    return quest.difficulty === filter;
  });

  if (selectedQuest) {
    return (
      <QuestDetail
        quest={selectedQuest}
        completion={completions.get(selectedQuest.id)}
        onBack={() => {
          setSelectedQuest(null);
          loadCompletions();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center">
            <Sword className="mr-4 text-amber-400" />
            Quest Board
          </h1>
          <p className="text-gray-400">
            Choose your challenge and embark on your journey to master Data Structures and Algorithms
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <FilterButton
            label="All Quests"
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          />
          <FilterButton
            label="Available"
            active={filter === 'available'}
            onClick={() => setFilter('available')}
          />
          <FilterButton
            label="In Progress"
            active={filter === 'in-progress'}
            onClick={() => setFilter('in-progress')}
          />
          <FilterButton
            label="Completed"
            active={filter === 'completed'}
            onClick={() => setFilter('completed')}
          />
          <div className="w-px bg-slate-700 mx-2" />
          <FilterButton
            label="Beginner"
            active={filter === 'beginner'}
            onClick={() => setFilter('beginner')}
            color="green"
          />
          <FilterButton
            label="Intermediate"
            active={filter === 'intermediate'}
            onClick={() => setFilter('intermediate')}
            color="yellow"
          />
          <FilterButton
            label="Advanced"
            active={filter === 'advanced'}
            onClick={() => setFilter('advanced')}
            color="orange"
          />
          <FilterButton
            label="Expert"
            active={filter === 'expert'}
            onClick={() => setFilter('expert')}
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuests.map((quest) => {
            const completion = completions.get(quest.id);
            return (
              <QuestCard
                key={quest.id}
                quest={quest}
                completion={completion}
                onClick={() => setSelectedQuest(quest)}
              />
            );
          })}
        </div>

        {filteredQuests.length === 0 && (
          <div className="text-center py-16">
            <Sword className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No quests found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}

function FilterButton({ label, active, onClick, color }: FilterButtonProps) {
  const getColorClasses = () => {
    if (!color) {
      return active
        ? 'bg-amber-500 text-white'
        : 'bg-slate-700 text-gray-300 hover:bg-slate-600';
    }

    const colors = {
      green: active ? 'bg-green-500 text-white' : 'bg-slate-700 text-green-400 hover:bg-slate-600',
      yellow: active ? 'bg-yellow-500 text-white' : 'bg-slate-700 text-yellow-400 hover:bg-slate-600',
      orange: active ? 'bg-orange-500 text-white' : 'bg-slate-700 text-orange-400 hover:bg-slate-600',
      red: active ? 'bg-red-500 text-white' : 'bg-slate-700 text-red-400 hover:bg-slate-600',
    };

    return colors[color as keyof typeof colors];
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${getColorClasses()}`}
    >
      {label}
    </button>
  );
}

interface QuestCardProps {
  quest: Quest;
  completion?: QuestCompletion;
  onClick: () => void;
}

function QuestCard({ quest, completion, onClick }: QuestCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'advanced':
        return 'bg-orange-500';
      case 'expert':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    if (completion?.completed) {
      return <CheckCircle className="w-6 h-6 text-green-400" />;
    }
    if (completion) {
      return <Clock className="w-6 h-6 text-yellow-400" />;
    }
    return <Lock className="w-6 h-6 text-gray-500" />;
  };

  return (
    <div
      onClick={onClick}
      className="bg-slate-800 rounded-xl p-6 border-2 border-slate-700 hover:border-amber-500 transition-all duration-200 cursor-pointer transform hover:scale-105"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{quest.title}</h3>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold uppercase text-white px-2 py-1 rounded ${getDifficultyColor(
                quest.difficulty
              )}`}
            >
              {quest.difficulty}
            </span>
            <span className="text-xs text-gray-400 bg-slate-700 px-2 py-1 rounded">
              {quest.category}
            </span>
          </div>
        </div>
        <div>{getStatusIcon()}</div>
      </div>

      <p className="text-gray-400 text-sm mb-4 line-clamp-3">{quest.description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <div className="flex items-center text-amber-400 font-semibold">
          <Award className="w-5 h-5 mr-1" />
          <span>+{quest.xp_reward} XP</span>
        </div>
        {completion && (
          <span className="text-xs text-gray-500">
            {completion.attempts} attempt{completion.attempts !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}

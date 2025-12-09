import { useEffect, useState } from 'react';
import { User, Zap, Brain, Target, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface CharacterClass {
  id: string;
  name: string;
  description: string;
  icon: string;
  speed_bonus: number;
  optimization_bonus: number;
  accuracy_bonus: number;
  defense_bonus: number;
}

interface UserCharacter {
  id: string;
  user_id: string;
  class_id: string;
  selected_class: string;
}

export default function CharacterCustomization() {
  const { profile } = useAuth();
  const [classes, setClasses] = useState<CharacterClass[]>([]);
  const [userCharacter, setUserCharacter] = useState<UserCharacter | null>(null);
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [profile]);

  const loadData = async () => {
    if (!profile) return;

    // Load character classes
    const { data: classesData } = await supabase
      .from('character_classes')
      .select('*');

    if (classesData) {
      setClasses(classesData);
    }

    // Load user's character
    const { data: charData } = await supabase
      .from('user_character')
      .select('*')
      .eq('user_id', profile.id)
      .maybeSingle();

    if (charData) {
      setUserCharacter(charData);
      const selected = classesData?.find(c => c.id === charData.class_id);
      if (selected) setSelectedClass(selected);
    }

    setLoading(false);
  };

  const selectClass = async (classData: CharacterClass) => {
    if (!profile) return;

    try {
      if (userCharacter) {
        // Update existing character
        const { error } = await supabase
          .from('user_character')
          .update({
            class_id: classData.id,
            selected_class: classData.name,
          })
          .eq('id', userCharacter.id);

        if (error) throw error;
      } else {
        // Create new character
        const { error } = await supabase
          .from('user_character')
          .insert({
            user_id: profile.id,
            class_id: classData.id,
            selected_class: classData.name,
          });

        if (error) throw error;
      }

      setSelectedClass(classData);
      await loadData();
    } catch (err) {
      console.error('Error selecting class:', err);
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
            <User className="mr-4 text-amber-400" />
            Character Customization
          </h1>
          <p className="text-gray-400">Choose your class and customize your playstyle</p>
        </div>

        {selectedClass ? (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{selectedClass.icon}</div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedClass.name}</h2>
                  <p className="text-amber-400 font-semibold">Active Character</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {classes.map((classData) => (
            <ClassCard
              key={classData.id}
              classData={classData}
              isSelected={selectedClass?.id === classData.id}
              onSelect={() => selectClass(classData)}
            />
          ))}
        </div>

        {selectedClass && (
          <div className="bg-slate-800 rounded-xl p-6 border-2 border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Class Bonuses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatBonus
                icon={<Zap size={24} />}
                label="Speed Bonus"
                value={selectedClass.speed_bonus}
                color="from-yellow-500 to-orange-500"
              />
              <StatBonus
                icon={<Brain size={24} />}
                label="Optimization"
                value={selectedClass.optimization_bonus}
                color="from-purple-500 to-pink-500"
              />
              <StatBonus
                icon={<Target size={24} />}
                label="Accuracy"
                value={selectedClass.accuracy_bonus}
                color="from-blue-500 to-cyan-500"
              />
              <StatBonus
                icon={<Shield size={24} />}
                label="Defense"
                value={selectedClass.defense_bonus}
                color="from-green-500 to-emerald-500"
              />
            </div>

            <div className="mt-8 p-6 bg-slate-700/50 rounded-lg border border-slate-600">
              <p className="text-gray-300 leading-relaxed">
                {selectedClass.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ClassCardProps {
  classData: CharacterClass;
  isSelected: boolean;
  onSelect: () => void;
}

function ClassCard({ classData, isSelected, onSelect }: ClassCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`rounded-xl p-6 border-2 cursor-pointer transition-all duration-200 transform ${
        isSelected
          ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500 scale-105 shadow-lg shadow-amber-500/20'
          : 'bg-slate-800 border-slate-700 hover:border-amber-500 hover:scale-105'
      }`}
    >
      <div className="text-5xl mb-4">{classData.icon}</div>
      <h3 className="text-lg font-bold text-white mb-2">{classData.name}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{classData.description}</p>

      <div className="space-y-2 text-sm">
        {classData.speed_bonus !== 0 && (
          <div className="flex justify-between text-gray-300">
            <span>Speed:</span>
            <span className={`font-semibold ${classData.speed_bonus > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {classData.speed_bonus > 0 ? '+' : ''}{classData.speed_bonus}%
            </span>
          </div>
        )}
        {classData.optimization_bonus !== 0 && (
          <div className="flex justify-between text-gray-300">
            <span>Optimization:</span>
            <span className={`font-semibold ${classData.optimization_bonus > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {classData.optimization_bonus > 0 ? '+' : ''}{classData.optimization_bonus}%
            </span>
          </div>
        )}
        {classData.accuracy_bonus !== 0 && (
          <div className="flex justify-between text-gray-300">
            <span>Accuracy:</span>
            <span className={`font-semibold ${classData.accuracy_bonus > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {classData.accuracy_bonus > 0 ? '+' : ''}{classData.accuracy_bonus}%
            </span>
          </div>
        )}
        {classData.defense_bonus !== 0 && (
          <div className="flex justify-between text-gray-300">
            <span>Defense:</span>
            <span className={`font-semibold ${classData.defense_bonus > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {classData.defense_bonus > 0 ? '+' : ''}{classData.defense_bonus}%
            </span>
          </div>
        )}
      </div>

      {isSelected && (
        <div className="mt-4 text-center">
          <span className="text-amber-400 font-bold text-sm">✓ Selected</span>
        </div>
      )}
    </div>
  );
}

interface StatBonusProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

function StatBonus({ icon, label, value, color }: StatBonusProps) {
  return (
    <div className="bg-slate-700 rounded-lg p-4">
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${color} mb-3`}>
        {icon}
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className={`text-2xl font-bold ${value > 0 ? 'text-green-400' : 'text-red-400'}`}>
        {value > 0 ? '+' : ''}{value}%
      </p>
    </div>
  );
}

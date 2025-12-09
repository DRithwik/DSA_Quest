import { useEffect, useState } from 'react';
import { Zap, Brain, Target } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  cost_xp: number;
  effect: any;
}

export default function SkillTrees() {
  const { profile } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [unlockedSkills, setUnlockedSkills] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, [profile]);

  const loadSkills = async () => {
    if (!profile) return;

    // Load all skills
    const { data: skillsData } = await supabase
      .from('skill_trees')
      .select('*')
      .order('category');

    if (skillsData) {
      setSkills(skillsData);
    }

    // Load unlocked skills
    const { data: unlockedData } = await supabase
      .from('user_skills')
      .select('skill_id')
      .eq('user_id', profile.id);

    if (unlockedData) {
      setUnlockedSkills(new Set(unlockedData.map(u => u.skill_id)));
    }

    setLoading(false);
  };

  const unlockSkill = async (skillId: string, costXp: number) => {
    if (!profile || profile.total_xp < costXp) return;

    try {
      const { error } = await supabase
        .from('user_skills')
        .insert({
          user_id: profile.id,
          skill_id: skillId,
        });

      if (error) throw error;

      // Deduct XP
      const newTotalXp = profile.total_xp - costXp;
      await supabase
        .from('user_profiles')
        .update({ total_xp: newTotalXp })
        .eq('id', profile.id);

      await loadSkills();
    } catch (err) {
      console.error('Error unlocking skill:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  const offensiveSkills = skills.filter(s => s.category === 'offensive');
  const defensiveSkills = skills.filter(s => s.category === 'defensive');
  const utilitySkills = skills.filter(s => s.category === 'utility');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Skill Trees</h1>
          <p className="text-gray-400">Unlock powerful skills to enhance your combat capabilities</p>
        </div>

        {profile && (
          <div className="mb-8 bg-slate-800 rounded-xl p-4 border-2 border-slate-700">
            <p className="text-white">
              <span className="text-gray-400">Available XP to spend:</span>{' '}
              <span className="text-amber-400 font-bold text-lg">{profile.total_xp}</span>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <SkillCategory
            title="Offensive Skills"
            icon={<Zap className="w-6 h-6" />}
            skills={offensiveSkills}
            unlockedSkills={unlockedSkills}
            onUnlock={unlockSkill}
            color="from-yellow-500 to-orange-500"
            availableXp={profile?.total_xp || 0}
          />
          <SkillCategory
            title="Defensive Skills"
            icon={<Target className="w-6 h-6" />}
            skills={defensiveSkills}
            unlockedSkills={unlockedSkills}
            onUnlock={unlockSkill}
            color="from-blue-500 to-cyan-500"
            availableXp={profile?.total_xp || 0}
          />
          <SkillCategory
            title="Utility Skills"
            icon={<Brain className="w-6 h-6" />}
            skills={utilitySkills}
            unlockedSkills={unlockedSkills}
            onUnlock={unlockSkill}
            color="from-purple-500 to-pink-500"
            availableXp={profile?.total_xp || 0}
          />
        </div>
      </div>
    </div>
  );
}

interface SkillCategoryProps {
  title: string;
  icon: React.ReactNode;
  skills: Skill[];
  unlockedSkills: Set<string>;
  onUnlock: (skillId: string, costXp: number) => void;
  color: string;
  availableXp: number;
}

function SkillCategory({
  title,
  icon,
  skills,
  unlockedSkills,
  onUnlock,
  color,
  availableXp,
}: SkillCategoryProps) {
  return (
    <div className="space-y-6">
      <div className={`flex items-center gap-3 pb-4 border-b-2 border-slate-700`}>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
          <div className="text-white">{icon}</div>
        </div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>

      <div className="space-y-4">
        {skills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            unlocked={unlockedSkills.has(skill.id)}
            onUnlock={() => onUnlock(skill.id, skill.cost_xp)}
            canAfford={availableXp >= skill.cost_xp}
          />
        ))}
      </div>
    </div>
  );
}

interface SkillCardProps {
  skill: Skill;
  unlocked: boolean;
  onUnlock: () => void;
  canAfford: boolean;
}

function SkillCard({ skill, unlocked, onUnlock, canAfford }: SkillCardProps) {
  return (
    <div
      className={`rounded-lg p-4 border-2 transition-all ${
        unlocked
          ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500'
          : 'bg-slate-800 border-slate-700 hover:border-slate-600'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-bold text-white">{skill.name}</h3>
        {unlocked && <span className="text-amber-400 text-sm font-bold">✓ UNLOCKED</span>}
      </div>

      <p className="text-gray-400 text-sm mb-3">{skill.description}</p>

      {skill.effect && (
        <div className="bg-slate-700/50 rounded p-2 mb-3 text-xs text-gray-300">
          <p>
            <span className="text-amber-400 font-semibold">Effect:</span> {JSON.stringify(skill.effect)}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm text-amber-400 font-semibold flex items-center">
          {skill.cost_xp} XP
        </span>
        {!unlocked && (
          <button
            onClick={onUnlock}
            disabled={!canAfford}
            className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
              canAfford
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Unlock
          </button>
        )}
      </div>
    </div>
  );
}

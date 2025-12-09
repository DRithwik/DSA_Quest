import { useEffect, useState } from 'react';
import { Users, Plus, BookOpen, MessageSquare, Award } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  creator_id: string;
  max_members: number;
  topic: string;
  difficulty_level: string;
  created_at: string;
  member_count?: number;
}

export default function StudyGroups() {
  const { profile } = useAuth();
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [userGroups, setUserGroups] = useState<StudyGroup[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupTopic, setNewGroupTopic] = useState('General DSA');
  const [newGroupDifficulty, setNewGroupDifficulty] = useState('intermediate');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, [profile]);

  const loadGroups = async () => {
    if (!profile) return;

    // Load all study groups
    const { data: allGroups } = await supabase
      .from('study_groups')
      .select('*')
      .order('created_at', { ascending: false });

    if (allGroups) {
      setGroups(allGroups);
    }

    // Load user's groups
    const { data: memberData } = await supabase
      .from('study_group_members')
      .select('group_id')
      .eq('user_id', profile.id);

    if (memberData && allGroups) {
      const userGroupIds = memberData.map(m => m.group_id);
      const myGroups = allGroups.filter(g => userGroupIds.includes(g.id));
      setUserGroups(myGroups);
    }

    setLoading(false);
  };

  const createGroup = async () => {
    if (!profile || !newGroupName) return;

    try {
      const { data: newGroup, error } = await supabase
        .from('study_groups')
        .insert({
          name: newGroupName,
          description: newGroupDesc,
          creator_id: profile.id,
          topic: newGroupTopic,
          difficulty_level: newGroupDifficulty,
          max_members: 10,
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as member
      await supabase
        .from('study_group_members')
        .insert({
          group_id: newGroup.id,
          user_id: profile.id,
        });

      setShowCreateModal(false);
      setNewGroupName('');
      setNewGroupDesc('');
      await loadGroups();
    } catch (err) {
      console.error('Error creating group:', err);
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('study_group_members')
        .insert({
          group_id: groupId,
          user_id: profile.id,
        });

      if (error) throw error;
      await loadGroups();
    } catch (err) {
      console.error('Error joining group:', err);
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <BookOpen className="mr-4 text-amber-400" />
              Study Groups
            </h1>
            <p className="text-gray-400">Collaborate with other learners and master DSA together</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-lg transition-all"
          >
            <Plus size={20} />
            Create Group
          </button>
        </div>

        {userGroups.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Your Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userGroups.map((group) => (
                <StudyGroupCard key={group.id} group={group} isJoined={true} onJoin={() => {}} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Available Groups</h2>
          {groups.filter(g => !userGroups.find(ug => ug.id === g.id)).length === 0 ? (
            <div className="bg-slate-800 rounded-xl p-12 border-2 border-slate-700 text-center">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No available groups to join</p>
              <p className="text-gray-500 text-sm mt-2">Create a group or wait for others to join</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups
                .filter(g => !userGroups.find(ug => ug.id === g.id))
                .map((group) => (
                  <StudyGroupCard
                    key={group.id}
                    group={group}
                    isJoined={false}
                    onJoin={() => joinGroup(group.id)}
                  />
                ))}
            </div>
          )}
        </div>

        {showCreateModal && (
          <CreateGroupModal
            onClose={() => setShowCreateModal(false)}
            onCreate={createGroup}
            name={newGroupName}
            setName={setNewGroupName}
            description={newGroupDesc}
            setDescription={setNewGroupDesc}
            topic={newGroupTopic}
            setTopic={setNewGroupTopic}
            difficulty={newGroupDifficulty}
            setDifficulty={setNewGroupDifficulty}
          />
        )}
      </div>
    </div>
  );
}

interface StudyGroupCardProps {
  group: StudyGroup;
  isJoined: boolean;
  onJoin: () => void;
}

function StudyGroupCard({ group, isJoined, onJoin }: StudyGroupCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className={`rounded-xl p-6 border-2 transition-all ${
      isJoined
        ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500'
        : 'bg-slate-800 border-slate-700 hover:border-amber-500'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">{group.name}</h3>
          <p className="text-sm text-gray-400">{group.topic}</p>
        </div>
        <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${getDifficultyColor(group.difficulty_level)}`}>
          {group.difficulty_level}
        </span>
      </div>

      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{group.description}</p>

      <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
        <span className="flex items-center">
          <Users size={16} className="mr-1" />
          {group.max_members} max members
        </span>
        <span className="flex items-center">
          <MessageSquare size={16} className="mr-1" />
          Discussion
        </span>
      </div>

      {!isJoined && (
        <button
          onClick={onJoin}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Join Group
        </button>
      )}
      {isJoined && (
        <div className="text-center text-amber-400 font-semibold text-sm">✓ You are a member</div>
      )}
    </div>
  );
}

interface CreateGroupModalProps {
  onClose: () => void;
  onCreate: () => void;
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
}

function CreateGroupModal({
  onClose,
  onCreate,
  name,
  setName,
  description,
  setDescription,
  topic,
  setTopic,
  difficulty,
  setDifficulty,
}: CreateGroupModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-md w-full p-8 border-2 border-amber-500">
        <h2 className="text-3xl font-bold text-amber-400 mb-6">Create Study Group</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Group Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
              placeholder="e.g., Trees & Graphs Mastery"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 resize-none h-20"
              placeholder="What's your group about?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
            >
              <option>General DSA</option>
              <option>Arrays & Lists</option>
              <option>Trees & Graphs</option>
              <option>Dynamic Programming</option>
              <option>Sorting & Searching</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            disabled={!name}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

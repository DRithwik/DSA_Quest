import { useEffect, useState } from 'react';
import { Users, Plus, Shield, Trophy, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Clan {
  id: string;
  name: string;
  description: string;
  icon: string;
  leader_id: string;
  level: number;
  total_xp: number;
  member_count: number;
  max_members: number;
  created_at: string;
}

interface ClanMember {
  id: string;
  clan_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export default function ClansView() {
  const { profile } = useAuth();
  const [clans, setClans] = useState<Clan[]>([]);
  const [userClan, setUserClan] = useState<Clan | null>(null);
  const [clanMembers, setClanMembers] = useState<ClanMember[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClanName, setNewClanName] = useState('');
  const [newClanDesc, setNewClanDesc] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClans();
  }, [profile]);

  const loadClans = async () => {
    if (!profile) return;

    // Load all clans
    const { data: clansData } = await supabase
      .from('clans')
      .select('*')
      .order('total_xp', { ascending: false });

    if (clansData) {
      setClans(clansData);
    }

    // Check if user is in a clan
    const { data: memberData } = await supabase
      .from('clan_members')
      .select('clan_id')
      .eq('user_id', profile.id)
      .maybeSingle();

    if (memberData) {
      const { data: userClanData } = await supabase
        .from('clans')
        .select('*')
        .eq('id', memberData.clan_id)
        .maybeSingle();

      if (userClanData) {
        setUserClan(userClanData);

        // Load clan members
        const { data: membersData } = await supabase
          .from('clan_members')
          .select('*')
          .eq('clan_id', userClanData.id);

        if (membersData) {
          setClanMembers(membersData);
        }
      }
    }

    setLoading(false);
  };

  const createClan = async () => {
    if (!profile || !newClanName) return;

    try {
      const { data: newClan, error } = await supabase
        .from('clans')
        .insert({
          name: newClanName,
          description: newClanDesc,
          leader_id: profile.id,
          icon: '🛡️',
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as member
      await supabase
        .from('clan_members')
        .insert({
          clan_id: newClan.id,
          user_id: profile.id,
          role: 'leader',
        });

      setUserClan(newClan);
      setShowCreateModal(false);
      setNewClanName('');
      setNewClanDesc('');
      await loadClans();
    } catch (err) {
      console.error('Error creating clan:', err);
    }
  };

  const joinClan = async (clanId: string) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('clan_members')
        .insert({
          clan_id: clanId,
          user_id: profile.id,
          role: 'member',
        });

      if (error) throw error;

      // Update member count
      const clan = clans.find(c => c.id === clanId);
      if (clan) {
        await supabase
          .from('clans')
          .update({ member_count: clan.member_count + 1 })
          .eq('id', clanId);
      }

      await loadClans();
    } catch (err) {
      console.error('Error joining clan:', err);
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
              <Shield className="mr-4 text-amber-400" />
              Clans & Guilds
            </h1>
            <p className="text-gray-400">Join forces with other players or create your own guild</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={userClan !== null}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            Create Clan
          </button>
        </div>

        {userClan ? (
          <div className="mb-8">
            <YourClanPanel clan={userClan} members={clanMembers.length} />
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clans.map((clan) => (
            <ClanCard
              key={clan.id}
              clan={clan}
              isJoined={userClan?.id === clan.id}
              onJoin={() => joinClan(clan.id)}
              isFull={clan.member_count >= clan.max_members}
            />
          ))}
        </div>

        {clans.length === 0 && (
          <div className="bg-slate-800 rounded-xl p-12 border-2 border-slate-700 text-center">
            <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No clans available yet</p>
            <p className="text-gray-500 text-sm mt-2">Create one or invite friends to form your guild!</p>
          </div>
        )}

        {showCreateModal && (
          <CreateClanModal
            onClose={() => setShowCreateModal(false)}
            onCreate={createClan}
            name={newClanName}
            setName={setNewClanName}
            description={newClanDesc}
            setDescription={setNewClanDesc}
          />
        )}
      </div>
    </div>
  );
}

interface YourClanPanelProps {
  clan: Clan;
  members: number;
}

function YourClanPanel({ clan, members }: YourClanPanelProps) {
  return (
    <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{clan.icon}</div>
          <div>
            <h2 className="text-3xl font-bold text-white">{clan.name}</h2>
            <p className="text-amber-400 font-semibold">Your Clan</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">Lvl {clan.level}</p>
          <p className="text-sm text-gray-400">{members} / {clan.max_members} Members</p>
        </div>
      </div>

      <p className="text-gray-300 mb-4">{clan.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-3 border border-amber-500/30">
          <p className="text-gray-400 text-sm mb-1">Total XP</p>
          <p className="text-xl font-bold text-amber-400">{clan.total_xp.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 border border-amber-500/30">
          <p className="text-gray-400 text-sm mb-1">Members</p>
          <p className="text-xl font-bold text-white">{members}</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 border border-amber-500/30">
          <p className="text-gray-400 text-sm mb-1">Level</p>
          <p className="text-xl font-bold text-white">{clan.level}</p>
        </div>
      </div>
    </div>
  );
}

interface ClanCardProps {
  clan: Clan;
  isJoined: boolean;
  onJoin: () => void;
  isFull: boolean;
}

function ClanCard({ clan, isJoined, onJoin, isFull }: ClanCardProps) {
  return (
    <div className={`rounded-xl p-6 border-2 transition-all ${
      isJoined
        ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500'
        : 'bg-slate-800 border-slate-700 hover:border-amber-500'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-4xl">{clan.icon}</div>
        <span className={`text-xs font-bold uppercase px-3 py-1 rounded ${
          isJoined ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
        }`}>
          {isJoined ? 'Member' : 'Available'}
        </span>
      </div>

      <h3 className="text-lg font-bold text-white mb-1">{clan.name}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{clan.description}</p>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Level</span>
          <span className="text-white font-semibold">{clan.level}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Members</span>
          <span className="text-white font-semibold">{clan.member_count}/{clan.max_members}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 flex items-center"><Trophy size={14} className="mr-1" /> Total XP</span>
          <span className="text-amber-400 font-semibold">{(clan.total_xp / 1000).toFixed(1)}k</span>
        </div>
      </div>

      {!isJoined && !isFull && (
        <button
          onClick={onJoin}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Join Clan
        </button>
      )}
      {isFull && !isJoined && (
        <button disabled className="w-full bg-gray-600 text-gray-400 font-semibold py-2 rounded-lg cursor-not-allowed">
          Clan Full
        </button>
      )}
      {isJoined && (
        <div className="text-center text-amber-400 font-semibold">You are a member</div>
      )}
    </div>
  );
}

interface CreateClanModalProps {
  onClose: () => void;
  onCreate: () => void;
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
}

function CreateClanModal({ onClose, onCreate, name, setName, description, setDescription }: CreateClanModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-md w-full p-8 border-2 border-amber-500">
        <h2 className="text-3xl font-bold text-amber-400 mb-6">Create a New Clan</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Clan Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
              placeholder="Enter clan name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500 resize-none h-24"
              placeholder="Describe your clan's mission"
            />
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

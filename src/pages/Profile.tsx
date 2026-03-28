import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Navbar from '@/components/Navbar';
import { User, Edit2, Save, TrendingUp, Target, Trophy, Flame } from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// Mock efficiency data (Big-O trend over time)
const efficiencyData = [
  { week: 'W1', score: 35 },
  { week: 'W2', score: 42 },
  { week: 'W3', score: 48 },
  { week: 'W4', score: 55 },
  { week: 'W5', score: 52 },
  { week: 'W6', score: 63 },
  { week: 'W7', score: 70 },
  { week: 'W8', score: 75 },
];

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');

  if (!user) return null;

  const skillData = Object.entries(user.skills).map(([subject, value]) => ({
    subject, value, fullMark: 100,
  }));

  const stats = [
    { label: 'Total XP', value: '2,340', icon: <TrendingUp className="w-5 h-5" />, color: 'text-primary' },
    { label: 'Problems Solved', value: '42', icon: <Target className="w-5 h-5" />, color: 'text-easy-green' },
    { label: 'Win Rate', value: '64%', icon: <Trophy className="w-5 h-5" />, color: 'text-gold' },
    { label: 'Streak', value: `${user.streak} days`, icon: <Flame className="w-5 h-5" />, color: 'text-boss-red' },
  ];

  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* Profile header */}
        <div className="bg-card border border-border rounded-xl p-8 mb-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-secondary border-2 border-primary/30 flex items-center justify-center text-5xl glow-primary">
            {user.avatar}
          </div>
          <div className="flex-1 text-center sm:text-left">
            {editing ? (
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="bg-secondary border border-border rounded-lg px-3 py-2 text-foreground font-display font-bold text-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button onClick={() => setEditing(false)} className="text-primary hover:text-primary/80 transition-colors">
                  <Save className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="font-display font-bold text-2xl text-foreground">{user.username}</h1>
                <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-muted-foreground font-body mt-1">{user.email}</p>
            <div className="flex items-center gap-4 mt-2 justify-center sm:justify-start">
              <span className="font-display font-bold text-primary text-sm">Level {user.level}</span>
              <span className="text-muted-foreground font-body text-sm">Joined {user.joinedDate}</span>
              <span className="font-mono text-xs text-gold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/30">
                Elo 1320
              </span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5">
              <div className={`${s.color} mb-2`}>{s.icon}</div>
              <p className="text-muted-foreground font-body text-sm uppercase tracking-wider">{s.label}</p>
              <p className="text-foreground font-display font-bold text-2xl">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Skill Radar */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Skill Distribution
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={skillData}>
                <PolarGrid stroke="hsl(228 15% 20%)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(215 15% 55%)', fontSize: 12, fontFamily: 'Rajdhani' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="value" stroke="hsl(160 100% 50%)" fill="hsl(160 100% 50%)" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Efficiency chart */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-easy-green" /> Efficiency Trend
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(228 15% 20%)" />
                <XAxis dataKey="week" tick={{ fill: 'hsl(215 15% 55%)', fontSize: 12, fontFamily: 'Rajdhani' }} />
                <YAxis tick={{ fill: 'hsl(215 15% 55%)', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: 'hsl(228 22% 12%)', border: '1px solid hsl(228 15% 20%)', borderRadius: '8px', fontFamily: 'Rajdhani' }}
                  labelStyle={{ color: 'hsl(210 40% 92%)' }}
                />
                <Line type="monotone" dataKey="score" stroke="hsl(160 100% 50%)" strokeWidth={2} dot={{ fill: 'hsl(160 100% 50%)', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

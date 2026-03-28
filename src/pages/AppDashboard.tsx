import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import { Flame, Trophy, Star, TrendingUp, Map } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import Navbar from '@/components/Navbar';

const recentActivity = [
  { action: 'Solved "Two Sum"', xp: '+50 XP', time: '2h ago', icon: '✅' },
  { action: 'Attempted "Maximum Subarray"', xp: '+10 XP', time: '5h ago', icon: '🔄' },
  { action: 'Unlocked Graph Kingdom', xp: '+25 XP', time: '1d ago', icon: '🏰' },
  { action: '7-day streak bonus!', xp: '+100 XP', time: '2d ago', icon: '🔥' },
];

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  if (!user) return null;

  const skillData = Object.entries(user.skills).map(([subject, value]) => ({
    subject,
    value,
    fullMark: 100,
  }));

  const xpPercent = (user.xp / user.xpToNext) * 100;

  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero stats */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-1">
            Welcome back, <span className="text-primary text-glow-primary">{user.username}</span>
          </h1>
          <p className="text-muted-foreground font-body text-lg">Continue your quest to master DSA</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Level', value: user.level, icon: <Star className="w-5 h-5" />, color: 'text-gold', glow: 'glow-gold' },
            { label: 'XP', value: `${user.xp}/${user.xpToNext}`, icon: <TrendingUp className="w-5 h-5" />, color: 'text-primary', glow: 'glow-primary' },
            { label: 'Streak', value: `${user.streak} days`, icon: <Flame className="w-5 h-5" />, color: 'text-boss-red', glow: '' },
            { label: 'Rank', value: '#142', icon: <Trophy className="w-5 h-5" />, color: 'text-accent', glow: 'glow-accent' },
          ].map(stat => (
            <div key={stat.label} className={`bg-card border border-border rounded-xl p-5 ${stat.glow}`}>
              <div className={`${stat.color} mb-2`}>{stat.icon}</div>
              <p className="text-muted-foreground font-body text-sm uppercase tracking-wider">{stat.label}</p>
              <p className="text-foreground font-display font-bold text-2xl">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* XP Progress */}
        <div className="bg-card border border-border rounded-xl p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="font-body font-semibold text-foreground">Level {user.level} Progress</p>
            <p className="font-mono text-sm text-primary">{user.xp} / {user.xpToNext} XP</p>
          </div>
          <div className="h-4 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-1000 glow-primary"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Skill Radar */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display font-semibold text-foreground text-lg mb-4">Skill Radar</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillData}>
                <PolarGrid stroke="hsl(228 15% 20%)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(215 15% 55%)', fontSize: 12, fontFamily: 'Rajdhani' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Skills" dataKey="value" stroke="hsl(160 100% 50%)" fill="hsl(160 100% 50%)" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display font-semibold text-foreground text-lg mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 border border-border/50">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-foreground font-body font-semibold text-sm">{item.action}</p>
                    <p className="text-muted-foreground font-body text-xs">{item.time}</p>
                  </div>
                  <span className="text-primary font-mono text-sm font-semibold">{item.xp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/quests')}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold px-8 py-3 rounded-xl glow-primary hover:brightness-110 transition-all tracking-wider uppercase text-sm"
          >
            <Map className="w-5 h-5" /> Enter Quest Map
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { Sword, LayoutGrid, Zap, Trophy, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const skillData = [
  { subject: 'Arrays', A: 120, fullMark: 150 },
  { subject: 'Graphs', A: 98, fullMark: 150 },
  { subject: 'DP', A: 86, fullMark: 150 },
  { subject: 'Strings', A: 99, fullMark: 150 },
  { subject: 'Trees', A: 85, fullMark: 150 },
  { subject: 'Math', A: 65, fullMark: 150 },
];

export const Dashboard = () => {
    return (
        <div className="p-8 bg-background min-h-screen text-foreground space-y-8 max-w-7xl mx-auto">
            {/* Header / Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">User Mastery</h1>
                    <p className="text-muted-foreground text-lg">Level 24 Grandmaster • Elite Coder</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-3 rounded-2xl bg-card border border-white/5 flex items-center gap-3 shadow-neon-glow">
                        <Trophy className="text-yellow-400 w-6 h-6" />
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Rank</p>
                            <p className="text-xl font-bold tracking-tight">#1,204</p>
                        </div>
                    </div>
                    <div className="px-6 py-3 rounded-2xl bg-card border border-white/5 flex items-center gap-3 shadow-neon-glow">
                        <Zap className="text-primary w-6 h-6" />
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">XP Pulse</p>
                            <p className="text-xl font-bold tracking-tight">24.5K</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Progress Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 p-8 rounded-3xl bg-card/60 backdrop-blur-xl border border-white/10 flex flex-col justify-between"
                >
                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <h2 className="text-2xl font-bold tracking-tight">Next Evolution</h2>
                            <p className="text-primary font-mono font-bold tracking-widest uppercase text-sm">Level 25</p>
                        </div>
                        <div className="relative h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${65}%` }} // Simplified for demo, should be (user.xp % 100)%
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="absolute h-full bg-gradient-to-r from-primary via-secondary to-accent shadow-[0_0_15px_rgba(139,92,246,0.6)]"
                            />
                        </div>
                        <div className="flex justify-between text-muted-foreground text-sm font-medium">
                            <span>15,000 / 20,000 XP</span>
                            <span>Remaining: 5,000 XP</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mt-12">
                         {[
                            { label: 'Battles Won', val: '142', icon: <Sword />, color: 'text-rose-400' },
                            { label: 'Quests Cleared', val: '48', icon: <LayoutGrid />, color: 'text-emerald-400' },
                            { label: 'Current ELO', val: '1850', icon: <TrendingUp />, color: 'text-sky-400' },
                         ].map((s, i) => (
                             <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all group">
                                 <div className={`${s.color} mb-3 group-hover:scale-110 transition-transform`}>{s.icon}</div>
                                 <p className="text-2xl font-black">{s.val}</p>
                                 <p className="text-xs text-muted-foreground mt-1 uppercase font-semibold">{s.label}</p>
                             </div>
                         ))}
                    </div>
                </motion.div>

                {/* Radar Chart Card */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-3xl bg-card border border-white/10 flex flex-col items-center justify-center min-h-[400px]"
                >
                    <h2 className="text-xl font-bold mb-4 tracking-tight">Mastery Orbit</h2>
                    <div className="w-full h-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 13, fontWeight: 500 }} />
                                <Radar
                                    name="Mastery"
                                    dataKey="A"
                                    stroke="#8b5cf6"
                                    fill="#8b5cf6"
                                    fillOpacity={0.5}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Lock, CheckCircle2, Navigation } from 'lucide-react';

const realms = [
    { id: 'arrays', name: 'Array Realm', pos: { x: '15%', y: '25%' }, status: 'COMPLETED', color: 'text-emerald-400' },
    { id: 'strings', name: 'String Forest', pos: { x: '45%', y: '15%' }, status: 'ACTIVE', color: 'text-sky-400' },
    { id: 'graphs', name: 'Graph Kingdom', pos: { x: '75%', y: '35%' }, status: 'LOCKED', color: 'text-violet-400' },
    { id: 'dp', name: 'DP Mountains', pos: { x: '85%', y: '75%' }, status: 'LOCKED', color: 'text-rose-400' },
    { id: 'trees', name: 'Tree Meadows', pos: { x: '10%', y: '80%' }, status: 'ACTIVE', color: 'text-amber-400' },
    { id: 'recursion', name: 'Infinite Hollow', pos: { x: '50%', y: '50%' }, status: 'LOCKED', color: 'text-indigo-400' },
];

export const QuestMap = () => {
    return (
        <div className="p-8 bg-background min-h-screen text-foreground space-y-8 select-none">
            <div className="flex justify-between items-center mb-12">
                <div className="space-y-1">
                    <h2 className="text-4xl font-black tracking-tight flex items-center gap-3">
                         <Navigation className="text-secondary w-10 h-10" /> The Codelandia Atlas
                    </h2>
                    <p className="text-muted-foreground text-lg">Navigate through the realms of logic and structure.</p>
                </div>
            </div>

            {/* Visual Map */}
            <div className="relative w-full aspect-video bg-card/60 rounded-3xl overflow-hidden border border-white/15 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
                {/* SVG Background Path Decor (Connecting Realms) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <polyline 
                        points="15% 25%, 45% 15%, 75% 35%, 85% 75%, 50% 50%, 10% 80%" 
                        fill="none" stroke="white" strokeWidth="2" strokeDasharray="10 10" 
                    />
                </svg>

                {/* Realm Markers */}
                {realms.map((realm, i) => (
                    <motion.div
                        key={realm.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                        className="absolute group z-10"
                        style={{ left: realm.pos.x, top: realm.pos.y }}
                    >
                        <div className="flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                            <div className={`p-4 rounded-full bg-background border-2 ${realm.status === 'LOCKED' ? 'border-white/10 opacity-60' : 'border-white/20 shadow-neon-glow'} hover:scale-110 transition-transform`}>
                                {realm.status === 'COMPLETED' ? <CheckCircle2 className="text-emerald-400 w-8 h-8" /> : 
                                 realm.status === 'LOCKED' ? <Lock className="text-muted w-8 h-8" /> : 
                                 <MapPin className={`${realm.color} w-8 h-8 animate-bounce`} />}
                            </div>
                            <div className="mt-4 px-5 py-2 rounded-xl bg-card border border-white/5 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                <p className="font-bold text-sm tracking-wide">{realm.name}</p>
                                <p className="text-[10px] uppercase text-muted-foreground font-semibold mt-0.5 tracking-wider">{realm.status}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Fog of War Overlay (Simple) */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(10,10,12,0.6)_100%)]" />
            </div>

            {/* Legend / Status */}
            <div className="flex gap-8 px-4 mt-8">
                 <div className="flex items-center gap-3"><CheckCircle2 className="text-emerald-400 w-5 h-5"/> <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Mastered</span></div>
                 <div className="flex items-center gap-3"><MapPin className="text-secondary w-5 h-5 animate-pulse"/> <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Ongoing Mission</span></div>
                 <div className="flex items-center gap-3"><Lock className="text-muted w-5 h-5"/> <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Uncharted Territory</span></div>
            </div>
        </div>
    );
};

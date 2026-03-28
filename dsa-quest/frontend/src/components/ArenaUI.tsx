import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Zap, Shield, Skull, Target, Flame } from 'lucide-react';

export const ArenaUI = () => {
    const [myProgress, setMyProgress] = useState(45);
    const [opponentProgress, setOpponentProgress] = useState(38);
    const [attackEffect, setAttackEffect] = useState<string | null>(null);

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setOpponentProgress(prev => Math.min(100, prev + Math.random() * 2));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const triggerAttack = (type: string) => {
        setAttackEffect(type);
        setTimeout(() => setAttackEffect(null), 1500);
    };

    return (
        <div className="p-8 bg-background min-h-screen text-foreground space-y-12">
            {/* Battle Header */}
            <div className="flex justify-between items-center bg-card/40 p-6 rounded-3xl border border-white/5 relative overflow-hidden backdrop-blur-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-rose-400/5 pointer-events-none" />
                
                <div className="flex flex-col gap-3 z-10">
                   <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center font-black text-2xl shadow-neon-glow">Y</div>
                        <div>
                             <h4 className="font-black text-xl tracking-tight uppercase">You (Master)</h4>
                             <p className="text-secondary text-sm font-bold tracking-widest mt-0.5">ELO 1850</p>
                        </div>
                   </div>
                   <div className="w-64 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div animate={{ width: `${myProgress}%` }} className="h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_#8b5cf6]" />
                   </div>
                   <p className="text-xs font-mono opacity-50 uppercase tracking-widest">{Math.round(myProgress)}% Completion</p>
                </div>

                <div className="flex flex-col items-center gap-4 z-10">
                    <div className="w-16 h-16 bg-white/5 rounded-full border border-white/10 flex items-center justify-center animate-pulse">
                         <Sword className="text-rose-400 w-8 h-8 rotate-45" />
                    </div>
                    <div className="px-5 py-2 bg-rose-400/5 border border-rose-400/20 text-rose-400 text-xs font-black tracking-[0.3em] rounded-full uppercase">Battle Active</div>
                </div>

                <div className="flex flex-col items-end gap-3 z-10">
                   <div className="flex items-center gap-4 text-right">
                        <div>
                             <h4 className="font-black text-xl tracking-tight uppercase">Shadow_Coder</h4>
                             <p className="text-rose-400 text-sm font-bold tracking-widest mt-0.5">ELO 1910</p>
                        </div>
                        <div className="w-16 h-16 rounded-full bg-rose-400/20 border-2 border-rose-400/40 flex items-center justify-center font-black text-2xl shadow-[0_0_20px_rgba(244,63,94,0.3)] text-rose-400">S</div>
                   </div>
                   <div className="w-64 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 rotate-180">
                        <motion.div animate={{ width: `${opponentProgress}%` }} className="h-full bg-gradient-to-l from-rose-400 to-amber-400 shadow-[0_0_10px_#f43f5e]" />
                   </div>
                   <p className="text-xs font-mono opacity-50 uppercase tracking-widest">{Math.round(opponentProgress)}% Completion</p>
                </div>
            </div>

            {/* Combat Actions */}
            <div className="flex flex-col items-center gap-8">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground">Available Spell-casts</h3>
                <div className="flex gap-10">
                     {[
                        { name: 'Lag Spike', color: 'bg-emerald-400', icon: <Zap className="w-6 h-6"/>, effect: 'LAG' },
                        { name: 'Syntax Blur', color: 'bg-sky-400', icon: <Skull className="w-6 h-6"/>, effect: 'BLUR' },
                        { name: 'Invert Screen', color: 'bg-rose-400', icon: <Flame className="w-6 h-6"/>, effect: 'INVERT' },
                     ].map((spell, i) => (
                         <motion.button
                            key={i}
                            whileHover={{ scale: 1.1, translateY: -10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => triggerAttack(spell.effect)}
                            className="group flex flex-col items-center gap-4"
                         >
                             <div className={`w-20 h-20 rounded-3xl ${spell.color}/10 border border-${spell.color}/20 flex items-center justify-center text-${spell.color} shadow-lg group-hover:shadow-${spell.color}/40 group-hover:bg-${spell.color}/20 transition-all`}>
                                 {spell.icon}
                             </div>
                             <p className="text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">{spell.name}</p>
                         </motion.button>
                     ))}
                </div>
            </div>

            {/* Global Battle Visual Effect - Overlay */}
            <AnimatePresence>
                {attackEffect && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className={`fixed inset-0 pointer-events-none z-50 flex items-center justify-center backdrop-blur-sm ${attackEffect === 'INVERT' ? 'invert' : attackEffect === 'BLUR' ? 'blur-md' : 'animate-shake'}`}
                    >
                         <h2 className="text-7xl font-black text-white drop-shadow-[0_0_20px_black] uppercase tracking-widest italic">{attackEffect} SPELL ACTIVE!</h2>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Battle Feed */}
            <div className="max-w-2xl mx-auto w-full p-8 rounded-3xl bg-card border border-white/5 space-y-4">
                 <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-white/5 pb-4 px-2">Battle Chronicle</h4>
                 <div className="space-y-4 max-h-48 overflow-y-auto custom-scrollbar px-2">
                     <p className="text-sm font-medium"><span className="text-primary font-bold">You</span> completed <span className="text-emerald-400 font-bold">Task 1: Array Traversal</span> (+150 Accuracy)</p>
                     <p className="text-sm font-medium"><span className="text-rose-400 font-bold">Shadow_Coder</span> cast <span className="font-bold underline italic">Lag Spike</span> on you!</p>
                     <p className="text-sm font-medium opacity-50 italic">The arena echoes with the sounds of 0s and 1s...</p>
                 </div>
            </div>
        </div>
    );
};

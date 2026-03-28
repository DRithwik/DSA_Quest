import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Sparkles, MessageSquareCode, Clock, Box, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CodeEditor = () => {
    const [code, setCode] = useState('// Your path to mastery starts here\nfunction solve(n) {\n    // Implement your logic\n}');
    const [feedback, setFeedback] = useState<any>(null);
    const [isExecuting, setIsExecuting] = useState(false);
    const [activeTab, setActiveTab] = useState<'CONSOLE' | 'MENTOR'>('MENTOR');

    const handleRun = () => {
        setIsExecuting(true);
        setTimeout(() => {
            setIsExecuting(false);
            setFeedback({
                execution: { stdout: "Success!", runtime: "12ms", memory: "2.4MB" },
                ai: {
                    feedback: "You've correctly identified the base case, but consider if the iterative approach might be more space-efficient.",
                    hints: ["What happens if n is very large?", "Can you store the results of previous computations?"],
                    complexity: { time: "O(n)", space: "O(n)" },
                    score: 82
                }
            });
        }, 1500);
    };

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Editor Side */}
            <div className="flex-1 flex flex-col border-r border-white/5">
                <div className="p-4 bg-card/40 flex justify-between items-center border-b border-white/5">
                    <div className="flex items-center gap-2">
                         <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-muted-foreground uppercase">
                             <div className="w-2 h-2 rounded-full bg-emerald-400" /> JavaScript
                         </div>
                    </div>
                    <div className="flex gap-3">
                         <button 
                            onClick={handleRun}
                            disabled={isExecuting}
                            className="flex items-center gap-2 px-5 py-2 bg-primary/90 hover:bg-primary rounded-xl font-bold transition-all text-sm shadow-neon-glow disabled:opacity-50"
                         >
                             {isExecuting ? <Rocket className="w-4 h-4 animate-bounce" /> : <Play className="w-4 h-4 fill-current" />} Run Quest
                         </button>
                    </div>
                </div>
                <div className="flex-1 min-h-[500px]">
                    <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        defaultValue={code}
                        theme="vs-dark"
                        onChange={(val) => setCode(val || '')}
                        options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            padding: { top: 20 },
                            fontFamily: 'JetBrains Mono, Menlo, monospace',
                            scrollbar: { vertical: 'hidden' }
                        }}
                    />
                </div>
            </div>

            {/* AI / Console Side */}
            <div className="w-[450px] bg-card/60 backdrop-blur-3xl flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.3)]">
                <div className="flex border-b border-white/5">
                    {['MENTOR', 'CONSOLE'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 py-4 text-xs font-black tracking-widest uppercase transition-all border-b-2 ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                        >
                            {tab === 'MENTOR' ? <div className="flex items-center justify-center gap-2"><Sparkles className="w-3.5 h-3.5" /> AI Mentor</div> : 'Execution Console'}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {activeTab === 'MENTOR' ? (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                {feedback ? (
                                    <div className="space-y-8">
                                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                                            <h4 className="flex items-center gap-2 text-primary font-bold"><MessageSquareCode className="w-4 h-4" /> The Socratic Insight</h4>
                                            <p className="text-sm leading-relaxed text-slate-300">{feedback.ai.feedback}</p>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Strategic Hints</h4>
                                            {feedback.ai.hints.map((hint: string, i: number) => (
                                                <div key={i} className="p-4 rounded-xl bg-violet-400/5 border border-violet-400/10 flex gap-3 group hover:bg-violet-400/10 transition-all">
                                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary group-hover:scale-110">?</div>
                                                    <p className="text-xs font-medium italic opacity-80">{hint}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                             <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                 <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-2 flex items-center gap-2"><Clock className="w-3 h-3" /> Time</p>
                                                 <p className="text-xl font-mono text-emerald-400">{feedback.ai.complexity.time}</p>
                                             </div>
                                             <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                 <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-2 flex items-center gap-2"><Box className="w-3 h-3" /> Space</p>
                                                 <p className="text-xl font-mono text-emerald-400">{feedback.ai.complexity.space}</p>
                                             </div>
                                        </div>

                                        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 text-center">
                                            <p className="text-[10px] uppercase font-black tracking-widest mb-3 opacity-60">Quest Affinity Score</p>
                                            <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{feedback.ai.score}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 opacity-40">
                                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 animate-spin flex items-center justify-center">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm font-medium italic">Begin your quest to hear the mentor's voice...</p>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                className="space-y-4 font-mono text-xs"
                            >
                                {feedback?.execution ? (
                                    <div className="p-5 rounded-xl bg-black border border-white/10 space-y-4 overflow-x-auto">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-muted-foreground border-b border-white/5 pb-2">
                                            <span>Standard Output</span>
                                            <span className="text-emerald-400">Success</span>
                                        </div>
                                        <pre className="text-emerald-400/90 whitespace-pre-wrap">{feedback.execution.stdout}</pre>
                                        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/5 text-[10px] uppercase tracking-widest opacity-60 font-semibold">
                                            <span>Runtime: {feedback.execution.runtime}</span>
                                            <span>Memory: {feedback.execution.memory}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground italic text-center py-10">No execution data available.</p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

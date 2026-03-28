import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutGrid, Map, Code2, Sword as SwordIcon, User as UserIcon, LogOut } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { QuestMap } from './components/QuestMap';
import { CodeEditor } from './components/CodeEditor';
import { ArenaUI } from './components/ArenaUI';

const Sidebar = () => (
    <div className="w-20 lg:w-64 h-screen bg-card/60 border-r border-white/5 flex flex-col items-center lg:items-start py-8 px-4 gap-12 group transition-all backdrop-blur-3xl sticky top-0">
        <div className="flex items-center gap-3 px-2 group-hover:scale-105 transition-transform cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-black text-white text-xl shadow-neon-glow">DQ</div>
            <span className="hidden lg:block text-2xl font-black tracking-tighter uppercase italic">DSA-Quest</span>
        </div>

        <nav className="flex-1 w-full space-y-4">
            {[
                { label: 'Dashboard', icon: <LayoutGrid />, path: '/' },
                { label: 'Quest Map', icon: <Map />, path: '/map' },
                { label: 'Code Lab', icon: <Code2 />, path: '/editor' },
                { label: 'Coding Arena', icon: <SwordIcon />, path: '/arena' },
            ].map((item) => (
                <Link key={item.path} to={item.path} className="flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:border-white/5 hover:bg-white/5 group-hover:px-6 transition-all text-muted-foreground hover:text-foreground">
                    <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="hidden lg:block text-sm font-bold uppercase tracking-widest leading-none">{item.label}</span>
                </Link>
            ))}
        </nav>

        <div className="w-full pt-8 border-t border-white/5 space-y-4">
            <div className="flex items-center gap-4 p-4 cursor-pointer text-muted-foreground hover:text-foreground">
                <UserIcon className="w-6 h-6" />
                <span className="hidden lg:block text-sm font-bold uppercase tracking-widest">Account</span>
            </div>
            <div className="flex items-center gap-4 p-4 cursor-pointer text-rose-400/60 hover:text-rose-400">
                <LogOut className="w-6 h-6" />
                <span className="hidden lg:block text-sm font-bold uppercase tracking-widest">Logout</span>
            </div>
        </div>
    </div>
);

function App() {
  return (
    <Router>
        <div className="flex bg-background min-h-screen selection:bg-primary/30 scroll-smooth">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/map" element={<QuestMap />} />
                    <Route path="/editor" element={<CodeEditor />} />
                    <Route path="/arena" element={<ArenaUI />} />
                </Routes>
            </main>
        </div>
    </Router>
  );
}

export default App;

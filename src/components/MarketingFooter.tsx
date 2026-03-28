import React from "react";
import { Link } from "react-router-dom";
import { 
  Github, Twitter, Globe, Activity, BookOpen, Layers, 
  ChevronRight, Map, GitBranch, MessageCircle
} from "lucide-react";

const MarketingFooter = () => {
  return (
    <footer className="relative pt-24 pb-12 overflow-hidden" style={{ background: "#020205" }}>
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand block */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center p-[1px] shadow-lg shadow-violet-500/20">
                <div className="w-full h-full bg-[#05050d] rounded-[10px] flex items-center justify-center">
                  <span className="font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 text-xl tracking-tighter">DQ</span>
                </div>
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase italic">
                DSA-Quest <span className="text-violet-500/50">Core</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#64748b" }}>
              The ultimate proving ground for algorithm warriors. Ascend the hierarchy, conquer the realms, and master the machine.
            </p>
            
            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: <GitBranch className="h-4 w-4" />, label: "GitHub" },
                { icon: <MessageCircle className="h-4 w-4" />, label: "Twitter" },
                { icon: <Globe className="h-4 w-4" />, label: "Discord" },
              ].map(({ icon, label }) => (
                <a 
                  key={label}
                  href="#" 
                  onClick={e => e.preventDefault()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all hover:scale-110 active:scale-95 group"
                  style={{ 
                    background: "rgba(255,255,255,0.03)", 
                    borderColor: "rgba(255,255,255,0.08)",
                    color: "#64748b"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-5 flex items-center gap-2"
              style={{ color: "#a78bfa" }}>
              <Layers className="h-3 w-3" /> Platform
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Quests", to: "/explore/quests" },
                { label: "Arena", to: "/explore/arena" },
                { label: "Code Fix", to: "/analysis" },
                { label: "Leaderboard", to: "/explore/leaderboard" },
                { label: "Docs", to: "/explore/docs" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm transition-colors hover:text-white flex items-center gap-1.5 group font-medium"
                    style={{ color: "#64748b" }}>
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#a78bfa" }} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Realms */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-5 flex items-center gap-2"
              style={{ color: "#38bdf8" }}>
              <Map className="h-3 w-3" /> Realms
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Array Realm", color: "#34d399" },
                { name: "Graph Kingdom", color: "#38bdf8" },
                { name: "Tree Meadows", color: "#fbbf24" },
                { name: "DP Mountains", color: "#a78bfa" },
                { name: "String Forest", color: "#fb7185" },
                { name: "Infinite Hollow", color: "#f472b6" },
              ].map(({ name, color }) => (
                <li key={name}>
                  <a href="#" onClick={e => e.preventDefault()}
                    className="text-sm transition-colors hover:text-white flex items-center gap-2 group font-medium"
                    style={{ color: "#64748b" }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color, opacity: 0.6 }} />
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-5 flex items-center gap-2"
              style={{ color: "#fb7185" }}>
              <BookOpen className="h-3 w-3" /> Resources
            </h4>
            <ul className="space-y-3">
              {["Documentation", "API Reference", "Changelog", "Community", "Blog", "Open Source"].map(item => (
                <li key={item}>
                  <a href="#" onClick={e => e.preventDefault()}
                    className="text-sm transition-colors hover:text-white flex items-center gap-1.5 group font-medium"
                    style={{ color: "#64748b" }}>
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#fb7185" }} />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-5 flex items-center gap-2"
              style={{ color: "#fbbf24" }}>
              <Activity className="h-3 w-3" /> Status
            </h4>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">All Systems Operational</span>
            </div>
            <div className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="news@dsa-quest.com"
                className="w-full px-3 py-2 rounded-xl text-xs border outline-none transition-all focus:border-violet-500/50"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
              />
              <button className="w-full px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-white bg-violet-600/40 border border-violet-500/30 hover:bg-violet-600/60">
                Join Network →
              </button>
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px border-t border-b overflow-hidden rounded-2xl"
          style={{ borderColor: "rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.04)" }}>
          {[
            { label: "Active Warriors", value: "12,400+", color: "#38bdf8" },
            { label: "Problems Solved", value: "1.2M+", color: "#a78bfa" },
            { label: "Avg Sandbox", value: "98ms", color: "#34d399" },
            { label: "Realms", value: "6 Worlds", color: "#fb7185" },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center py-6" style={{ background: "#050510" }}>
              <div className="text-lg font-black mb-0.5 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" style={{ color }}>{value}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: "#334155" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#1e293b" }}>
            © 2026 DSA-Quest · Optimized for Performance · Global Deployment
          </p>
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#334155" }}>
            <a href="#" className="hover:text-white transition-colors" onClick={e => e.preventDefault()}>Privacy</a>
            <a href="#" className="hover:text-white transition-colors" onClick={e => e.preventDefault()}>Terms</a>
            <a href="#" className="hover:text-white transition-colors" onClick={e => e.preventDefault()}>Security</a>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
              <span className="text-[8px] text-cyan-400">V3.1.2-STABLE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MarketingFooter;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const MarketingNavbar = () => {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { to: "/explore/quests", label: "Quests" },
    { to: "/explore/arena", label: "Arena" },
    { to: "/analysis", label: "Code Fix" },
    { to: "/explore/leaderboard", label: "Leaderboard" },
    { to: "/explore/docs", label: "Docs" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-5 bg-background/50 backdrop-blur-2xl border-b border-white/5">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
          <Code2 className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-black tracking-tight uppercase italic text-white flex gap-1 font-display">
          DSA<span className="text-cyan-400">QUEST</span>
        </span>
      </Link>
      
      <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`transition-all duration-200 hover:text-white ${
              path === item.to ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : "text-muted-foreground"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Link to="/login" className="hidden sm:block">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors cursor-pointer">Sign In</span>
        </Link>
        <Link to="/login">
          <Button size="sm" className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 border-0 font-black uppercase tracking-widest text-[10px] px-6 h-10 rounded-xl shadow-lg shadow-cyan-500/10">
            Start Quest
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default MarketingNavbar;

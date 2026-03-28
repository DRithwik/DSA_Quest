import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MarketingNavbar from "@/components/MarketingNavbar";
import {
  Code2, Sword, Map, Trophy, Zap, Shield, Brain, Rocket,
  Star, ChevronRight, Users, BarChart2, Lock, Play, CheckCircle,
  ArrowRight, Terminal, GitBranch, Flame, Crown, Target,
  TrendingUp, Clock, Award, Sparkles, ChevronDown, X,
  MessageSquare, ThumbsUp, Hash, Layers, MessageCircle,
  BookOpen, Cpu, Activity, Globe
} from "lucide-react";

import PageBackground from "@/components/PageBackground";

/* ─── DATA ─────────────────────────────────────── */
const FEATURES = [
  {
    icon: <Brain className="h-6 w-6" />,
    color: "violet",
    accent: "rgba(139,92,246,0.15)",
    border: "rgba(139,92,246,0.3)",
    iconBg: "rgba(139,92,246,0.2)",
    tag: "AI-POWERED",
    title: "Socratic AI Mentor",
    desc: "Powered by Gemini 1.5, your mentor asks the right questions instead of handing you answers. It analyzes your approach, hints at edge cases, and delivers Big-O analysis in real time.",
    badge: "Gemini 1.5",
    badgeColor: "rgba(139,92,246,0.2)",
    badgeText: "#a78bfa",
    snippet: `// Mentor: "What's your current time complexity?"
// You: "O(n²) — nested loops"
// Mentor: "Think about what you're really searching for..."
// → Guided to O(n log n) solution ✓`,
  },
  {
    icon: <Sword className="h-6 w-6" />,
    color: "rose",
    accent: "rgba(244,63,94,0.15)",
    border: "rgba(244,63,94,0.3)",
    iconBg: "rgba(244,63,94,0.2)",
    tag: "MULTIPLAYER",
    title: "Code Wars Arena",
    desc: "Real-time 1v1 and tournament battles. Submit solutions, cast spells to disrupt opponents, and climb the ELO ladder. Matches ranked by difficulty tier.",
    badge: "Live ELO",
    badgeColor: "rgba(244,63,94,0.2)",
    badgeText: "#fb7185",
    snippet: `// 🔴 Battle vs. cipher_monk [ELO 1847]
// ⚡ Time left: 04:22
// 🗡️ You solved it! Casting "Time Bomb" spell...
// 💥 Opponent slowed by 30s → Victory!`,
  },
  {
    icon: <Map className="h-6 w-6" />,
    color: "sky",
    accent: "rgba(56,189,248,0.15)",
    border: "rgba(56,189,248,0.3)",
    iconBg: "rgba(56,189,248,0.2)",
    tag: "STORY-DRIVEN",
    title: "Quest Map",
    desc: "Navigate Codelandia — six lore-rich realms, each unlocked by mastering the previous. Story-driven challenges set in unique algorithmic worlds with boss encounters.",
    badge: "6 Realms",
    badgeColor: "rgba(56,189,248,0.2)",
    badgeText: "#38bdf8",
    snippet: `// 📍 Array Realm — Chapter 3
// "The Sorting Golem blocks your path."
// Defeat it with an O(n log n) spell.
// → 450 XP + Merge Scroll unlocked 🔓`,
  },
  {
    icon: <Zap className="h-6 w-6" />,
    color: "amber",
    accent: "rgba(245,158,11,0.15)",
    border: "rgba(245,158,11,0.3)",
    iconBg: "rgba(245,158,11,0.2)",
    tag: "PROGRESSION",
    title: "XP & Leveling",
    desc: "Algorithmic progression system. Earn XP by difficulty, time bonus, and AI score. Level = sqrt(totalXP / 100). Prestige ranks reset your level for bonus multipliers.",
    badge: "Formula-Based",
    badgeColor: "rgba(245,158,11,0.2)",
    badgeText: "#fbbf24",
    snippet: `XP = (BaseXP × Difficulty) + TimeBonus + AIScore
Level = Math.floor(Math.sqrt(XP / 100))
// Lv.12 → 14,400 XP total
// Next level needs 2,300 more XP`,
  },
  {
    icon: <Shield className="h-6 w-6" />,
    color: "emerald",
    accent: "rgba(16,185,129,0.15)",
    border: "rgba(16,185,129,0.3)",
    iconBg: "rgba(16,185,129,0.2)",
    tag: "SECURE",
    title: "Isolated Sandbox",
    desc: "Every submission runs in a Docker container with strict CPU/memory caps and zero network access. Sub-100ms cold starts ensure fair competition.",
    badge: "Docker",
    badgeColor: "rgba(16,185,129,0.2)",
    badgeText: "#34d399",
    snippet: `docker run --rm --cpus=0.5 \\
  --memory=128m --network=none \\
  --timeout=2s \\
  dsa-sandbox:latest ./run.sh
# → Isolated. Fair. Instant.`,
  },
  {
    icon: <BarChart2 className="h-6 w-6" />,
    color: "pink",
    accent: "rgba(236,72,153,0.15)",
    border: "rgba(236,72,153,0.3)",
    iconBg: "rgba(236,72,153,0.2)",
    tag: "ANALYTICS",
    title: "Skill Radar",
    desc: "Live radar chart tracking mastery across 6 domains: Arrays, Graphs, DP, Trees, Strings, and Math. Spot your weakest realm and auto-generate a personalized drill plan.",
    badge: "6 Domains",
    badgeColor: "rgba(236,72,153,0.2)",
    badgeText: "#f472b6",
    snippet: `Arrays    ████████░░ 78%
Trees     ██████░░░░ 58%
Graphs    ███████░░░ 71%
DP        ████░░░░░░ 42%  ← Focus here
Strings   ████████░░ 80%
Math      ██████░░░░ 63%`,
  },
];

const REALMS = [
  {
    name: "Array Realm",
    lore: "The Flatlands of Linear Thought",
    status: "OPEN",
    difficulty: "Beginner",
    quests: 24,
    progress: 67,
    color: "#34d399",
    bgColor: "rgba(16,185,129,0.08)",
    borderColor: "rgba(16,185,129,0.25)",
    boss: "The Sorting Golem",
    icon: "⚔️",
  },
  {
    name: "Graph Kingdom",
    lore: "The Realm of Infinite Connections",
    status: "OPEN",
    difficulty: "Intermediate",
    quests: 18,
    progress: 30,
    color: "#38bdf8",
    bgColor: "rgba(56,189,248,0.08)",
    borderColor: "rgba(56,189,248,0.25)",
    boss: "Dijkstra's Phantom",
    icon: "🌐",
  },
  {
    name: "Tree Meadows",
    lore: "The Garden of Recursion",
    status: "OPEN",
    difficulty: "Intermediate",
    quests: 20,
    progress: 0,
    color: "#fbbf24",
    bgColor: "rgba(245,158,11,0.08)",
    borderColor: "rgba(245,158,11,0.25)",
    boss: "The Balanced Sage",
    icon: "🌳",
  },
  {
    name: "DP Mountains",
    lore: "The Summit of Overlapping Fates",
    status: "LOCKED",
    difficulty: "Advanced",
    quests: 22,
    progress: 0,
    color: "#a78bfa",
    bgColor: "rgba(139,92,246,0.08)",
    borderColor: "rgba(139,92,246,0.25)",
    boss: "The Memoization Wraith",
    icon: "🏔️",
    requirement: "Reach Level 8",
  },
  {
    name: "String Forest",
    lore: "The Labyrinth of Patterns",
    status: "LOCKED",
    difficulty: "Advanced",
    quests: 16,
    progress: 0,
    color: "#fb7185",
    bgColor: "rgba(244,63,94,0.08)",
    borderColor: "rgba(244,63,94,0.25)",
    boss: "The Regex Hydra",
    icon: "🌿",
    requirement: "Complete DP Mountains",
  },
  {
    name: "Infinite Hollow",
    lore: "Where All Algorithms Converge",
    status: "LOCKED",
    difficulty: "Expert",
    quests: 12,
    progress: 0,
    color: "#f472b6",
    bgColor: "rgba(236,72,153,0.08)",
    borderColor: "rgba(236,72,153,0.25)",
    boss: "The Complexity God",
    icon: "♾️",
    requirement: "Clear All Realms",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose Your Realm",
    desc: "Pick a domain matching your current skill level. Each realm has a story, a boss, and 12–24 algorithmic quests.",
    color: "#a78bfa",
  },
  {
    step: "02",
    title: "Solve with Your Mentor",
    desc: "The Socratic AI mentor never spoils — it guides you with targeted questions, complexity hints, and edge-case nudges.",
    color: "#38bdf8",
  },
  {
    step: "03",
    title: "Earn XP & Level Up",
    desc: "Every submission scores XP based on difficulty, speed, and code quality. Unlock new realms and prestige ranks as you climb.",
    color: "#34d399",
  },
  {
    step: "04",
    title: "Battle in the Arena",
    desc: "Take on rivals in real-time coding duels. Use collected spell cards to disrupt opponents and secure your ELO ranking.",
    color: "#fb7185",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Narayanan",
    handle: "@priya_codes",
    role: "SWE @ Google",
    avatar: "PN",
    avatarColor: "rgba(56,189,248,0.3)",
    text: "The Socratic mentor is what sets this apart. I actually understand WHY my DP solution works now, not just that it does. Went from level 4 to level 14 in 3 weeks.",
    stars: 5,
    xp: "+4,200 XP",
  },
  {
    name: "Marcus Webb",
    handle: "@marcw_dev",
    role: "CS Student, MIT",
    avatar: "MW",
    avatarColor: "rgba(245,158,11,0.3)",
    text: "Beat 3 people in arena last night and I've only been using it for two weeks. The real-time battles make you solve under pressure — which is exactly what interviews feel like.",
    stars: 5,
    xp: "ELO 1,842",
  },
  {
    name: "Yuki Tanaka",
    handle: "@yukitanaka_eng",
    role: "Backend Engineer",
    avatar: "YT",
    avatarColor: "rgba(139,92,246,0.3)",
    text: "Cleared DP Mountains after struggling with memoization for 6 months. The quest-based structure + the boss mechanic made the whole thing click. Obsessed with this.",
    stars: 5,
    xp: "Realm Cleared",
  },
];

const TICKER_ITEMS = [
  "⚡ cipher_monk defeated DP Mountains",
  "🏆 New Record: Two-Sum in 0.3s",
  "⬆️ nova_dev reached Level 15",
  "🗡️ Arena: bit_wizard vs quantum_ray — LIVE",
  "🔓 Infinite Hollow — 3 heroes cleared it",
  "🌟 Weekly Tournament starts in 2h",
  "💥 xor_knight cast Time Bomb in Arena",
  "📈 1,204 submissions in the last hour",
];

/* ── LIVE ACTIVITY FEED DATA ─────────────────── */
const ACTIVITY_FEED = [
  { user: "xor_knight", action: "solved", detail: "Binary Tree Diameter", xp: "+320 XP", color: "#a78bfa", time: "2s ago" },
  { user: "bit_wizard", action: "won arena", detail: "vs quantum_ray", xp: "+ELO 18", color: "#fb7185", time: "14s ago" },
  { user: "nova_dev", action: "leveled up", detail: "→ Level 15", xp: "+2,500 XP", color: "#fbbf24", time: "32s ago" },
  { user: "cipher_monk", action: "cleared", detail: "DP Mountains", xp: "+1,800 XP", color: "#34d399", time: "1m ago" },
  { user: "loop_queen", action: "solved", detail: "LRU Cache in 87s", xp: "+480 XP", color: "#38bdf8", time: "2m ago" },
];

/* ── COMPARISON TABLE DATA ───────────────────── */
const COMPARISON = [
  { feature: "AI Mentor", dsaquest: true, leetcode: false, hackerrank: false },
  { feature: "Real-time 1v1 Battles", dsaquest: true, leetcode: false, hackerrank: false },
  { feature: "Story-driven Quests", dsaquest: true, leetcode: false, hackerrank: false },
  { feature: "ELO Rating System", dsaquest: true, leetcode: false, hackerrank: false },
  { feature: "Skill Radar Analytics", dsaquest: true, leetcode: true, hackerrank: true },
  { feature: "Isolated Docker Sandbox", dsaquest: true, leetcode: true, hackerrank: true },
  { feature: "Free Tier Available", dsaquest: true, leetcode: true, hackerrank: true },
];

/* ─── COMPONENTS ───────────────────────────────── */

const AnimatedCounter = ({ target, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          let start = 0;
          const step = Math.ceil(target / 60);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(start);
          }, 20);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="font-display tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const CodeSnippet = ({ code, lang = "js" }) => (
  <div className="code-window mt-4 font-mono-code text-xs leading-relaxed">
    <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
      <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
      <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
      <span className="ml-2 text-white/20 text-xs">{lang}</span>
    </div>
    <pre className="px-4 py-3 overflow-x-auto text-emerald-400/80 whitespace-pre-wrap">{code}</pre>
  </div>
);

const StarRating = ({ count }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
    ))}
  </div>
);

/* ─── MAIN PAGE ─────────────────────────────────── */
const Index = () => {
  const navigate = useNavigate();
  const [activeRealm, setActiveRealm] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFeat, setActiveFeat] = useState(0);
  const [activityIndex, setActivityIndex] = useState(0);

  // Auto-cycle live activity feed
  useEffect(() => {
    const timer = setInterval(() => {
      setActivityIndex(i => (i + 1) % ACTIVITY_FEED.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const tickerText = TICKER_ITEMS.join("   •   ");

  return (
    <>
      <PageBackground />
      <div
        className="min-h-screen overflow-x-hidden font-body"
        style={{ background: "#080810", color: "#e2e8f0" }}
      >

        {/* ── TICKER BANNER ──────────────────── */}
        <div className="ticker-wrap py-2 border-b" style={{ background: "rgba(139,92,246,0.08)", borderColor: "rgba(139,92,246,0.2)" }}>
          <div className="ticker-inner text-xs font-semibold tracking-wide" style={{ color: "#a78bfa" }}>
            {tickerText}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;{tickerText}
          </div>
        </div>

        {/* ── NAV ────────────────────────────── */}
        <MarketingNavbar />

        {/* ── HERO ────────────────────────────── */}
        <section
          className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 pb-24 overflow-hidden"
        >
          {/* Floating battle cards — decorative */}
          <div className="absolute left-8 top-1/3 hidden xl:block battle-card-active" style={{ zIndex: 5 }}>
            <div className="border-gradient rounded-2xl p-4 w-52" style={{ background: "#0f0f1a" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "rgba(244,63,94,0.2)", color: "#fb7185" }}>⚔️</div>
                <div className="text-xs font-bold" style={{ color: "#fb7185" }}>LIVE BATTLE</div>
              </div>
              <div className="text-xs mb-2" style={{ color: "#94a3b8" }}>Binary Search Tree</div>
              <div className="flex justify-between text-xs font-mono-code">
                <span style={{ color: "#a78bfa" }}>U-7421</span>
                <span style={{ color: "#94a3b8" }}>vs</span>
                <span style={{ color: "#38bdf8" }}>U-1092</span>
              </div>
              <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="h-full rounded-full" style={{ width: "65%", background: "linear-gradient(90deg, #7c3aed, #fb7185)" }} />
              </div>
              <div className="text-xs mt-1 text-right font-mono-code" style={{ color: "#34d399" }}>04:22 left</div>
            </div>
          </div>

          <div className="absolute right-8 top-1/4 hidden xl:block battle-card-inactive" style={{ zIndex: 5 }}>
            <div className="border-gradient rounded-2xl p-4 w-52" style={{ background: "#0f0f1a" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-lg">⬆️</div>
                <div>
                  <div className="text-xs font-bold text-white">U-8832</div>
                  <div className="text-xs" style={{ color: "#94a3b8" }}>reached Level 15</div>
                </div>
              </div>
              <div className="text-xs font-semibold mb-1" style={{ color: "#fbbf24" }}>+2,500 XP bonus</div>
              <div className="text-xs" style={{ color: "#94a3b8" }}>DP Mountains cleared</div>
              <div className="flex gap-1 mt-2">
                {["Arrays", "Graphs", "Trees"].map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa" }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Hero content */}
          <div className="relative z-10 max-w-5xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest"
              style={{ background: "rgba(139,92,246,0.08)", borderColor: "rgba(139,92,246,0.3)", color: "#a78bfa" }}>
              <Sparkles className="h-3 w-3 fill-current" />
              The Ultimate DSA Battle Ground
              <Sparkles className="h-3 w-3 fill-current" />
            </div>

            <h1 className="font-display leading-none tracking-tight" style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}>
              <span className="shimmer-text">Master Algorithms.</span>
              <br />
              <span className="text-white">Conquer the Arena.</span>
            </h1>

            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "#94a3b8" }}>
              A gamified DSA platform with quest-based learning, real-time multiplayer coding battles,
              and an AI mentor that{" "}
              <span className="font-semibold" style={{ color: "#a78bfa" }}>challenges you — it never gives you the answer</span>.
            </p>

            {/* Inline stat pills */}
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { icon: <Users className="h-4 w-4" />, text: "12,400+ Warriors", color: "#38bdf8" },
                { icon: <Flame className="h-4 w-4" />, text: "1.2M Submissions", color: "#fb7185" },
                { icon: <Trophy className="h-4 w-4" />, text: "Weekly Tournaments", color: "#fbbf24" },
                { icon: <Brain className="h-4 w-4" />, text: "Gemini-Powered Mentor", color: "#a78bfa" },
              ].map(({ icon, text, color }) => (
                <div key={text} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border"
                  style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", color }}>
                  {icon} {text}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-10 py-4 rounded-2xl text-base font-bold transition-all"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #db2777)",
                  color: "white",
                  boxShadow: "0 0 40px rgba(139,92,246,0.5)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 70px rgba(139,92,246,0.8)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 40px rgba(139,92,246,0.5)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <Rocket className="h-5 w-5" /> Begin Your Quest
              </button>
              <button
                onClick={() => navigate("/explore/docs")}
                className="flex items-center gap-2 px-10 py-4 rounded-2xl text-base font-semibold border transition-all"
                style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#e2e8f0", fontFamily: "'Space Grotesk', sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              >
                <Play className="h-4 w-4 text-sky-400 fill-sky-400" /> Watch Demo
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {["#7c3aed", "#db2777", "#0284c7", "#059669", "#d97706"].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                    style={{ background: c, borderColor: "#080810" }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm" style={{ color: "#64748b" }}>
                <span className="font-bold" style={{ color: "#e2e8f0" }}>12,400+</span> algorithm warriors joined this week
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ color: "#475569", animation: "float 2s ease-in-out infinite" }}>
            <span className="text-xs tracking-widest uppercase">Explore</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </section>

        {/* ── ANIMATED STATS ─────────────────── */}
        <section className="py-16 border-y relative overflow-hidden" style={{ background: "rgba(255,255,255,0.015)", borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="absolute inset-0 scanline-effect pointer-events-none" />
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 12400, suffix: "+", label: "Warriors Enrolled", icon: <Users className="h-5 w-5" />, color: "#38bdf8" },
              { value: 1200000, suffix: "+", label: "Submissions Judged", icon: <Terminal className="h-5 w-5" />, color: "#a78bfa" },
              { value: 98, suffix: "ms", label: "Avg Sandbox Latency", icon: <Zap className="h-5 w-5" />, color: "#34d399" },
              { value: 6, suffix: "", label: "Algorithmic Realms", icon: <Map className="h-5 w-5" />, color: "#fb7185" },
            ].map(({ value, suffix, label, icon, color }) => (
              <div key={label} className="text-center space-y-2">
                <div className="flex justify-center mb-2" style={{ color }}>{icon}</div>
                <div className="text-4xl font-black" style={{ color }}>
                  <AnimatedCounter target={value} suffix={suffix} />
                </div>
                <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ───────────────────── */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#34d399" }}>The Path</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">How It Works</h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "#64748b" }}>
              From zero to hero in four deliberate steps.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-0 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px"
              style={{ background: "linear-gradient(90deg, rgba(139,92,246,0), rgba(139,92,246,0.5), rgba(56,189,248,0.5), rgba(56,189,248,0))" }} />

            {HOW_IT_WORKS.map(({ step, title, desc, color }, i) => (
              <div key={step} className="relative text-center px-6 py-8 card-hover rounded-2xl"
                style={{ cursor: "default" }}>
                <div className="relative mx-auto mb-6 w-20 h-20 rounded-2xl flex items-center justify-center font-display text-2xl font-black border"
                  style={{
                    background: `${color}15`,
                    borderColor: `${color}30`,
                    color,
                    boxShadow: `0 0 20px ${color}20`,
                  }}>
                  {step}
                  {i < HOW_IT_WORKS.length - 1 && (
                    <ArrowRight className="hidden md:block absolute -right-10 h-4 w-4 z-10"
                      style={{ color: "rgba(100,116,139,0.4)" }} />
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ───────────────────────── */}
        <section className="py-16 px-6" style={{ background: "rgba(255,255,255,0.01)" }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#a78bfa" }}>The Arsenal</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                <span className="text-white">Everything You Need to </span>
                <span className="shimmer-text">Dominate</span>
              </h2>
              <p className="text-lg max-w-xl mx-auto" style={{ color: "#64748b" }}>
                Production-grade systems under the hood. Feels like a game. Works like an OS.
              </p>
            </div>

            {/* Feature tabs */}
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {FEATURES.map((f, i) => (
                <button
                  key={f.title}
                  onClick={() => setActiveFeat(i)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
                  style={{
                    background: activeFeat === i ? `${f.accent}` : "rgba(255,255,255,0.03)",
                    borderColor: activeFeat === i ? f.border : "rgba(255,255,255,0.06)",
                    color: activeFeat === i ? "white" : "#64748b",
                  }}
                >
                  {f.title.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Feature detail (active) */}
            <div className="mb-12 rounded-3xl border p-8 md:p-12 transition-all"
              style={{ background: FEATURES[activeFeat].accent, borderColor: FEATURES[activeFeat].border }}>
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 border"
                    style={{ background: FEATURES[activeFeat].badgeColor, borderColor: FEATURES[activeFeat].border, color: FEATURES[activeFeat].badgeText }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: FEATURES[activeFeat].badgeText }} />
                    {FEATURES[activeFeat].tag}
                  </div>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: FEATURES[activeFeat].iconBg, color: FEATURES[activeFeat].badgeText }}>
                    {FEATURES[activeFeat].icon}
                  </div>
                  <h3 className="font-display text-3xl font-bold text-white mb-4">{FEATURES[activeFeat].title}</h3>
                  <p className="text-base leading-relaxed" style={{ color: "#94a3b8" }}>{FEATURES[activeFeat].desc}</p>
                  <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border"
                    style={{ background: FEATURES[activeFeat].badgeColor, borderColor: FEATURES[activeFeat].border, color: FEATURES[activeFeat].badgeText }}>
                    {FEATURES[activeFeat].badge}
                  </div>
                </div>
                <div>
                  <CodeSnippet code={FEATURES[activeFeat].snippet} />
                </div>
              </div>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  onClick={() => setActiveFeat(i)}
                  className="card-hover p-7 rounded-2xl border cursor-pointer relative overflow-hidden"
                  style={{
                    background: activeFeat === i ? f.accent : "rgba(255,255,255,0.02)",
                    borderColor: activeFeat === i ? f.border : "rgba(255,255,255,0.06)",
                  }}
                >
                  {activeFeat === i && (
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full animate-pulse"
                      style={{ background: f.badgeText }} />
                  )}
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: f.iconBg, color: f.badgeText }}>
                    {f.icon}
                  </div>
                  <div className="text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: f.badgeText }}>{f.tag}</div>
                  <h3 className="font-bold text-base text-white mb-2">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                    {f.desc.slice(0, 90)}…
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUEST REALMS ───────────────────── */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#38bdf8" }}>The Codelandia Atlas</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                <span className="text-white">Choose Your </span>
                <span style={{ color: "#38bdf8" }}>Realm</span>
              </h2>
              <p className="text-lg max-w-xl mx-auto" style={{ color: "#64748b" }}>
                Six worlds. Each with its own lore, boss, and algorithmic trials.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {REALMS.map((realm) => (
                <div
                  key={realm.name}
                  onClick={() => realm.status === "OPEN" && navigate("/login")}
                  className="card-hover relative rounded-2xl border overflow-hidden"
                  style={{
                    background: realm.bgColor,
                    borderColor: realm.borderColor,
                    cursor: realm.status === "OPEN" ? "pointer" : "not-allowed",
                    opacity: realm.status === "LOCKED" ? 0.65 : 1,
                  }}
                >
                  {realm.status === "LOCKED" && (
                    <div className="realm-lock-overlay">
                      <div className="text-center p-4">
                        <Lock className="h-8 w-8 mx-auto mb-2" style={{ color: realm.color, opacity: 0.7 }} />
                        <div className="text-xs font-bold" style={{ color: realm.color }}>{realm.requirement}</div>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{realm.icon}</div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full border"
                        style={{
                          background: realm.status === "OPEN" ? `${realm.color}15` : "rgba(100,116,139,0.15)",
                          borderColor: realm.status === "OPEN" ? `${realm.color}30` : "rgba(100,116,139,0.2)",
                          color: realm.status === "OPEN" ? realm.color : "#64748b",
                        }}>
                        {realm.status}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-white mb-1">{realm.name}</h3>
                    <p className="text-xs italic mb-4" style={{ color: "#64748b" }}>"{realm.lore}"</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: "#64748b" }}>Difficulty</span>
                        <span className="font-semibold" style={{ color: realm.color }}>{realm.difficulty}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: "#64748b" }}>Quests</span>
                        <span className="font-semibold text-white">{realm.quests} challenges</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: "#64748b" }}>Boss</span>
                        <span className="font-semibold" style={{ color: "#fb7185" }}>{realm.boss}</span>
                      </div>

                      {realm.status === "OPEN" && (
                        <div className="pt-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span style={{ color: "#64748b" }}>Community Progress</span>
                            <span className="font-semibold" style={{ color: realm.color }}>{realm.progress}%</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <div className="progress-bar-fill" style={{ width: `${realm.progress}%`, background: `linear-gradient(90deg, ${realm.color}80, ${realm.color})` }} />
                          </div>
                        </div>
                      )}
                    </div>

                    {realm.status === "OPEN" && (
                      <div className="mt-5 flex items-center gap-1.5 text-sm font-bold" style={{ color: realm.color }}>
                        Enter Realm <ChevronRight className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LIVE ACTIVITY + COMPARISON ─────── */}
        <section className="py-16 px-6" style={{ background: "rgba(255,255,255,0.015)" }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-start">

              {/* Live Activity Feed */}
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">Live Activity</span>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>Real-time</span>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {ACTIVITY_FEED.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-6 py-4 transition-all duration-500"
                      style={{
                        background: i === activityIndex ? "rgba(139,92,246,0.06)" : "transparent",
                        borderLeft: i === activityIndex ? "2px solid rgba(139,92,246,0.5)" : "2px solid transparent",
                      }}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                        style={{ background: `${item.color}20`, color: item.color }}>
                        {item.user.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white font-semibold truncate">
                          <span style={{ color: item.color }}>{item.user}</span>
                          <span className="font-normal text-slate-400 mx-1">{item.action}</span>
                          <span className="text-white">{item.detail}</span>
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: "#475569" }}>{item.time}</div>
                      </div>
                      <div className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                        style={{ background: `${item.color}15`, color: item.color }}>{item.xp}</div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-3 border-t text-center text-xs" style={{ borderColor: "rgba(255,255,255,0.04)", color: "#475569" }}>
                  Updated every few seconds · <span style={{ color: "#a78bfa" }}>1,204 submissions today</span>
                </div>
              </div>

              {/* vs Comparison Table */}
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <Target className="h-4 w-4" style={{ color: "#fb7185" }} />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">Why DSA-Quest?</span>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="col-span-1" />
                    <div className="text-center">
                      <div className="text-xs font-black uppercase tracking-wider px-2 py-1.5 rounded-lg"
                        style={{ background: "rgba(139,92,246,0.2)", color: "#a78bfa" }}>DSA-Quest</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-semibold uppercase tracking-wider px-2 py-1.5 rounded-lg"
                        style={{ background: "rgba(255,255,255,0.04)", color: "#475569" }}>LeetCode</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-semibold uppercase tracking-wider px-2 py-1.5 rounded-lg"
                        style={{ background: "rgba(255,255,255,0.04)", color: "#475569" }}>HackerRank</div>
                    </div>
                  </div>
                  {COMPARISON.map(({ feature, dsaquest, leetcode, hackerrank }) => (
                    <div key={feature} className="grid grid-cols-4 gap-2 py-3 border-t items-center"
                      style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                      <div className="text-xs col-span-1" style={{ color: "#94a3b8" }}>{feature}</div>
                      <div className="flex justify-center">
                        {dsaquest
                          ? <CheckCircle className="h-4 w-4" style={{ color: "#34d399" }} />
                          : <X className="h-4 w-4" style={{ color: "#475569" }} />}
                      </div>
                      <div className="flex justify-center">
                        {leetcode
                          ? <CheckCircle className="h-4 w-4" style={{ color: "#34d399" }} />
                          : <X className="h-4 w-4" style={{ color: "#475569" }} />}
                      </div>
                      <div className="flex justify-center">
                        {hackerrank
                          ? <CheckCircle className="h-4 w-4" style={{ color: "#34d399" }} />
                          : <X className="h-4 w-4" style={{ color: "#475569" }} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ───────────────────── */}
        <section className="py-16 px-6 border-y" style={{ background: "rgba(255,255,255,0.01)", borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#fb7185" }}>Hall of Warriors</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
                From the Community
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.handle}
                  className="testimonial-card card-hover p-7 rounded-2xl border relative overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
                >
                  <div className="quote-icon absolute top-5 right-5">
                    <MessageSquare className="h-6 w-6" style={{ color: "#7c3aed" }} />
                  </div>

                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-black"
                      style={{ background: t.avatarColor, color: "white" }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{t.name}</div>
                      <div className="text-xs" style={{ color: "#64748b" }}>{t.handle}</div>
                    </div>
                  </div>

                  <StarRating count={t.stars} />

                  <p className="mt-4 text-sm leading-relaxed" style={{ color: "#94a3b8" }}>"{t.text}"</p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs" style={{ color: "#64748b" }}>{t.role}</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa" }}>
                      {t.xp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ──────────────────────── */}
        <section className="relative py-24 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-25"
              style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.8) 0%, transparent 70%)" }} />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest"
              style={{ background: "rgba(139,92,246,0.1)", borderColor: "rgba(139,92,246,0.3)", color: "#a78bfa" }}>
              <Crown className="h-3.5 w-3.5" /> Join 12,400+ Algorithm Warriors
            </div>

            <h2 className="font-display leading-tight" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}>
              <span className="text-white">Ready to </span>
              <span className="shimmer-text">Level Up?</span>
            </h2>

            <p className="text-xl" style={{ color: "#64748b" }}>
              Earn XP. Unlock realms. Beat real opponents. Master DSA the way it was meant to be learned.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center justify-center gap-2 px-14 py-5 rounded-2xl text-lg font-bold transition-all"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #db2777)",
                  color: "white",
                  boxShadow: "0 0 60px rgba(139,92,246,0.6)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 100px rgba(139,92,246,0.9)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 60px rgba(139,92,246,0.6)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <Rocket className="h-6 w-6" /> Enter DSA-Quest — It's Free
              </button>
            </div>

            <p className="text-xs" style={{ color: "#475569" }}>
              No credit card required · Free tier includes Array Realm & Graph Kingdom
            </p>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────── */}
        <footer style={{ borderColor: "rgba(255,255,255,0.05)", background: "#05050d" }}>

          {/* Top gradient divider */}
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(219,39,119,0.4), transparent)" }} />

          {/* Mini ticker */}
          <div className="py-2 overflow-hidden border-b" style={{ borderColor: "rgba(255,255,255,0.04)", background: "rgba(139,92,246,0.04)" }}>
            <div className="ticker-inner text-[10px] font-semibold tracking-widest uppercase" style={{ color: "rgba(167,139,250,0.4)" }}>
              {"DSA-QUEST • Algorithm Wars • Code. Battle. Conquer. • Open Source • Neural Arena •".repeat(3)}
            </div>
          </div>

          {/* Main footer content */}
          <div className="max-w-7xl mx-auto px-8 pt-14 pb-0">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-14">

              {/* Brand — wider column */}
              <div className="md:col-span-4">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}>
                    <Code2 className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-black tracking-tight text-xl uppercase italic text-white">DSA-QUEST</span>
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "#475569", maxWidth: "300px" }}>
                  The ultimate gamified algorithm platform. Quest-based learning, real-time 1v1 battles, and an AI mentor that challenges without spoiling.
                </p>

                {/* Status pill */}
                <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl border w-fit mb-6"
                  style={{ borderColor: "rgba(52,211,153,0.2)", background: "rgba(52,211,153,0.05)", color: "#34d399" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  All systems operational
                </div>

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
                      title={label}
                      className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all hover:border-violet-500/50 hover:text-white"
                      style={{ borderColor: "rgba(255,255,255,0.08)", color: "#475569", background: "rgba(255,255,255,0.03)" }}
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
                      <Link to={to} className="text-sm transition-colors hover:text-white flex items-center gap-1.5 group"
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
                        className="text-sm transition-colors hover:text-white flex items-center gap-2 group"
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
                        className="text-sm transition-colors hover:text-white flex items-center gap-1.5 group"
                        style={{ color: "#64748b" }}>
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#fb7185" }} />
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter / mini CTA */}
              <div className="md:col-span-2">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-5 flex items-center gap-2"
                  style={{ color: "#fbbf24" }}>
                  <Activity className="h-3 w-3" /> Stay in the Loop
                </h4>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "#475569" }}>
                  Weekly drops: new quests, arena meta, and algorithm deep-dives.
                </p>
                <div className="flex flex-col gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 rounded-xl text-xs border outline-none transition-all focus:border-violet-500/50"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.08)",
                      color: "#e2e8f0",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  />
                  <button
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: "linear-gradient(135deg, rgba(124,58,237,0.5), rgba(219,39,119,0.5))",
                      color: "#e2e8f0",
                      border: "1px solid rgba(139,92,246,0.3)",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(124,58,237,0.8), rgba(219,39,119,0.8))"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(124,58,237,0.5), rgba(219,39,119,0.5))"; }}
                  >
                    Subscribe →
                  </button>
                </div>
              </div>
            </div>

            {/* Stat strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px border-t border-b"
              style={{ borderColor: "rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.04)" }}>
              {[
                { label: "Active Warriors", value: "12,400+", color: "#38bdf8" },
                { label: "Problems Solved", value: "1.2M+", color: "#a78bfa" },
                { label: "Avg Sandbox", value: "98ms", color: "#34d399" },
                { label: "Realms", value: "6 Worlds", color: "#fb7185" },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center py-5" style={{ background: "#05050d" }}>
                  <div className="text-lg font-black mb-0.5" style={{ color }}>{value}</div>
                  <div className="text-xs uppercase tracking-widest" style={{ color: "#334155" }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Bottom bar */}
            <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs" style={{ color: "#1e293b" }}>
                © 2026 DSA-Quest · Built for Algorithm Warriors · All rights reserved
              </p>
              <div className="flex items-center gap-6 text-xs" style={{ color: "#334155" }}>
                <a href="#" className="hover:text-white transition-colors" onClick={e => e.preventDefault()}>Privacy</a>
                <a href="#" className="hover:text-white transition-colors" onClick={e => e.preventDefault()}>Terms</a>
                <a href="#" className="hover:text-white transition-colors" onClick={e => e.preventDefault()}>Open Source</a>
                <a href="#" className="hover:text-white transition-colors" onClick={e => e.preventDefault()}>Status</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
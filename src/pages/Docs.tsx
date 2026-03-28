import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, Code2, Zap, ChevronRight, Shield, Brain, Sword, Map,
  BarChart2, Search, Terminal, GitBranch, Trophy, Clock, Cpu,
  Layers, AlertTriangle, CheckCircle, Hash, X, Menu, ExternalLink,
  ArrowRight, Star, Flame, Lock, Unlock, Globe, Activity
} from "lucide-react";

// ─── DATA ──────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: "getting-started",
    icon: <Zap className="h-4 w-4" />,
    color: "amber",
    title: "Getting Started",
    subtitle: "New here? Start with the basics.",
    articles: [
      {
        title: "Platform Overview",
        desc: "Understand the DSA-Quest architecture and how quests, battles, and XP work together to form a progression loop.",
        badge: "Beginner",
        readTime: "3 min",
        content: `DSA-Quest is a gamified competitive programming platform. It combines structured learning through Quests, 
                  real-time competition via the Code Wars Arena, and AI-powered mentorship to accelerate your growth.

**Core Loop**
1. Attempt a Quest → receive AI mentor guidance → submit solution
2. Earn XP and level up → unlock new Quest Realms
3. Battle opponents in the Arena → climb the ELO leaderboard

**Architecture**
The platform is a monorepo: a React + Vite frontend, a Node/Express API server, a Python execution sandbox 
running in Docker, and a WebSocket server for real-time Arena battles. All services are containerized and 
orchestrated via Docker Compose in development.`
      },
      {
        title: "Your First Quest",
        desc: "Step-by-step guide to attempting your first coding quest and submitting your solution.",
        badge: "Beginner",
        readTime: "5 min",
        content: `**Step 1 — Pick a Quest**
Navigate to Quests → Array Realm. Filter by Beginner difficulty. Select "Two Sum" to start.

**Step 2 — Read the Problem**
Each quest has a problem statement, constraints, and 3 example test cases. Read all of them before writing any code.

**Step 3 — Write Your Solution**
Use the built-in Monaco editor (same engine as VS Code). Choose Python, JavaScript, or C++.

**Step 4 — Ask the AI Mentor**
Stuck? Click the Mentor tab. The AI uses Socratic questioning — it will not give you the answer but will ask guiding questions based on your current code.

**Step 5 — Submit**
Click Run to test against examples. Click Submit to evaluate against all 50+ hidden test cases. Your solution runs in an isolated Docker container with a 5s timeout.`
      },
      {
        title: "Understanding XP & Levels",
        desc: "Learn the XP formula: (BaseXP × Difficulty) + TimeBonus + AIScore, and the L = sqrt(XP/100) leveling system.",
        badge: "Beginner",
        readTime: "4 min",
        content: `**XP Formula**
\`\`\`
XP = (BaseXP × DifficultyMultiplier) + TimeBonus + AIScore
\`\`\`
- **BaseXP**: Easy=100, Medium=250, Hard=500, Expert=1000
- **DifficultyMultiplier**: 1.0× to 2.5× based on first-attempt rate
- **TimeBonus**: Up to 50 XP for sub-10-minute solves
- **AIScore**: 0–100 based on code quality (cyclomatic complexity, naming, Big-O)

**Leveling Formula**
\`\`\`
Level = floor(sqrt(TotalXP / 100))
\`\`\`
So Level 1 requires 100 XP, Level 10 requires 10,000 XP, Level 50 requires 250,000 XP.

**Streak Bonuses**
Solve at least one quest per day to maintain your streak. Active streaks grant a 1.1× XP multiplier per 7-day block, capped at 2.0× at 70 days.`
      },
      {
        title: "Navigation & Dashboard",
        desc: "A tour of every panel in your dashboard: quest history, XP graph, skill heatmap, and active battles.",
        badge: "Beginner",
        readTime: "3 min",
        content: `**Dashboard Panels**
- **XP Timeline**: A sparkline of your XP earned over the last 30 days. Click to expand into a full chart.
- **Skill Heatmap**: Color intensity per topic (Arrays, Graphs, DP, etc.) based on quests solved. Red = needs work.
- **Recent Activity**: Last 10 submissions with pass rate and XP earned.
- **Active Battle**: If you're in the Arena queue, the battle widget appears here. You can navigate away — it won't disconnect.

**Profile Page**
Your public profile shows your Level, ELO rating, quest count, and a skill breakdown radar chart.`
      },
    ]
  },
  {
    id: "ai-mentor",
    icon: <Brain className="h-4 w-4" />,
    color: "violet",
    title: "AI Mentor System",
    subtitle: "Guidance without spoilers.",
    articles: [
      {
        title: "How the Socratic Mentor Works",
        desc: "The AI never gives you the answer. It uses Gemini to ask guiding questions, powered by your code's AST analysis.",
        badge: "Core",
        readTime: "6 min",
        content: `**Philosophy**
The mentor is designed around the Socratic method: it responds to your code by asking questions that guide your own thinking. It will not write code for you or state the correct algorithm.

**Pipeline**
1. You write code in the editor
2. A syntax-safe AST parser extracts: loop depth, recursion calls, data structures used, variable naming patterns
3. The AST summary + your code + the problem statement are sent to Gemini Flash
4. Gemini generates 2–3 guiding questions and 1 optional "nudge hint"
5. Response is streamed back and rendered in the Mentor panel

**Example Interaction**
\`\`\`
You: *submits O(n²) brute force for Two Sum*
Mentor: "Your current approach checks every pair. What data structure 
could let you look up the complement of a number in O(1) time?"
\`\`\``
      },
      {
        title: "Reading AI Feedback",
        desc: "Understanding the mentor panel: Insights, Strategic Hints, Complexity Analysis, and Quality Score.",
        badge: "Core",
        readTime: "4 min",
        content: `**Mentor Panel Tabs**

- **Insights**: High-level observations about your approach. e.g., "You're iterating the array twice — can you do it in one pass?"
- **Strategic Hints**: Progressively more specific nudges. Costs 10 XP to reveal each additional hint.
- **Complexity Analysis**: Automatic Big-O analysis of your submission. Time and space complexity with an explanation.
- **Quality Score**: 0–100 score based on: variable naming (20pts), function decomposition (20pts), comments (10pts), cyclomatic complexity (30pts), edge case handling (20pts).

**Quality Score Thresholds**
- 0–49: Needs Improvement
- 50–74: Acceptable
- 75–89: Good
- 90–100: Excellent (bonus XP awarded)`
      },
      {
        title: "AST Analysis Explained",
        desc: "How your code is parsed for loop depth, recursion patterns, and data structures before being sent to the AI.",
        badge: "Advanced",
        readTime: "7 min",
        content: `**What is AST Analysis?**
An Abstract Syntax Tree (AST) represents your code as a tree of nodes. We use language-specific parsers: \`acorn\` for JavaScript, \`ast\` module for Python, \`libclang\` for C++.

**Extracted Signals**
\`\`\`json
{
  "maxLoopDepth": 2,
  "hasRecursion": false,
  "dataStructures": ["dict", "list"],
  "functionCount": 1,
  "averageIdentifierLength": 4.2,
  "cyclomaticComplexity": 6
}
\`\`\`
These signals inform the AI without sending your full code verbatim for every keystroke (we debounce at 2s).

**Why Not Just Send Raw Code?**
Token efficiency + privacy. The AST summary is ~50 tokens vs. potentially 500+ tokens for verbose code. It also lets us give better structural hints.`
      },
      {
        title: "Mentor Limitations & Edge Cases",
        desc: "What the AI mentor can't do, known failure modes, and how to report bad mentor responses.",
        badge: "Advanced",
        readTime: "3 min",
        content: `**Known Limitations**
- The mentor does not have memory across different quests. Each session is independent.
- Very short code snippets (< 5 lines) may produce generic guidance due to low AST signal.
- Highly obfuscated code (single-char variable names throughout) will score low on Quality but still receive hints.

**Reporting Bad Responses**
If the mentor gives an incorrect hint or reveals too much, click the ⚑ flag icon in the mentor panel. Include a brief description. Flagged interactions are reviewed weekly and used to fine-tune our system prompt.

**Rate Limits**
Free tier: 20 mentor queries/day. Pro tier: unlimited.`
      },
    ]
  },
  {
    id: "code-wars",
    icon: <Sword className="h-4 w-4" />,
    color: "rose",
    title: "Code Wars Arena",
    subtitle: "Real-time 1v1 coding battles.",
    articles: [
      {
        title: "Matchmaking & ELO",
        desc: "How the ELO rating system works: expectedScore = 1/(1+10^((RB-RA)/400)) and the K-factor update rules.",
        badge: "Core",
        readTime: "5 min",
        content: `**ELO Rating System**
\`\`\`
Expected Score (A) = 1 / (1 + 10^((RatingB - RatingA) / 400))
New Rating (A) = RatingA + K × (Actual - Expected)
\`\`\`
- **K-factor**: 32 for players under 2100, 16 for 2100–2400, 12 for 2400+
- **Starting ELO**: All players begin at 1200
- **Win condition**: First to pass all test cases, OR highest pass rate when time expires (20 min default)

**Matchmaking**
Queue matches you with opponents within ±100 ELO. If no match in 60s, the range expands by 50 ELO/30s. After 5 minutes of waiting, you're matched with the closest available opponent regardless of rating.

**Provisional Period**
First 10 matches are "provisional." ELO swings are doubled (2× K-factor) to calibrate you faster.`
      },
      {
        title: "Battle Spells",
        desc: "Guide to the 3 available spells: Lag Spike, Syntax Fog, and Screen Flip — costs and strategic usage.",
        badge: "Core",
        readTime: "4 min",
        content: `**Available Spells**
Each battle gives you 3 mana. Spells can only be used once per battle.

| Spell | Cost | Effect | Duration |
|-------|------|--------|----------|
| ⚡ Lag Spike | 1 mana | Opponent's editor freezes for 8s | One-time |
| 🌫️ Syntax Fog | 2 mana | Opponent's code turns to ░ for 12s | One-time |
| 🔄 Screen Flip | 1 mana | Opponent's editor flips horizontally for 10s | One-time |

**Strategic Tips**
- Save Syntax Fog for when the opponent is actively typing a critical section.
- Lag Spike is most effective in the final 2 minutes when submission timing matters.
- Screen Flip is a psychological tool — it's less impactful than it seems, but causes panic.

**Countermeasures**
You can purchase the "Focus Shield" consumable from the shop (costs 500 coins) to block one spell per battle.`
      },
      {
        title: "WebSocket Events Reference",
        desc: "How MATCH_FOUND, CODE_UPDATE, and WIN events power real-time battle state synchronization.",
        badge: "Advanced",
        readTime: "6 min",
        content: `**Client → Server Events**
\`\`\`js
socket.emit('joinQueue', { userId, eloRating })
socket.emit('updateProgress', { roomId, passRate, linesOfCode })
socket.emit('sendAttack', { roomId, spellType, targetId })
socket.emit('submitSolution', { roomId, code, language })
\`\`\`

**Server → Client Events**
\`\`\`js
socket.on('MATCH_FOUND', ({ roomId, opponent, problem }))
socket.on('CODE_UPDATE', ({ userId, passRate }))   // throttled 2/s
socket.on('SPELL_RECEIVED', ({ spellType, duration }))
socket.on('WIN', ({ winnerId, eloChange, xpEarned }))
socket.on('OPPONENT_DISCONNECTED', ({ grace: 60 })) // 60s reconnect window
\`\`\``
      },
      {
        title: "Ranked Seasons & Rewards",
        desc: "How seasonal resets work, rank tiers (Bronze → Grandmaster), and exclusive cosmetic rewards.",
        badge: "Guide",
        readTime: "4 min",
        content: `**Rank Tiers**
| Tier | ELO Range | Icon |
|------|-----------|------|
| Bronze | 0 – 1199 | 🥉 |
| Silver | 1200 – 1499 | 🥈 |
| Gold | 1500 – 1799 | 🥇 |
| Platinum | 1800 – 2099 | 💎 |
| Diamond | 2100 – 2399 | 🔷 |
| Grandmaster | 2400+ | 👑 |

**Season Schedule**
Seasons last 3 months. At reset, ELO is soft-reset: new ELO = 1200 + (OldELO - 1200) × 0.5.

**Season Rewards**
- Top 500 players receive an exclusive animated profile border
- Top 100 receive a custom in-editor theme
- Top 10 receive their username featured on the Hall of Fame page permanently`
      },
    ]
  },
  {
    id: "quest-realms",
    icon: <Map className="h-4 w-4" />,
    color: "sky",
    title: "Quest Realms",
    subtitle: "Structured paths through DSA.",
    articles: [
      {
        title: "Realm Progression Guide",
        desc: "How to unlock locked realms: Array Realm → String Forest → Graph Kingdom → DP Mountains.",
        badge: "Guide",
        readTime: "4 min",
        content: `**Unlock Requirements**
| Realm | Prerequisite | Min Level |
|-------|-------------|-----------|
| Array Realm | None | 1 |
| String Forest | 12 Array quests cleared | 5 |
| Graph Kingdom | 8 String quests cleared | 10 |
| DP Mountains | 10 Graph quests cleared | 15 |
| Advanced Algorithms | DP Mountains 100% | 20 |

**Realm Stars**
Each quest awards 1–3 stars based on: pass rate (all tests), time taken, and code quality score. A realm is "mastered" when all quests have 3 stars.

**Mastery Bonuses**
Mastering a realm gives: a permanent +5% XP bonus for that topic in future battles + an exclusive realm badge on your profile.`
      },
      {
        title: "Array Realm Problems",
        desc: "Complete list of all 24 quests in the Array Realm, sorted by difficulty.",
        badge: "Guide",
        readTime: "5 min",
        content: `**Easy (8 quests)**
1. Two Sum | 2. Best Time to Buy/Sell Stock | 3. Contains Duplicate
4. Maximum Subarray (Kadane's) | 5. Product of Array Except Self
6. Maximum Product Subarray | 7. Find Min in Rotated Sorted Array
8. Search in Rotated Sorted Array

**Medium (10 quests)**
9. 3Sum | 10. Container With Most Water | 11. Trapping Rain Water
12. Spiral Matrix | 13. Rotate Image | 14. Set Matrix Zeroes
15. Merge Intervals | 16. Insert Interval | 17. Non-overlapping Intervals
18. Meeting Rooms II

**Hard (6 quests)**
19. Sliding Window Maximum | 20. First Missing Positive
21. Largest Rectangle in Histogram | 22. Median of Two Sorted Arrays
23. Count of Smaller Numbers After Self | 24. Reverse Pairs`
      },
      {
        title: "Graph Kingdom Problems",
        desc: "Overview of DFS, BFS, Dijkstra, and graph traversal challenges in the Graph Kingdom realm.",
        badge: "Advanced",
        readTime: "6 min",
        content: `**Core Concepts Tested**
- DFS (recursive + iterative)
- BFS and level-order traversal  
- Union-Find / Disjoint Set Union
- Dijkstra's shortest path
- Bellman-Ford (negative weights)
- Topological Sort (Kahn's + DFS)
- Tarjan's SCC & articulation points

**Notable Quests**
- **Island Cartographer**: Count islands using DFS — the classic warmup.
- **The Shortest Pilgrim**: Single-source shortest path with Dijkstra.
- **Kingdom Dependencies**: Detect cycles in a directed graph via topological sort.
- **The Bridge Finder**: Find articulation points in an undirected graph.
- **Chromatic Conquest**: Graph coloring / bipartite check.`
      },
      {
        title: "DP Mountains Guide",
        desc: "Patterns covered in the DP Mountains realm: 1D DP, 2D DP, interval DP, and bitmask DP.",
        badge: "Advanced",
        readTime: "7 min",
        content: `**DP Pattern Taxonomy**

**1D DP** — Fibonacci, Climbing Stairs, House Robber, Longest Increasing Subsequence

**2D DP** — Edit Distance, Longest Common Subsequence, Unique Paths, Coin Change II

**Interval DP** — Matrix Chain Multiplication, Burst Balloons, Minimum Cost to Cut a Stick

**Knapsack Variants** — 0/1 Knapsack, Unbounded Knapsack, Partition Equal Subset Sum

**Bitmask DP** — Travelling Salesman (small n), Minimum XOR Sum of Two Arrays

**Recommended Order**
Tackle patterns in the order listed. Each quest page shows which pattern it exercises. Use the pattern filter on the Realm page to focus your practice.`
      },
    ]
  },
  {
    id: "security",
    icon: <Shield className="h-4 w-4" />,
    color: "emerald",
    title: "Execution Sandbox",
    subtitle: "Safe, isolated code execution.",
    articles: [
      {
        title: "Docker Sandbox Architecture",
        desc: "Code runs in isolated containers: 128MB RAM, 0.5 CPU, no network, 5s timeout.",
        badge: "Tech",
        readTime: "5 min",
        content: `**Container Spec**
\`\`\`yaml
image: dsa-quest/runner:latest
mem_limit: 128m
cpus: 0.5
network_mode: none
read_only: true
tmpfs: /tmp:size=32m
pids_limit: 64
\`\`\`

**Execution Flow**
1. API receives code + language + test cases
2. A new container is spawned from a warm pool (pre-warmed for <50ms startup)
3. Code is injected via stdin, test runner executes it against each case
4. stdout/stderr are captured, container is destroyed
5. Results (pass/fail per case, runtime, memory peak) returned in <1s typically

**Cold Start Mitigation**
We maintain a pool of 20 warm containers per language at all times, recycled every 5 minutes.`
      },
      {
        title: "Supported Languages",
        desc: "Python, JavaScript, C++ — with planned support for Java and Go.",
        badge: "Tech",
        readTime: "3 min",
        content: `**Currently Supported**
| Language | Version | Runtime |
|----------|---------|---------|
| Python | 3.12 | CPython |
| JavaScript | ES2023 | Node 20 LTS |
| C++ | C++20 | GCC 13 |

**Planned (Q3 2025)**
- Java 21 (OpenJDK)
- Go 1.22
- Rust 1.78

**Language-Specific Notes**
- Python: \`numpy\` and \`collections\` are available. No \`subprocess\` or \`os\` module access.
- JavaScript: No \`fs\`, \`net\`, or \`child_process\` modules.
- C++: STL fully available. Compilation timeout is separate (10s limit).`
      },
      {
        title: "Security Model",
        desc: "How malicious code, infinite loops, and privilege escalation attempts are prevented.",
        badge: "Advanced",
        readTime: "6 min",
        content: `**Threat Mitigations**

| Threat | Mitigation |
|--------|------------|
| Infinite loops | 5s wall-clock timeout + SIGKILL |
| Memory exhaustion | 128MB hard limit via cgroups |
| Fork bombs | pids_limit: 64 |
| Network exfiltration | network_mode: none |
| Filesystem writes | Read-only root, tmpfs /tmp |
| Privilege escalation | User: nobody (UID 65534), no capabilities |
| Container escape | Seccomp profile blocks 200+ syscalls |

**Banned Syscalls (sample)**
\`ptrace\`, \`mount\`, \`unshare\`, \`clone\` (with CLONE_NEWUSER), \`keyctl\`, \`bpf\`

**Audit Logging**
All container executions are logged with userId, timestamp, language, and a SHA256 of the submitted code for incident investigation.`
      },
    ]
  },
  {
    id: "api",
    icon: <BarChart2 className="h-4 w-4" />,
    color: "pink",
    title: "API Reference",
    subtitle: "Build on DSA-Quest.",
    articles: [
      {
        title: "REST Endpoints",
        desc: "Full reference for /api/quests, /api/submissions, /api/auth — with request/response schemas.",
        badge: "Tech",
        readTime: "8 min",
        content: `**Base URL**: \`https://api.dsa-quest.io/v1\`

**Auth**
All endpoints require \`Authorization: Bearer <token>\` except \`/auth/*\`.

**GET /quests**
\`\`\`
Query params: realm, difficulty, tag, limit, offset
Response: { quests: Quest[], total: number }
\`\`\`

**POST /submissions**
\`\`\`json
{
  "questId": "q_abc123",
  "code": "def twoSum(nums, target):...",
  "language": "python"
}
Response: { submissionId, status, results, xpEarned, timeTaken }
\`\`\`

**GET /users/:id/stats**
\`\`\`
Response: { level, xp, elo, streak, questsSolved, skillHeatmap }
\`\`\``
      },
      {
        title: "WebSocket Events",
        desc: "All socket events: joinQueue, joinRoom, updateProgress, sendAttack, battleFinished.",
        badge: "Tech",
        readTime: "5 min",
        content: `**Connection**
\`\`\`js
const socket = io('wss://arena.dsa-quest.io', {
  auth: { token: 'your_jwt_here' }
})
\`\`\`

**Full Event Reference**
\`\`\`
joinQueue       → queued | MATCH_FOUND
leaveQueue      → dequeued
updateProgress  → (broadcast to room)
sendAttack      → SPELL_RECEIVED (opponent)
submitSolution  → SOLUTION_RESULT | WIN
forfeit         → WIN (opponent) + ELO penalty
\`\`\`

**Reconnection**
If disconnected mid-battle, reconnect within 60s using the same JWT. The server maintains battle state. After 60s, the opponent wins by default.`
      },
      {
        title: "Authentication",
        desc: "JWT-based auth flow — how to generate, validate, and refresh tokens.",
        badge: "Tech",
        readTime: "4 min",
        content: `**Token Lifecycle**
\`\`\`
POST /auth/login → { accessToken (15min), refreshToken (7d) }
POST /auth/refresh → { accessToken (15min) }
POST /auth/logout → invalidates refreshToken
\`\`\`

**Token Structure (JWT payload)**
\`\`\`json
{
  "sub": "user_abc123",
  "role": "user",
  "tier": "pro",
  "iat": 1710000000,
  "exp": 1710000900
}
\`\`\`

**OAuth Providers**
GitHub and Google OAuth are supported. After OAuth, the same JWT pair is issued. Link multiple providers in Settings → Linked Accounts.`
      },
      {
        title: "Rate Limits & Quotas",
        desc: "Per-endpoint rate limits, burst allowances, and the X-RateLimit headers returned with every response.",
        badge: "Tech",
        readTime: "3 min",
        content: `**Rate Limits by Tier**
| Endpoint | Free | Pro |
|----------|------|-----|
| POST /submissions | 20/hr | 200/hr |
| GET /quests | 100/min | 1000/min |
| Mentor queries | 20/day | Unlimited |
| Arena battles | 10/day | 50/day |

**Response Headers**
\`\`\`
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 17
X-RateLimit-Reset: 1710001200
\`\`\`

**429 Response Body**
\`\`\`json
{ "error": "rate_limit_exceeded", "retryAfter": 1800 }
\`\`\``
      },
    ]
  },
  {
    id: "contribute",
    icon: <GitBranch className="h-4 w-4" />,
    color: "sky",
    title: "Open Source",
    subtitle: "Help us build DSA-Quest.",
    articles: [
      {
        title: "Contribution Guide",
        desc: "How to clone the repo, set up the Docker sandbox, and submit PRs for new quests.",
        badge: "Guide",
        readTime: "6 min",
        content: `**Repo Structure**
\`\`\`
dsa-quest/
├── apps/
│   ├── web/          (React + Vite)
│   └── api/          (Node + Express)
├── packages/
│   ├── runner/       (Python sandbox)
│   └── shared/       (types, utils)
└── docker-compose.yml
\`\`\`

**Setup**
\`\`\`bash
git clone https://github.com/dsa-quest/dsa-quest
cd dsa-quest
cp .env.example .env
docker compose up --build
\`\`\`
Frontend on :5173, API on :3001, Studio on :5555.

**Adding a New Quest**
Create \`packages/quests/src/array/my-quest.ts\` following the Quest schema. Run \`pnpm validate-quest\` to check your test cases, then open a PR.`
      },
      {
        title: "Local Development",
        desc: "Step-by-step instructions for running the frontend and backend with hot-reload.",
        badge: "Guide",
        readTime: "4 min",
        content: `**Without Docker (faster iteration)**
\`\`\`bash
# Terminal 1 — API
cd apps/api && pnpm dev      # nodemon, port 3001

# Terminal 2 — Web
cd apps/web && pnpm dev      # Vite HMR, port 5173

# Terminal 3 — Runner (needs Docker)
docker compose up runner
\`\`\`

**Environment Variables**
\`\`\`
GEMINI_API_KEY=...         # AI mentor
DATABASE_URL=postgresql://...
JWT_SECRET=...
RUNNER_URL=http://localhost:8080
\`\`\`

**Seeding Test Data**
\`\`\`bash
cd apps/api && pnpm db:seed
\`\`\`
Seeds 5 test users, all quests, and 100 fake submissions.`
      },
      {
        title: "Reporting Issues",
        desc: "Found a bug in our AI mentor or execution sandbox? Open an issue on our GitHub.",
        badge: "Guide",
        readTime: "2 min",
        content: `**Bug Reports**
Use the GitHub issue template. Include:
- Browser + OS
- Steps to reproduce
- Expected vs actual behavior
- Console errors (F12 → Console)

**Security Vulnerabilities**
Do NOT open a public GitHub issue for security bugs. Email security@dsa-quest.io with details. We aim to respond within 24h and will credit you in our security hall of fame.

**Feature Requests**
Open a Discussion (not an Issue) on GitHub. Feature requests with 10+ 👍 reactions are added to our public roadmap.`
      },
    ]
  },
];

const COLOR_MAP: Record<string, { text: string; bg: string; border: string; glow: string; badge: string }> = {
  amber:   { text: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/20",  glow: "shadow-amber-500/20",  badge: "from-amber-500/20 to-amber-500/5 border-amber-500/30" },
  violet:  { text: "text-violet-400",  bg: "bg-violet-400/10",  border: "border-violet-400/20", glow: "shadow-violet-500/20", badge: "from-violet-500/20 to-violet-500/5 border-violet-500/30" },
  rose:    { text: "text-rose-400",    bg: "bg-rose-400/10",    border: "border-rose-400/20",   glow: "shadow-rose-500/20",   badge: "from-rose-500/20 to-rose-500/5 border-rose-500/30" },
  sky:     { text: "text-sky-400",     bg: "bg-sky-400/10",     border: "border-sky-400/20",    glow: "shadow-sky-500/20",    badge: "from-sky-500/20 to-sky-500/5 border-sky-500/30" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20",glow: "shadow-emerald-500/20",badge: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30" },
  pink:    { text: "text-pink-400",    bg: "bg-pink-400/10",    border: "border-pink-400/20",   glow: "shadow-pink-500/20",   badge: "from-pink-500/20 to-pink-500/5 border-pink-500/30" },
};

const BADGE_STYLE: Record<string, string> = {
  Beginner: "text-emerald-300 bg-emerald-400/10 border-emerald-400/25",
  Core:     "text-violet-300 bg-violet-400/10 border-violet-400/25",
  Advanced: "text-rose-300 bg-rose-400/10 border-rose-400/25",
  Guide:    "text-sky-300 bg-sky-400/10 border-sky-400/25",
  Tech:     "text-amber-300 bg-amber-400/10 border-amber-400/25",
};

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function ArticleModal({ article, section, onClose }: { article: any; section: any; onClose: () => void }) {
  const c = COLOR_MAP[section.color];
  const lines = (article.content as string).split('\n');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const renderContent = (text: string) => {
    const blocks = text.split('\n\n');
    return blocks.map((block, bi) => {
      if (block.startsWith('\`\`\`')) {
        const codeContent = block.replace(/\`\`\`[a-z]*\n?/, '').replace(/\`\`\`$/, '');
        return (
          <div key={bi} className="my-4 rounded-xl overflow-hidden border border-white/10">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10">
              <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono">code</span>
            </div>
            <pre className="p-4 text-sm font-mono text-emerald-300 overflow-x-auto bg-black/30">{codeContent.trim()}</pre>
          </div>
        );
      }
      if (block.startsWith('**') && block.endsWith('**') && !block.includes('\\n')) {
        return <h3 key={bi} className="text-base font-black text-white mt-6 mb-2">{block.replace(/\\*\\*/g, '')}</h3>;
      }
      // Table detection
      if (block.includes('|')) {
        const rows = block.split('\\n').filter(r => r.trim() && !r.match(/^\\|[-| ]+\\|$/));
        return (
          <div key={bi} className="my-4 overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-sm">
              {rows.map((row, ri) => {
                const cells = row.split('|').filter(c => c.trim());
                return (
                  <tr key={ri} className={ri === 0 ? "bg-white/5" : "border-t border-white/5 hover:bg-white/[0.02]"}>
                    {cells.map((cell, ci) => (
                      ri === 0
                        ? <th key={ci} className="px-4 py-2.5 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">{cell.trim()}</th>
                        : <td key={ci} className="px-4 py-2.5 font-mono text-xs text-slate-300">{cell.trim()}</td>
                    ))}
                  </tr>
                );
              })}
            </table>
          </div>
        );
      }
      const parsedLine = block.replace(/\\*\\*(.*?)\\*\\*/g, '<strong class="text-white font-bold">$1</strong>');
      return <p key={bi} className="text-sm text-slate-400 leading-7 my-2" dangerouslySetInnerHTML={{ __html: parsedLine }} />;
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full md:max-w-2xl md:rounded-2xl bg-[#0d0d14] border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 border-b border-white/5 bg-gradient-to-r ${c.badge}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-black uppercase tracking-widest ${c.text}`}>{section.title}</span>
              </div>
              <h2 className="text-xl font-black text-white">{article.title}</h2>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${BADGE_STYLE[article.badge]}`}>{article.badge}</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{article.readTime} read</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors flex-shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {renderContent(article.content)}
        </div>
      </div>
    </div>
  );
}

function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [val, setVal] = useState('');
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        value={val}
        onChange={e => { setVal(e.target.value); onSearch(e.target.value); }}
        placeholder="Search docs..."
        className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all"
      />
      {val && (
        <button onClick={() => { setVal(''); onSearch(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

const Docs = () => {
  const [active, setActive] = useState("getting-started");
  const [openArticle, setOpenArticle] = useState<{ article: any; section: any } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeSection = SECTIONS.find(s => s.id === active)!;
  const c = COLOR_MAP[activeSection.color];

  const filteredSections = searchQuery
    ? SECTIONS.map(s => ({
        ...s,
        articles: s.articles.filter(a =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(s => s.articles.length > 0)
    : null;

  const totalArticles = SECTIONS.reduce((acc, s) => acc + s.articles.length, 0);

  return (
    <div className="min-h-screen bg-[#080810] text-foreground flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,900;1,9..40,900&family=JetBrains+Mono:wght@400;600&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        code, pre, .font-mono { font-family: 'JetBrains Mono', monospace; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .article-card { transition: all 0.2s ease; }
        .article-card:hover { transform: translateY(-1px); }
        .sidebar-btn { transition: all 0.15s ease; }
        .grid-bg {
          background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#080810]/80 backdrop-blur-2xl border-b border-white/[0.06]">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Code2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight uppercase italic text-white">DSA-Quest</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-muted-foreground">
          {["Quests", "Arena", "Leaderboard"].map(label => (
            <Link key={label} to={`/explore/${label.toLowerCase()}`} className="hover:text-white transition-colors">{label}</Link>
          ))}
          <Link to="/explore/docs" className="text-sky-400">Docs</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <button className="hidden md:flex px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-500 rounded-lg font-bold text-sm text-white hover:opacity-90 transition-opacity">
              Dashboard
            </button>
          </Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-muted-foreground hover:text-white">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      <div className="flex pt-[57px] min-h-screen">
        {/* Sidebar */}
        <aside className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex w-64 flex-col fixed top-[57px] left-0 bottom-0 z-40 border-r border-white/[0.06] bg-[#080810]/95 backdrop-blur-xl overflow-y-auto`}>
          <div className="p-4 space-y-4">
            <SearchBar onSearch={setSearchQuery} />
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Sections</span>
              <span className="text-xs text-muted-foreground">{totalArticles} articles</span>
            </div>
          </div>
          <nav className="px-3 pb-6 space-y-0.5">
            {SECTIONS.map((s) => {
              const sc = COLOR_MAP[s.color];
              const isActive = active === s.id && !searchQuery;
              return (
                <button
                  key={s.id}
                  onClick={() => { setActive(s.id); setSearchQuery(''); setMobileMenuOpen(false); }}
                  className={`sidebar-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left ${
                    isActive
                      ? `${sc.bg} ${sc.text} ${sc.border} border`
                      : "text-muted-foreground hover:bg-white/[0.04] hover:text-white border border-transparent"
                  }`}
                >
                  <span className={isActive ? sc.text : "text-muted-foreground"}>{s.icon}</span>
                  <span>{s.title}</span>
                  <span className="ml-auto text-xs opacity-50">{s.articles.length}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 md:ml-64 min-h-screen">
          {searchQuery && filteredSections ? (
            // Search results
            <div className="max-w-3xl mx-auto px-8 py-12">
              <div className="mb-8">
                <h1 className="text-2xl font-black text-white mb-1">Search results for "{searchQuery}"</h1>
                <p className="text-sm text-muted-foreground">{filteredSections.reduce((a, s) => a + s.articles.length, 0)} articles found</p>
              </div>
              <div className="space-y-8">
                {filteredSections.map(section => {
                  const sc = COLOR_MAP[section.color];
                  return (
                    <div key={section.id}>
                      <div className={`flex items-center gap-2 mb-3 text-sm font-black uppercase tracking-wider ${sc.text}`}>
                        <span className={sc.text}>{section.icon}</span> {section.title}
                      </div>
                      <div className="space-y-3">
                        {section.articles.map((a, i) => (
                          <ArticleCard key={i} article={a} section={section} onClick={() => setOpenArticle({ article: a, section })} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Section view
            <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
              {/* Section header */}
              <div className={`mb-10 p-8 rounded-2xl border bg-gradient-to-br ${c.badge} grid-bg relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${c.bg} opacity-40 -translate-y-4 translate-x-4`} />
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${c.bg} ${c.border} border mb-4 shadow-lg ${c.glow}`}>
                    <span className={c.text}>{activeSection.icon}</span>
                  </div>
                  <h1 className="text-3xl font-black text-white mb-1">{activeSection.title}</h1>
                  <p className="text-muted-foreground text-sm">{activeSection.subtitle}</p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" />{activeSection.articles.length} articles</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {activeSection.articles.reduce((acc, a) => acc + parseInt(a.readTime), 0)} min total
                    </span>
                  </div>
                </div>
              </div>

              {/* Articles */}
              <div className="space-y-3">
                {activeSection.articles.map((a, i) => (
                  <ArticleCard key={i} article={a} section={activeSection} onClick={() => setOpenArticle({ article: a, section: activeSection })} />
                ))}
              </div>

              {/* Bottom nav */}
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/[0.06]">
                {(() => {
                  const idx = SECTIONS.findIndex(s => s.id === active);
                  const prev = SECTIONS[idx - 1];
                  const next = SECTIONS[idx + 1];
                  return (
                    <>
                      {prev ? (
                        <button onClick={() => setActive(prev.id)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors group">
                          <ArrowRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                          <div className="text-left">
                            <div className="text-xs opacity-60 mb-0.5">Previous</div>
                            <div className="font-semibold">{prev.title}</div>
                          </div>
                        </button>
                      ) : <div />}
                      {next && (
                        <button onClick={() => setActive(next.id)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors group">
                          <div className="text-right">
                            <div className="text-xs opacity-60 mb-0.5">Next</div>
                            <div className="font-semibold">{next.title}</div>
                          </div>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Article Modal */}
      {openArticle && (
        <ArticleModal
          article={openArticle.article}
          section={openArticle.section}
          onClose={() => setOpenArticle(null)}
        />
      )}

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
};

function ArticleCard({ article, section, onClick }: { article: any; section: any; onClick: () => void }) {
  const c = COLOR_MAP[section.color];
  return (
    <div
      onClick={onClick}
      className="article-card p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.14] cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="font-black text-[15px] text-slate-200 group-hover:text-white transition-colors">{article.title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${BADGE_STYLE[article.badge]}`}>
              {article.badge}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{article.desc}</p>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className={`p-1.5 rounded-lg ${c.bg} ${c.border} border group-hover:scale-110 transition-transform`}>
            <ChevronRight className={`h-3.5 w-3.5 ${c.text}`} />
          </div>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap">
            <Clock className="h-3 w-3" />{article.readTime}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Docs;
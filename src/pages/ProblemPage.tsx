import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { RootState } from '@/store';
import { completeQuest } from '@/store/questSlice';
import { updateXP, logout } from '@/store/authSlice';
import { Zap, LogOut, Play, Send, ArrowLeft, ChevronDown, Brain, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';

const languageDefaults: Record<string, string> = {
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}\n',
  java: 'import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}\n',
  python: '# Your code here\n\ndef solve():\n    pass\n\nsolve()\n',
};

const monacoLang: Record<string, string> = { cpp: 'cpp', java: 'java', python: 'python' };

const ProblemPage = () => {
  const { id } = useParams<{ id: string }>();
  const { realms } = useSelector((state: RootState) => state.quest);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const quest = realms.flatMap(r => r.quests).find(q => q.id === id);

  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(languageDefaults.cpp);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [aiFeedback, setAiFeedback] = useState<{ complexity: string; issues: string[]; hints: string[] } | null>(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleLangChange = useCallback((lang: string) => {
    setLanguage(lang);
    setCode(languageDefaults[lang]);
    setShowLangMenu(false);
  }, []);

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    await new Promise(r => setTimeout(r, 1200));
    setOutput(`Test Case 1: ✅ Passed\nInput: ${quest?.sampleInput}\nExpected: ${quest?.sampleOutput}\nGot: ${quest?.sampleOutput}\n\nTest Case 2: ✅ Passed\n\nAll visible test cases passed!`);
    setRunning(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setOutput(null);
    setAiFeedback(null);
    await new Promise(r => setTimeout(r, 2000));
    setOutput(`🏆 All test cases passed! (5/5)\n\nRuntime: 4ms (beats 92%)\nMemory: 8.2 MB (beats 87%)`);
    setAiFeedback({
      complexity: 'Time: O(n) | Space: O(n)',
      issues: ['Consider edge case when array is empty', 'Variable naming could be more descriptive'],
      hints: ['Think about using a hash map for O(1) lookups', 'Two-pointer approach could reduce space to O(1)'],
    });
    if (quest) {
      dispatch(completeQuest(quest.id));
      dispatch(updateXP(quest.xpReward));
    }
    setSubmitting(false);
  };

  if (!quest) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground font-body text-lg mb-4">Quest not found</p>
          <Link to="/quests" className="text-primary font-body font-semibold">Back to Quest Map</Link>
        </div>
      </div>
    );
  }

  const diffColors: Record<string, string> = {
    Easy: 'text-easy-green',
    Medium: 'text-medium-amber',
    Hard: 'text-hard-red',
    Boss: 'text-accent text-glow-accent',
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top bar */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-md flex-shrink-0">
        <div className="px-4 flex items-center justify-between h-12">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/quests')} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-display font-bold text-foreground tracking-wider text-xs">DSA<span className="text-primary">-QUEST</span></span>
            </div>
            <span className="text-border">|</span>
            <span className="font-display font-semibold text-foreground text-sm">{quest.title}</span>
            <span className={`font-body font-bold text-xs ${diffColors[quest.difficulty]}`}>{quest.difficulty}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-primary">+{quest.xpReward} XP</span>
            <span className="text-lg">{user?.avatar}</span>
            <button onClick={() => { dispatch(logout()); navigate('/'); }} className="text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Problem description */}
        <div className="w-[40%] border-r border-border overflow-y-auto p-6">
          <h2 className="font-display font-bold text-xl text-foreground mb-4">{quest.title}</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-foreground/90 font-body text-base leading-relaxed whitespace-pre-line">{quest.description}</p>

            <h3 className="font-display font-semibold text-foreground text-sm mt-6 mb-2 uppercase tracking-wider">Constraints</h3>
            <ul className="space-y-1">
              {quest.constraints.map((c, i) => (
                <li key={i} className="text-muted-foreground font-mono text-sm">• {c}</li>
              ))}
            </ul>

            <h3 className="font-display font-semibold text-foreground text-sm mt-6 mb-2 uppercase tracking-wider">Example</h3>
            <div className="bg-secondary rounded-lg p-4 border border-border">
              <p className="text-muted-foreground font-body text-xs uppercase tracking-wider mb-1">Input</p>
              <p className="text-foreground font-mono text-sm mb-3">{quest.sampleInput}</p>
              <p className="text-muted-foreground font-body text-xs uppercase tracking-wider mb-1">Output</p>
              <p className="text-foreground font-mono text-sm">{quest.sampleOutput}</p>
            </div>
          </div>
        </div>

        {/* Right: Editor + output */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50 flex-shrink-0">
            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 bg-secondary border border-border rounded-md px-3 py-1.5 text-foreground font-mono text-sm hover:bg-muted transition-colors"
              >
                {language === 'cpp' ? 'C++' : language === 'java' ? 'Java' : 'Python'}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showLangMenu && (
                <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-lg shadow-lg z-10 overflow-hidden">
                  {['cpp', 'java', 'python'].map(l => (
                    <button
                      key={l}
                      onClick={() => handleLangChange(l)}
                      className="block w-full text-left px-4 py-2 text-foreground font-mono text-sm hover:bg-secondary transition-colors"
                    >
                      {l === 'cpp' ? 'C++' : l === 'java' ? 'Java' : 'Python'}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRun}
                disabled={running || submitting}
                className="flex items-center gap-1.5 bg-secondary border border-border text-foreground font-body font-semibold text-sm px-4 py-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" /> {running ? 'Running...' : 'Run'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={running || submitting}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground font-body font-semibold text-sm px-4 py-1.5 rounded-md glow-primary hover:brightness-110 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" /> {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={monacoLang[language]}
              value={code}
              onChange={v => setCode(v || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: 'JetBrains Mono, monospace',
                minimap: { enabled: false },
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'line',
                cursorBlinking: 'smooth',
              }}
            />
          </div>

          {/* Output + AI Feedback */}
          {(output || aiFeedback) && (
            <div className="border-t border-border max-h-[40%] overflow-y-auto flex-shrink-0">
              {output && (
                <div className="p-4 border-b border-border">
                  <h3 className="font-display font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-easy-green" /> Output
                  </h3>
                  <pre className="text-foreground/90 font-mono text-sm whitespace-pre-wrap leading-relaxed">{output}</pre>
                </div>
              )}
              {aiFeedback && (
                <div className="p-4">
                  <h3 className="font-display font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-accent" /> AI Feedback
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-secondary/50 rounded-lg p-3 border border-border/50">
                      <p className="text-muted-foreground font-body text-xs uppercase tracking-wider mb-1">Complexity</p>
                      <p className="text-foreground font-mono text-sm">{aiFeedback.complexity}</p>
                    </div>
                    {aiFeedback.issues.length > 0 && (
                      <div className="bg-secondary/50 rounded-lg p-3 border border-border/50">
                        <p className="text-medium-amber font-body text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Issues
                        </p>
                        {aiFeedback.issues.map((issue, i) => (
                          <p key={i} className="text-foreground/80 font-body text-sm">• {issue}</p>
                        ))}
                      </div>
                    )}
                    <div className="bg-secondary/50 rounded-lg p-3 border border-border/50">
                      <p className="text-primary font-body text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" /> Hints
                      </p>
                      {aiFeedback.hints.map((hint, i) => (
                        <p key={i} className="text-foreground/80 font-body text-sm">• {hint}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api";
import { createPatch, diffLines } from "diff";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeComparisonProps {
  filePath: string;
  projectId?: string;
}

const defaultOriginal = `import { useState } from 'react';

function App() {
  const [userInput, setUserInput] = useState('');
  
  // Vulnerable: XSS risk
  return (
    <div dangerouslySetInnerHTML={{ __html: userInput }} />
  );
}

export default App;`;

const defaultFixed = `import { useState } from 'react';
import DOMPurify from 'dompurify';

function App() {
  const [userInput, setUserInput] = useState('');
  
  // Fixed: Sanitized input
  const sanitizedInput = DOMPurify.sanitize(userInput);
  
  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedInput }} />
  );
}

export default App;`;

export const CodeComparison = ({ filePath, projectId }: CodeComparisonProps) => {
  const [originalCode, setOriginalCode] = useState<string>(defaultOriginal);
  const [fixedCode, setFixedCode] = useState<string>(defaultFixed);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!projectId || !filePath) return;
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.getFileAnalysis(projectId, filePath);
        if (!mounted) return;
        // backend may store content in `content` and suggested fix in `fix` or `fixed`
  const r: any = res as any;
  setOriginalCode(r?.content || r?.original || defaultOriginal);
  setFixedCode(r?.fix || r?.fixed || r?.suggested_fix || defaultFixed);
      } catch (err: any) {
        if (!mounted) return;
        setError(err.message || "Failed to load code comparison");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [projectId, filePath]);

  return (
    <div className="space-y-4">
      {loading && <div className="text-sm text-muted-foreground">Loading code comparison…</div>}
      {error && <div className="text-sm text-destructive">{error}</div>}

      <div className="flex items-center gap-2">
        <Badge variant="destructive">Original</Badge>
        <Badge className="bg-success">Fixed</Badge>
      </div>

      <Card className="bg-secondary/50 border-border overflow-hidden">
        {/* compute line diffs */}
        {(() => {
          const origChanged = new Set<number>();
          const fixChanged = new Set<number>();
          let origLine = 1;
          let fixLine = 1;
          const parts = diffLines(originalCode, fixedCode);

          const splitAndCount = (value: string) => {
            if (!value) return [] as string[];
            const lines = value.split(/\r?\n/);
            // remove trailing empty line caused by a trailing newline
            if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
            return lines;
          };

          for (const part of parts) {
            const lines = splitAndCount(part.value);
            const count = lines.length;
            if (part.added) {
              // these lines are in fixed only
              for (let i = 0; i < count; i++) {
                fixChanged.add(fixLine + i);
              }
              fixLine += count;
            } else if (part.removed) {
              // these lines are removed from original
              for (let i = 0; i < count; i++) {
                origChanged.add(origLine + i);
              }
              origLine += count;
            } else {
              // unchanged
              origLine += count;
              fixLine += count;
            }
          }

          const origLineProps = (lineNumber: number) => {
            if (origChanged.has(lineNumber)) {
              return { style: { background: "rgba(255,75,60,0.08)" } };
            }
            return {};
          };

          const fixLineProps = (lineNumber: number) => {
            if (fixChanged.has(lineNumber)) {
              return { style: { background: "rgba(16,185,129,0.08)" } };
            }
            return {};
          };

          return (
            <div>
              <div className="p-4 grid lg:grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 font-medium">Original</div>
                  <SyntaxHighlighter
                    language="tsx"
                    style={oneDark}
                    wrapLongLines
                    showLineNumbers
                    wrapLines
                    lineProps={(ln) => origLineProps(ln)}
                  >
                    {originalCode}
                  </SyntaxHighlighter>
                </div>
                <div>
                  <div className="mb-2 font-medium">Fixed</div>
                  <SyntaxHighlighter
                    language="tsx"
                    style={oneDark}
                    wrapLongLines
                    showLineNumbers
                    wrapLines
                    lineProps={(ln) => fixLineProps(ln)}
                  >
                    {fixedCode}
                  </SyntaxHighlighter>
                </div>
              </div>

              {/* End of comparison panels */}
            </div>
          );
        })()}
      </Card>
    </div>
  );
};

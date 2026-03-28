import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { FileTree } from "./FileTree";
import { FileAnalysisView } from "./FileAnalysisView";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DirectoryExplorerProps {
  projectId: string;
}

export const DirectoryExplorer = ({ projectId }: DirectoryExplorerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(350);
  const [collapsed, setCollapsed] = useState(false);
  const splitterRef = useRef<HTMLDivElement | null>(null);

  const startDrag = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const newWidth = Math.max(200, Math.min(800, startWidth + dx));
      setSidebarWidth(newWidth);
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div className="flex gap-6 items-start relative">
      {/* Sidebar container: animate width and hide inner content smoothly */}
      <div
        style={{ width: collapsed ? 0 : sidebarWidth }}
        className="transition-all duration-300 ease-in-out overflow-hidden"
      >
        <div
          style={{ opacity: collapsed ? 0 : 1 }}
          className={`transition-opacity duration-200 ease-in-out ${collapsed ? "pointer-events-none" : ""}`}
        >
          <Card className="bg-card/50 backdrop-blur border-border p-4 h-[calc(100vh-250px)] overflow-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium">Files</div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setCollapsed((c) => !c)}>
                  {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <FileTree projectId={projectId} onFileSelect={setSelectedFile} selectedFile={selectedFile} />
          </Card>
        </div>
      </div>

      {/* When collapsed show a small unhide button; otherwise show the draggable splitter */}
      {collapsed ? (
        <div className="flex items-start">
          <div className="mt-4">
            <Button size="sm" variant="ghost" onClick={() => setCollapsed(false)} aria-label="Open sidebar">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          ref={splitterRef}
          onMouseDown={startDrag}
          className="w-1 cursor-col-resize bg-border/40"
        />
      )}

      <div className="flex-1">
        <Card className="bg-card/50 backdrop-blur border-border p-6 h-[calc(100vh-250px)] overflow-auto">
          {selectedFile ? (
            <FileAnalysisView filePath={selectedFile} projectId={projectId} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-lg mb-2">Select a file to view analysis</p>
                <p className="text-sm">Click on any file in the tree to see its details</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

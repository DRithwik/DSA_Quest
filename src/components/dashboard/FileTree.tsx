import { useEffect, useState } from "react";
import { ChevronRight, ChevronDown, File, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api";

interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileNode[];
}

interface FileTreeProps {
  projectId: string;
  onFileSelect: (path: string) => void;
  selectedFile: string | null;
}

export const FileTree = ({ projectId, onFileSelect, selectedFile }: FileTreeProps) => {
  const [tree, setTree] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.getFileTree(projectId);
        const t = Array.isArray(res.tree) ? res.tree : [res.tree];
        if (mounted) setTree(t as FileNode[]);
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load file tree");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (projectId) load();

    return () => {
      mounted = false;
    };
  }, [projectId]);

  return (
    <div className="space-y-1">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Folder className="h-4 w-4 text-accent" />
        Project Structure
      </h3>
      {loading && <div className="text-sm text-muted-foreground">Loading file tree…</div>}
      {error && <div className="text-sm text-destructive">{error}</div>}
      {!loading && !error && tree.map((node) => (
        <TreeNode
          key={node.path}
          node={node}
          level={0}
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
        />
      ))}
    </div>
  );
};

interface TreeNodeProps {
  node: FileNode;
  level: number;
  onFileSelect: (path: string) => void;
  selectedFile: string | null;
}

const TreeNode = ({ node, level, onFileSelect, selectedFile }: TreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);

  const handleClick = () => {
    if (node.type === "directory") {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(node.path);
    }
  };

  const isSelected = selectedFile === node.path;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer hover:bg-secondary/50 transition-colors",
          isSelected && "bg-primary/20 hover:bg-primary/30"
        )}
        style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        onClick={handleClick}
      >
        {node.type === "directory" ? (
          <>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <Folder className="h-4 w-4 text-accent" />
          </>
        ) : (
          <>
            <div className="w-4" />
            <File className="h-4 w-4 text-muted-foreground" />
          </>
        )}
        <span className={cn("text-sm font-mono", isSelected && "text-primary font-medium")}>
          {node.name}
        </span>
      </div>
      {node.type === "directory" && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

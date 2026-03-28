import * as parser from '@babel/parser';
import traverse from '@babel/traverse';

export interface ASTMetadata {
  loopDepth: number;
  hasRecursion: boolean;
  dataStructures: string[];
}

export class ASTService {
  /**
   * Enhanced AST analysis using @babel/parser
   */
  static analyzeCode(code: string, language: string): ASTMetadata {
    const metadata: ASTMetadata = {
      loopDepth: 0,
      hasRecursion: false,
      dataStructures: []
    };

    if (language !== 'javascript' && language !== 'typescript') {
      // Fallback for non-JS languages
      metadata.loopDepth = (code.match(/for|while/g) || []).length;
      return metadata;
    }

    try {
      const ast = parser.parse(code, {
        sourceType: "module",
        plugins: ["typescript"]
      });

      let maxDepth = 0;
      let currentDepth = 0;

      traverse(ast, {
        enter(path) {
          if (path.isLoop()) {
            currentDepth++;
            maxDepth = Math.max(maxDepth, currentDepth);
          }
          if (path.isCallExpression()) {
             // Heuristic for recursion: check if function calls itself by name
             // (Simplified for this demo)
          }
          if (path.isNewExpression()) {
              const callee: any = path.node.callee;
              if (callee.name && ['Set', 'Map', 'Array'].includes(callee.name)) {
                if (!metadata.dataStructures.includes(callee.name)) metadata.dataStructures.push(callee.name);
              }
          }
        },
        exit(path) {
          if (path.isLoop()) {
            currentDepth--;
          }
        }
      });

      metadata.loopDepth = maxDepth;
      metadata.hasRecursion = code.includes('arguments.callee') || (code.match(/function\s+(\w+)/g) || []).length > 2; // Simple heuristic

    } catch (err) {
      console.warn('Babel AST analysis failed:', err);
      metadata.loopDepth = (code.match(/for|while/g) || []).length;
    }

    return metadata;
  }
}

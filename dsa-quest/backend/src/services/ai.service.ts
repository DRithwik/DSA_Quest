import { GoogleGenerativeAI } from "@google/generative-ai";
import { ASTMetadata } from "./ast.service";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface AIFeedbackResponse {
  feedback: string;
  hints: string[];
  complexity: {
    time: string;
    space: string;
  };
  qualityScore: number;
}

export class AIService {
  static async getFeedback(code: string, problem: string, metadata: ASTMetadata): Promise<AIFeedbackResponse> {
    const prompt = `
    Act as a senior senior software architect and DSA mentor. 
    Problem: "${problem}"
    Code:
    \`\`\`
    ${code}
    \`\`\`
    
    AST Metadata:
    - Loop Depth: ${metadata.loopDepth}
    - Has Recursion: ${metadata.hasRecursion}
    - Detected Data Structures: ${metadata.dataStructures.join(", ")}
    
    Instruction:
    Provide constructive feedback. NEVER give the full solution.
    1. Assess the approach (Correctness, Efficiency).
    2. Suggest 2-3 Socratic hints (questions to lead them to the right path).
    3. Analyze Time and Space Complexity.
    4. Provide a Code Quality Score (1-100).
    
    Output JSON format:
    {
      "feedback": "...",
      "hints": ["...", "..."],
      "complexity": { "time": "O(...)", "space": "O(...)" },
      "qualityScore": 85
    }`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      // Remove possible markdown formatting from model response
      const jsonStr = text.replace(/```json|```/g, "").trim();
      return JSON.parse(jsonStr);
    } catch (err) {
      console.error("AI feedback error:", err);
      return {
        feedback: "The mentor is resting right now, but your effort counts!",
        hints: ["Review the logic one more time.", "Check for edge cases."],
        complexity: { time: "O(?)", space: "O(?)" },
        qualityScore: 0
      };
    }
  }
}

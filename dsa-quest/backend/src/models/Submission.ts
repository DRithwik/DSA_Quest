import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  userId: string;
  questId: string;
  code: string;
  language: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'ERROR';
  executionResult: {
    stdout?: string;
    stderr?: string;
    runtime?: number;
    memory?: number;
  };
  aiFeedback: {
    feedback: string;
    hints: string[];
    complexity: {
      time: string;
      space: string;
    };
    qualityScore: number;
  };
  astMetadata: {
    loopDepth: number;
    hasRecursion: boolean;
    dataStructures: string[];
  };
  createdAt: Date;
}

const SubmissionSchema: Schema = new Schema({
  userId: { type: String, required: true },
  questId: { type: String, required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'ERROR'], default: 'PENDING' },
  executionResult: {
    stdout: String,
    stderr: String,
    runtime: Number,
    memory: Number
  },
  aiFeedback: {
    feedback: String,
    hints: [String],
    complexity: {
      time: String,
      space: String
    },
    qualityScore: Number
  },
  astMetadata: {
    loopDepth: Number,
    hasRecursion: Boolean,
    dataStructures: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);

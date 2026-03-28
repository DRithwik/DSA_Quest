import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';
import { setupWebSockets } from './websocket';
import { AIService } from './services/ai.service';
import { SandboxService } from './services/sandbox.service';
import { ASTService } from './services/ast.service';
import Submission from './models/Submission';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database Connections
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dsa_quest')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB error:', err));

// WebSocket Setup
setupWebSockets(io);

// API Routes
app.get('/api/quests', async (req: Request, res: Response) => {
    const quests = await prisma.quest.findMany();
    res.json(quests);
});

app.post('/api/submissions', async (req: Request, res: Response) => {
    const { userId, questId, code, language } = req.body;
    
    // 1. AST Analysis
    const astMetadata = ASTService.analyzeCode(code, language);
    
    // 2. Execution (Sandbox)
    const execResult = await SandboxService.execute(code, language, []);
    
    // 3. AI Feedback (Async context)
    const aiFeedback = await AIService.getFeedback(code, `Quest ID: ${questId}`, astMetadata);
    
    // 4. Record in MongoDB
    const submission = new Submission({
        userId, questId, code, language,
        status: execResult.stderr ? 'REJECTED' : 'ACCEPTED',
        executionResult: execResult,
        aiFeedback,
        astMetadata
    });
    await submission.save();

    // 5. Update XP/Level in PostgreSQL if accepted
    if (submission.status === 'ACCEPTED') {
        // XP Formula: XP = (BaseXP × Difficulty) + TimeBonus + AIQualityScore
        const baseXP = 100;
        const difficultyMultipliers: Record<string, number> = { 'EASY': 1, 'MEDIUM': 1.5, 'HARD': 2 };
        const quest = await prisma.quest.findUnique({ where: { id: questId } });
        const difficultyStr = quest?.difficulty || 'EASY';
        const difficulty = difficultyMultipliers[difficultyStr];
        
        const timeBonus = Math.max(0, Math.floor(1000 / (execResult.runtime || 1)));
        const aiScore = aiFeedback.qualityScore || 0;
        
        const xpGain = Math.floor((baseXP * difficulty) + timeBonus + aiScore);
        
        await prisma.user.update({
            where: { id: userId },
            data: { 
                xp: { increment: xpGain },
                level: { set: Math.floor(Math.sqrt((xpGain + 100) / 100)) } // Level formula: sqrt(XP/100)
            }
        });
    }

    res.json({ submission, aiFeedback });
});

// Auth endpoints (Simplified for demo)
app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    // Real bcrypt/jwt logic would go here
    const user = await prisma.user.findFirst({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Auth failed' });
    res.json({ user, token: 'mock_jwt_token' });
});

server.listen(PORT, () => {
    console.log(`DSA-QUEST Backend running on http://localhost:${PORT}`);
});

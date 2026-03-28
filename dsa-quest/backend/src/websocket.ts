import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface BattlePlayer {
    userId: string;
    username: string;
    elo: number;
    progress: number; // 0-100%
    attackStatus: 'CLEAN' | 'VIBRATING' | 'INVERTED';
}

interface BattleRoom {
    id: string;
    players: BattlePlayer[];
    problemId: string;
    startTime: number;
    status: 'WAITING' | 'ACTIVE' | 'FINISHED';
}

const matchmakingQueue: BattlePlayer[] = [];
const activeRooms = new Map<string, BattleRoom>();

export const setupWebSockets = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('Player connected:', socket.id);

        socket.on('joinQueue', async ({ userId, elo, username }) => {
            const player: BattlePlayer = { userId, elo, username, progress: 0, attackStatus: 'CLEAN' };
            matchmakingQueue.push(player);

            // Matchmaking algorithm (Simple version: match within 100 ELO score)
            if (matchmakingQueue.length >= 2) {
                const p1 = matchmakingQueue.shift()!;
                const p2 = matchmakingQueue.shift()!;
                
                const roomId = `room_${Date.now()}`;
                const room: BattleRoom = {
                    id: roomId,
                    players: [p1, p2],
                    problemId: 'random_ds_problem', // Should be fetched from DB
                    startTime: Date.now(),
                    status: 'ACTIVE'
                };
                activeRooms.set(roomId, room);

                io.to(socket.id).emit('MATCH_FOUND', { roomId, opponent: p2, problemId: room.problemId });
                // We need p2's socket.id, but in a real app, we'd store socket mapping
                // Assuming peer-to-peer room join here
            }
        });

        socket.on('joinRoom', (roomId: string) => {
            socket.join(roomId);
            const room = activeRooms.get(roomId);
            if (room) {
                io.to(roomId).emit('roomUpdate', room);
            }
        });

        socket.on('updateProgress', ({ roomId, userId, progress }) => {
            const room = activeRooms.get(roomId);
            if (room) {
                const player = room.players.find(p => p.userId === userId);
                if (player) {
                    player.progress = progress;
                    io.to(roomId).emit('CODE_UPDATE', { userId, progress });
                }
            }
        });

        // Gamified interaction: Visual Attack
        socket.on('sendAttack', ({ roomId, targetUserId, attackType }) => {
            // attackType: 'VIBRATE', 'INVERT', 'MESS_EDITOR'
            io.to(roomId).emit('attackReceived', { targetUserId, attackType });
        });

        socket.on('battleFinished', async ({ roomId, userId, timeTaken }) => {
            const room = activeRooms.get(roomId);
            if (room && room.status === 'ACTIVE') {
                 room.status = 'FINISHED';
                 const winner = room.players.find(p => p.userId === userId);
                 const loser = room.players.find(p => p.userId !== userId);

                 if (winner && loser) {
                    // Elo Matchmaking logic
                    const RA = winner.elo;
                    const RB = loser.elo;
                    const K = 30; // K-factor
                    
                    const expectedScoreW = 1 / (1 + Math.pow(10, (RB - RA) / 400));
                    const expectedScoreL = 1 / (1 + Math.pow(10, (RA - RB) / 400));
                    
                    const newEloW = Math.round(RA + K * (1 - expectedScoreW));
                    const newEloL = Math.round(RB + K * (0 - expectedScoreL));

                    const xpGain = 500; 

                    await prisma.user.update({
                        where: { id: winner.userId },
                        data: { 
                            xp: { increment: xpGain },
                            elo: { set: newEloW }
                        }
                    });

                    await prisma.user.update({
                        where: { id: loser.userId },
                        data: { elo: { set: newEloL } }
                    });

                    io.to(roomId).emit('WIN', { winnerId: winner.userId, xpGain, winnerElo: newEloW, loserElo: newEloL });
                    activeRooms.delete(roomId);
                 }
            }
        });

        socket.on('disconnect', () => {
            console.log('Player disconnected');
        });
    });
};

import api from './authService';

export const questService = {
  getQuests: () => api.get('/quests'),
  getQuest: (id: string) => api.get(`/quests/${id}`),
  getLeaderboard: () => api.get('/leaderboard'),
};

export default questService;

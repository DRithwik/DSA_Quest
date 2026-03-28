import api from './authService';

export const submissionService = {
  runCode: (data: { code: string; language: string; problemId: string }) =>
    api.post('/submissions/run', data),

  submitCode: (data: { code: string; language: string; problemId: string }) =>
    api.post('/submissions/submit', data),

  getSubmissions: (problemId: string) =>
    api.get(`/submissions/${problemId}`),
};

export default submissionService;

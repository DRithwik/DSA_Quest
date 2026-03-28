import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type BattleStatus = 'idle' | 'searching' | 'matched' | 'inProgress' | 'finished';
export type BattleResult = 'win' | 'lose' | 'draw' | null;

interface Opponent {
  id: string;
  username: string;
  avatar: string;
  level: number;
  elo: number;
}

interface BattleState {
  status: BattleStatus;
  opponent: Opponent | null;
  myProgress: number;
  opponentProgress: number;
  timeLeft: number;
  result: BattleResult;
  xpGained: number;
  eloChange: number;
  problemId: string | null;
}

const initialState: BattleState = {
  status: 'idle',
  opponent: null,
  myProgress: 0,
  opponentProgress: 0,
  timeLeft: 600,
  result: null,
  xpGained: 0,
  eloChange: 0,
  problemId: null,
};

const battleSlice = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    startSearching(state) {
      state.status = 'searching';
      state.result = null;
      state.myProgress = 0;
      state.opponentProgress = 0;
      state.xpGained = 0;
      state.eloChange = 0;
    },
    matchFound(state, action: PayloadAction<{ opponent: Opponent; problemId: string }>) {
      state.status = 'matched';
      state.opponent = action.payload.opponent;
      state.problemId = action.payload.problemId;
    },
    startBattle(state) {
      state.status = 'inProgress';
      state.timeLeft = 600;
    },
    updateMyProgress(state, action: PayloadAction<number>) {
      state.myProgress = Math.min(action.payload, 100);
    },
    updateOpponentProgress(state, action: PayloadAction<number>) {
      state.opponentProgress = Math.min(action.payload, 100);
    },
    tickTimer(state) {
      state.timeLeft = Math.max(0, state.timeLeft - 1);
    },
    endBattle(state, action: PayloadAction<{ result: BattleResult; xpGained: number; eloChange: number }>) {
      state.status = 'finished';
      state.result = action.payload.result;
      state.xpGained = action.payload.xpGained;
      state.eloChange = action.payload.eloChange;
    },
    resetBattle() {
      return initialState;
    },
    cancelSearch() {
      return initialState;
    },
  },
});

export const {
  startSearching, matchFound, startBattle, updateMyProgress,
  updateOpponentProgress, tickTimer, endBattle, resetBattle, cancelSearch,
} = battleSlice.actions;
export default battleSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Boss';

export interface Quest {
  id: string;
  title: string;
  difficulty: Difficulty;
  xpReward: number;
  realm: string;
  locked: boolean;
  completed: boolean;
  description: string;
  constraints: string[];
  sampleInput: string;
  sampleOutput: string;
}

export interface Realm {
  id: string;
  name: string;
  icon: string;
  color: string;
  quests: Quest[];
  unlocked: boolean;
}

const initialState: { realms: Realm[]; activeQuest: Quest | null } = {
  activeQuest: null,
  realms: [
    {
      id: 'arrays',
      name: 'Array Realm',
      icon: '⚔️',
      color: 'primary',
      unlocked: true,
      quests: [
        { id: 'a1', title: 'Two Sum', difficulty: 'Easy', xpReward: 50, realm: 'arrays', locked: false, completed: true, description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.', constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'], sampleInput: 'nums = [2,7,11,15], target = 9', sampleOutput: '[0,1]' },
        { id: 'a2', title: 'Maximum Subarray', difficulty: 'Medium', xpReward: 100, realm: 'arrays', locked: false, completed: false, description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.', constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'], sampleInput: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', sampleOutput: '6' },
        { id: 'a3', title: 'Merge Intervals', difficulty: 'Medium', xpReward: 120, realm: 'arrays', locked: false, completed: false, description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.', constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2'], sampleInput: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', sampleOutput: '[[1,6],[8,10],[15,18]]' },
        { id: 'a4', title: 'Trapping Rain Water', difficulty: 'Hard', xpReward: 200, realm: 'arrays', locked: true, completed: false, description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.', constraints: ['n == height.length', '1 <= n <= 2 * 10^4'], sampleInput: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', sampleOutput: '6' },
        { id: 'a5', title: 'Median of Two Sorted Arrays', difficulty: 'Boss', xpReward: 500, realm: 'arrays', locked: true, completed: false, description: 'Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).', constraints: ['0 <= m, n <= 1000', '-10^6 <= nums1[i], nums2[i] <= 10^6'], sampleInput: 'nums1 = [1,3], nums2 = [2]', sampleOutput: '2.0' },
      ],
    },
    {
      id: 'graphs',
      name: 'Graph Kingdom',
      icon: '🏰',
      color: 'cyber-blue',
      unlocked: true,
      quests: [
        { id: 'g1', title: 'BFS Traversal', difficulty: 'Easy', xpReward: 50, realm: 'graphs', locked: false, completed: false, description: 'Implement Breadth-First Search traversal for a graph and return the order of visited nodes.', constraints: ['1 <= n <= 10^4', '0 <= edges.length <= 10^4'], sampleInput: 'n = 5, edges = [[0,1],[0,2],[1,3],[2,4]]', sampleOutput: '[0,1,2,3,4]' },
        { id: 'g2', title: 'Number of Islands', difficulty: 'Medium', xpReward: 100, realm: 'graphs', locked: false, completed: false, description: 'Given an m x n 2D binary grid which represents a map of "1"s (land) and "0"s (water), return the number of islands.', constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300'], sampleInput: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]', sampleOutput: '2' },
        { id: 'g3', title: 'Dijkstra\'s Shortest Path', difficulty: 'Hard', xpReward: 200, realm: 'graphs', locked: true, completed: false, description: 'Implement Dijkstra\'s algorithm to find shortest paths from a source vertex to all other vertices in a weighted graph.', constraints: ['1 <= V <= 10^4', '0 <= E <= 10^5'], sampleInput: 'V=5, src=0, edges=[[0,1,4],[0,2,1],[2,1,2]]', sampleOutput: '[0,3,1,INF,INF]' },
        { id: 'g4', title: 'Strongly Connected Components', difficulty: 'Boss', xpReward: 500, realm: 'graphs', locked: true, completed: false, description: 'Find all strongly connected components in a directed graph using Kosaraju\'s or Tarjan\'s algorithm.', constraints: ['1 <= V <= 10^5', '0 <= E <= 10^5'], sampleInput: 'V=5, edges=[[1,0],[0,2],[2,1],[0,3],[3,4]]', sampleOutput: '[[0,1,2],[3],[4]]' },
      ],
    },
    {
      id: 'dp',
      name: 'DP Dungeon',
      icon: '🐉',
      color: 'accent',
      unlocked: false,
      quests: [
        { id: 'd1', title: 'Climbing Stairs', difficulty: 'Easy', xpReward: 50, realm: 'dp', locked: true, completed: false, description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?', constraints: ['1 <= n <= 45'], sampleInput: 'n = 3', sampleOutput: '3' },
        { id: 'd2', title: 'Longest Common Subsequence', difficulty: 'Medium', xpReward: 120, realm: 'dp', locked: true, completed: false, description: 'Given two strings text1 and text2, return the length of their longest common subsequence.', constraints: ['1 <= text1.length, text2.length <= 1000'], sampleInput: 'text1 = "abcde", text2 = "ace"', sampleOutput: '3' },
        { id: 'd3', title: 'Edit Distance', difficulty: 'Hard', xpReward: 200, realm: 'dp', locked: true, completed: false, description: 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.', constraints: ['0 <= word1.length, word2.length <= 500'], sampleInput: 'word1 = "horse", word2 = "ros"', sampleOutput: '3' },
        { id: 'd4', title: 'Burst Balloons', difficulty: 'Boss', xpReward: 500, realm: 'dp', locked: true, completed: false, description: 'You are given n balloons, indexed from 0 to n-1. Burst all balloons to collect the maximum coins.', constraints: ['n == nums.length', '1 <= n <= 300'], sampleInput: 'nums = [3,1,5,8]', sampleOutput: '167' },
      ],
    },
    {
      id: 'trees',
      name: 'Tree Sanctuary',
      icon: '🌳',
      color: 'easy-green',
      unlocked: false,
      quests: [
        { id: 't1', title: 'Inorder Traversal', difficulty: 'Easy', xpReward: 50, realm: 'trees', locked: true, completed: false, description: 'Given the root of a binary tree, return the inorder traversal of its nodes\' values.', constraints: ['The number of nodes <= 100', '-100 <= Node.val <= 100'], sampleInput: 'root = [1,null,2,3]', sampleOutput: '[1,3,2]' },
        { id: 't2', title: 'Lowest Common Ancestor', difficulty: 'Medium', xpReward: 100, realm: 'trees', locked: true, completed: false, description: 'Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.', constraints: ['Number of nodes in tree <= 10^5', '-10^9 <= Node.val <= 10^9'], sampleInput: 'root = [3,5,1,6,2,0,8], p = 5, q = 1', sampleOutput: '3' },
        { id: 't3', title: 'Serialize Binary Tree', difficulty: 'Hard', xpReward: 200, realm: 'trees', locked: true, completed: false, description: 'Design an algorithm to serialize and deserialize a binary tree.', constraints: ['Number of nodes <= 10^4', '-1000 <= Node.val <= 1000'], sampleInput: 'root = [1,2,3,null,null,4,5]', sampleOutput: '"[1,2,3,null,null,4,5]"' },
      ],
    },
  ],
};

const questSlice = createSlice({
  name: 'quest',
  initialState,
  reducers: {
    setActiveQuest(state, action: PayloadAction<Quest>) {
      state.activeQuest = action.payload;
    },
    completeQuest(state, action: PayloadAction<string>) {
      for (const realm of state.realms) {
        const quest = realm.quests.find(q => q.id === action.payload);
        if (quest) {
          quest.completed = true;
          // Unlock next quest
          const idx = realm.quests.indexOf(quest);
          if (idx + 1 < realm.quests.length) {
            realm.quests[idx + 1].locked = false;
          }
        }
      }
    },
  },
});

export const { setActiveQuest, completeQuest } = questSlice.actions;
export default questSlice.reducer;

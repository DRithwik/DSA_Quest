/*
  # Seed Initial Content for DSA-QUEST

  ## Overview
  Populates the database with initial quests, achievements, and boss fights.

  ## Content Added
  - 6 quests (beginner to advanced)
  - 8 achievements
  - 3 boss fights
*/

INSERT INTO quests (title, description, difficulty, category, xp_reward, problem_statement, test_cases, starter_code, hints, order_index, prerequisites) VALUES
(
  'The Twin Numbers Mystery',
  'In the ancient village of Arrayville, a merchant has lost two numbers that sum to a magical target. Your quest is to find these twin numbers and help the merchant restore balance to the village.',
  'beginner',
  'Arrays',
  50,
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  '[{"input": "[2,7,11,15], 9", "output": "[0,1]"}]',
  '{"javascript": "function twoSum(nums, target) {\n  // Your code here\n  return [];\n}", "python": "def two_sum(nums, target):\n    # Your code here\n    return []"}',
  '["Consider using a hash map", "Check if target minus current exists"]',
  1,
  '[]'
),
(
  'The Palindrome Portal',
  'A mystical portal has appeared that only opens for words that read the same forwards and backwards. Master string reversal to unlock its secrets.',
  'beginner',
  'Strings',
  50,
  'Write a function that reverses a string. Modify the input array in-place.',
  '[{"input": "hello", "output": "olleh"}]',
  '{"javascript": "function reverseString(s) {\n  // Your code here\n}", "python": "def reverse_string(s):\n    # Your code here\n    pass"}',
  '["Use two pointers", "Swap characters from both ends"]',
  2,
  '[]'
),
(
  'The Balanced Brackets Puzzle',
  'The ancient code uses special brackets. Only those who can validate bracket balance can read the sacred texts.',
  'intermediate',
  'Stacks',
  100,
  'Given a string containing brackets, determine if it is valid. Open brackets must be closed by the same type in correct order.',
  '[{"input": "()", "output": "true"}, {"input": "()[]{}", "output": "true"}]',
  '{"javascript": "function isValid(s) {\n  // Your code here\n  return false;\n}", "python": "def is_valid(s):\n    # Your code here\n    return False"}',
  '["Use a stack for opening brackets", "Match closing brackets with stack top"]',
  3,
  '[]'
),
(
  'The Binary Search Expedition',
  'Deep in the Sorted Mountains lies treasure. Use binary search to find your target quickly.',
  'intermediate',
  'Binary Search',
  100,
  'Given a sorted array nums and target, return the index of target. Return -1 if not found.',
  '[{"input": "[-1,0,3,5,9,12], 9", "output": "4"}]',
  '{"javascript": "function search(nums, target) {\n  // Your code here\n  return -1;\n}", "python": "def search(nums, target):\n    # Your code here\n    return -1"}',
  '["Track left and right boundaries", "Compare middle with target"]',
  4,
  '[]'
),
(
  'The Unique Character Challenge',
  'Find the longest substring without repeating characters to break the wizards spell.',
  'advanced',
  'Sliding Window',
  150,
  'Given string s, find the length of the longest substring without repeating characters.',
  '[{"input": "abcabcbb", "output": "3"}, {"input": "bbbbb", "output": "1"}]',
  '{"javascript": "function lengthOfLongestSubstring(s) {\n  // Your code here\n  return 0;\n}", "python": "def length_of_longest_substring(s):\n    # Your code here\n    return 0"}',
  '["Use sliding window", "Track characters with hash set"]',
  5,
  '[]'
),
(
  'The Meeting Room Merger',
  'Merge overlapping time intervals to optimize the Council of Algorithms schedule.',
  'advanced',
  'Arrays',
  150,
  'Given intervals array, merge all overlapping intervals and return non-overlapping intervals.',
  '[{"input": "[[1,3],[2,6],[8,10]]", "output": "[[1,6],[8,10]]"}]',
  '{"javascript": "function merge(intervals) {\n  // Your code here\n  return [];\n}", "python": "def merge(intervals):\n    # Your code here\n    return []"}',
  '["Sort intervals by start time", "Merge when intervals overlap"]',
  6,
  '[]'
);

INSERT INTO achievements (name, description, icon, category, requirement, xp_reward, rarity) VALUES
('First Blood', 'Complete your first quest', '🎯', 'milestone', '{"type": "quests", "count": 1}', 25, 'common'),
('Speed Demon', 'Complete a quest in under 5 minutes', '⚡', 'speed', '{"type": "time", "max": 300}', 50, 'rare'),
('Quest Apprentice', 'Complete 5 quests', '⚔️', 'milestone', '{"type": "quests", "count": 5}', 100, 'common'),
('Quest Master', 'Complete 25 quests', '🏆', 'milestone', '{"type": "quests", "count": 25}', 500, 'epic'),
('No Hints Hero', 'Complete quest without hints', '🧠', 'mastery', '{"type": "hints", "max": 0}', 75, 'rare'),
('Week Warrior', 'Maintain 7-day streak', '🔥', 'streak', '{"type": "streak", "days": 7}', 150, 'rare'),
('Boss Slayer', 'Defeat your first boss', '👑', 'boss', '{"type": "bosses", "count": 1}', 200, 'epic'),
('Perfect Score', 'Pass all tests on first try', '💯', 'mastery', '{"type": "perfect", "count": 1}', 100, 'rare');

INSERT INTO boss_fights (name, description, difficulty, unlock_level, problems, time_limit_minutes, xp_reward, special_rewards) VALUES
(
  'The Array Demon',
  'A fearsome demon guards the Algorithm Kingdom entrance. Solve three array puzzles to pass.',
  'Medium',
  5,
  '["Rotate Array", "Container With Most Water", "Product Array"]',
  45,
  500,
  '{"title": "Array Conqueror", "badge": "🗡️"}'
),
(
  'The Tree Overlord',
  'Master of tree traversals lives in the Binary Forest. Face three tree challenges.',
  'Hard',
  10,
  '["Max Depth", "Validate BST", "LCA"]',
  60,
  1000,
  '{"title": "Tree Whisperer", "badge": "🌳"}'
),
(
  'The Graph Guardian',
  'Navigate complex graph problems to defeat this legendary guardian.',
  'Hard',
  15,
  '["Islands", "Course Schedule", "Word Ladder"]',
  75,
  1500,
  '{"title": "Graph Navigator", "badge": "🗺️"}'
);

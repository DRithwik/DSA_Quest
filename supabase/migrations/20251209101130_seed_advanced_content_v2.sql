/*
  # Seed Advanced DSA-QUEST Content V2

  ## Content Added
  - 4 Character Classes
  - 12 Skills across 3 categories
  - 8 Equipment pieces
  - 2 Raid Quests
  - 1 Seasonal Event
*/

-- Insert Character Classes
INSERT INTO character_classes (name, description, icon, speed_bonus, optimization_bonus, accuracy_bonus, defense_bonus) VALUES
('Algorithm Warrior', 'Focused on speed and direct problem-solving. Great for code battles.', '⚔️', 20, -10, 5, 10),
('Code Sorcerer', 'Master of optimization and elegant solutions. High complexity scores.', '🧙', -5, 20, 10, 0),
('Logic Ranger', 'Balanced approach with strong accuracy. Reliable performer.', '🏹', 5, 5, 15, 5),
('Data Guardian', 'Defensive programming specialist. Handles edge cases expertly.', '🛡️', 0, 5, 10, 20);

-- Insert Skills (without circular dependencies)
INSERT INTO skill_trees (name, description, category, icon, cost_xp, prerequisite_skill_id, effect) VALUES
('Speed Boost', 'Increase coding speed by 10%', 'offensive', '⚡', 100, NULL, '{"coding_speed": 10}'),
('Code Optimization', 'Improve time complexity of solutions', 'offensive', '🚀', 150, NULL, '{"optimization": 15}'),
('Debugging Master', 'Reduce debugging attempts by 20%', 'offensive', '🔍', 120, NULL, '{"debugging_efficiency": 20}'),
('Edge Case Guard', 'Catch 25% more edge cases', 'defensive', '🛡️', 100, NULL, '{"edge_case_detection": 25}'),
('Code Review', 'Get AI feedback on code quality', 'defensive', '👁️', 150, NULL, '{"code_quality_feedback": true}'),
('Memory Master', 'Optimize space complexity by 20%', 'defensive', '💾', 120, NULL, '{"space_optimization": 20}'),
('Algorithm Insight', 'Unlock detailed complexity analysis', 'utility', '🧠', 200, NULL, '{"complexity_analysis": true}'),
('Time Warp', 'Gain 2 extra minutes in challenges', 'utility', '⏰', 250, NULL, '{"time_bonus": 120}'),
('Code Replay', 'Review battle replay with annotations', 'utility', '🎬', 180, NULL, '{"battle_replay": true}'),
('XP Multiplier', 'Earn 25% more XP from battles', 'offensive', '✨', 200, NULL, '{"xp_multiplier": 1.25}'),
('Perfect Form', 'Small chance to auto-solve problems', 'defensive', '🎯', 300, NULL, '{"auto_solve_chance": 5}'),
('Legendary Aura', 'Gain 50% more ELO from victories', 'offensive', '👑', 400, NULL, '{"elo_multiplier": 1.5}');

-- Insert Equipment
INSERT INTO equipment (name, description, rarity, item_type, stat_bonuses, cosmetic_effects, drop_rate) VALUES
('Novice Keyboard', 'A basic keyboard for coding', 'common', 'weapon', '{"coding_speed": 5}', '{}', 0.8),
('Speed Ring', 'Gives a boost to typing speed', 'uncommon', 'accessory', '{"coding_speed": 10}', '{}', 0.6),
('Optimization Staff', 'Enhances problem-solving efficiency', 'rare', 'weapon', '{"optimization": 15, "xp_gain": 5}', '{"nameplate_color": "gold"}', 0.3),
('Legendary Code Tome', 'The most sought-after programming tome', 'legendary', 'accessory', '{"all_stats": 20, "xp_gain": 50}', '{"avatar_effect": "legendary_glow"}', 0.05),
('Guardian Armor', 'Heavy armor for defensive programming', 'rare', 'armor', '{"defense": 20, "edge_case_detection": 10}', '{}', 0.3),
('Swift Boots', 'Enchanted boots for faster thinking', 'uncommon', 'armor', '{"coding_speed": 8}', '{}', 0.7),
('Prismatic Crown', 'Balances all stats equally', 'epic', 'accessory', '{"balanced_stats": 15}', '{"nameplate_color": "rainbow"}', 0.1),
('Algorithm Grimoire', 'Increases XP gain significantly', 'epic', 'weapon', '{"xp_gain": 30, "optimization": 10}', '{}', 0.15);

-- Insert Raid Quests
INSERT INTO raid_quests (name, description, difficulty, min_players, max_players, problems, time_limit_minutes, xp_reward_per_player, unlock_level) VALUES
(
  'The Data Structure Citadel',
  'A cooperative raid where teams solve interdependent data structure problems.',
  'Medium',
  2,
  4,
  '[{"type": "array_rotation", "difficulty": "medium"}, {"type": "linked_list_merge", "difficulty": "medium"}, {"type": "stack_evaluation", "difficulty": "hard"}]',
  45,
  300,
  10
),
(
  'Algorithm Apocalypse',
  'The ultimate team challenge! Solve complex algorithms under time pressure.',
  'Hard',
  3,
  5,
  '[{"type": "graph_shortest_path", "difficulty": "hard"}, {"type": "dynamic_programming", "difficulty": "hard"}]',
  60,
  750,
  20
);

-- Insert Seasonal Event
INSERT INTO seasonal_events (name, description, event_type, start_date, end_date, reward_pool) VALUES
(
  'Algorithm Olympics 2024',
  'Compete in timed challenges. Top 100 earn exclusive cosmetics!',
  'competition',
  now(),
  now() + interval '30 days',
  '{"cosmetics": ["Olympic Badge", "Gold Crown"], "xp_bonus": 5000}'
);

-- Insert Index for better performance
CREATE INDEX IF NOT EXISTS idx_character_classes_name ON character_classes(name);
CREATE INDEX IF NOT EXISTS idx_skill_trees_category ON skill_trees(category);
CREATE INDEX IF NOT EXISTS idx_equipment_rarity ON equipment(rarity);

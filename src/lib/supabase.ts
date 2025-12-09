import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserProfile = {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  current_level: number;
  total_xp: number;
  current_xp: number;
  xp_to_next_level: number;
  title: string;
  bio?: string;
  created_at: string;
  updated_at: string;
};

export type Quest = {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  xp_reward: number;
  problem_statement: string;
  test_cases: any[];
  starter_code: Record<string, string>;
  solution?: string;
  hints: string[];
  order_index: number;
  prerequisites: string[];
  created_at: string;
};

export type QuestCompletion = {
  id: string;
  user_id: string;
  quest_id: string;
  completed: boolean;
  code_submitted?: string;
  language?: string;
  attempts: number;
  hints_used: number;
  time_taken_seconds?: number;
  xp_earned: number;
  completed_at?: string;
  created_at: string;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement: any;
  xp_reward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  created_at: string;
};

export type LeaderboardEntry = {
  id: string;
  user_id: string;
  total_xp: number;
  quests_completed: number;
  bosses_defeated: number;
  achievements_unlocked: number;
  current_streak: number;
  longest_streak: number;
  last_active: string;
  updated_at: string;
  user_profiles?: UserProfile;
};

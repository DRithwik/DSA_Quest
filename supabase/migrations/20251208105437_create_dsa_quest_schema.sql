/*
  # DSA-QUEST Initial Schema

  ## Overview
  Complete database schema for the DSA-QUEST gamified learning platform combining
  educational rigor with RPG progression systems.

  ## 1. New Tables

  ### `user_profiles`
  Extended user data beyond auth.users
  - `id` (uuid, primary key, references auth.users)
  - `username` (text, unique)
  - `display_name` (text)
  - `avatar_url` (text)
  - `current_level` (integer, default 1)
  - `total_xp` (integer, default 0)
  - `current_xp` (integer, default 0)
  - `xp_to_next_level` (integer, default 100)
  - `title` (text, unlocked titles/badges)
  - `bio` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `quests`
  DSA problems presented as narrative quests
  - `id` (uuid, primary key)
  - `title` (text)
  - `description` (text, narrative story)
  - `difficulty` (text, enum: beginner/intermediate/advanced/expert)
  - `category` (text, e.g., arrays, linked-lists, trees, graphs)
  - `xp_reward` (integer)
  - `problem_statement` (text, technical problem description)
  - `test_cases` (jsonb, input/output test cases)
  - `starter_code` (jsonb, starter code templates for different languages)
  - `solution` (text, reference solution)
  - `hints` (jsonb, array of progressive hints)
  - `order_index` (integer, quest progression order)
  - `prerequisites` (jsonb, array of prerequisite quest IDs)
  - `created_at` (timestamptz)

  ### `quest_completions`
  Tracks user progress on quests
  - `id` (uuid, primary key)
  - `user_id` (uuid, references user_profiles)
  - `quest_id` (uuid, references quests)
  - `completed` (boolean, default false)
  - `code_submitted` (text)
  - `language` (text)
  - `attempts` (integer, default 0)
  - `hints_used` (integer, default 0)
  - `time_taken_seconds` (integer)
  - `xp_earned` (integer)
  - `completed_at` (timestamptz)
  - `created_at` (timestamptz)

  ### `achievements`
  Available achievements to unlock
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `icon` (text, icon identifier)
  - `category` (text, e.g., speed, mastery, streak)
  - `requirement` (jsonb, criteria for unlocking)
  - `xp_reward` (integer)
  - `rarity` (text, common/rare/epic/legendary)
  - `created_at` (timestamptz)

  ### `user_achievements`
  Tracks unlocked achievements per user
  - `id` (uuid, primary key)
  - `user_id` (uuid, references user_profiles)
  - `achievement_id` (uuid, references achievements)
  - `unlocked_at` (timestamptz)

  ### `boss_fights`
  High-stakes boss challenges
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text, narrative)
  - `difficulty` (text)
  - `unlock_level` (integer, minimum level required)
  - `problems` (jsonb, array of problem IDs that make up the boss fight)
  - `time_limit_minutes` (integer)
  - `xp_reward` (integer)
  - `special_rewards` (jsonb, titles, badges, etc.)
  - `created_at` (timestamptz)

  ### `boss_attempts`
  Tracks user attempts at boss fights
  - `id` (uuid, primary key)
  - `user_id` (uuid, references user_profiles)
  - `boss_id` (uuid, references boss_fights)
  - `completed` (boolean, default false)
  - `problems_solved` (integer, default 0)
  - `total_problems` (integer)
  - `time_taken_seconds` (integer)
  - `xp_earned` (integer)
  - `completed_at` (timestamptz)
  - `created_at` (timestamptz)

  ### `leaderboards`
  Global and category-specific rankings
  - `id` (uuid, primary key)
  - `user_id` (uuid, references user_profiles)
  - `total_xp` (integer)
  - `quests_completed` (integer)
  - `bosses_defeated` (integer)
  - `achievements_unlocked` (integer)
  - `current_streak` (integer, days)
  - `longest_streak` (integer, days)
  - `last_active` (timestamptz)
  - `updated_at` (timestamptz)

  ### `daily_streaks`
  Tracks daily login/activity streaks
  - `id` (uuid, primary key)
  - `user_id` (uuid, references user_profiles)
  - `streak_count` (integer, default 0)
  - `last_activity_date` (date)
  - `created_at` (timestamptz)

  ### `code_wars`
  Multiplayer competitive coding battles
  - `id` (uuid, primary key)
  - `name` (text)
  - `status` (text, waiting/in-progress/completed)
  - `problem_id` (uuid)
  - `max_players` (integer, default 2)
  - `time_limit_minutes` (integer)
  - `created_by` (uuid, references user_profiles)
  - `started_at` (timestamptz)
  - `ended_at` (timestamptz)
  - `created_at` (timestamptz)

  ### `code_war_participants`
  Tracks players in code wars
  - `id` (uuid, primary key)
  - `code_war_id` (uuid, references code_wars)
  - `user_id` (uuid, references user_profiles)
  - `completed` (boolean, default false)
  - `completion_time_seconds` (integer)
  - `rank` (integer)
  - `xp_earned` (integer)
  - `joined_at` (timestamptz)
  - `completed_at` (timestamptz)

  ## 2. Security
  - Enable RLS on all tables
  - Users can read their own data
  - Users can update their own profiles
  - Quest and achievement data is publicly readable
  - Leaderboard is publicly readable
  - Code war data readable by participants

  ## 3. Important Notes
  - XP system uses level-based progression with increasing requirements
  - Achievements unlock based on various criteria (speed, accuracy, streaks)
  - Boss fights are unlocked at specific levels
  - Leaderboards update in real-time based on user activities
  - Code wars support real-time multiplayer competition
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  avatar_url text,
  current_level integer DEFAULT 1,
  total_xp integer DEFAULT 0,
  current_xp integer DEFAULT 0,
  xp_to_next_level integer DEFAULT 100,
  title text DEFAULT 'Novice Adventurer',
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quests table
CREATE TABLE IF NOT EXISTS quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  category text NOT NULL,
  xp_reward integer NOT NULL,
  problem_statement text NOT NULL,
  test_cases jsonb NOT NULL DEFAULT '[]',
  starter_code jsonb NOT NULL DEFAULT '{}',
  solution text,
  hints jsonb DEFAULT '[]',
  order_index integer NOT NULL,
  prerequisites jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Create quest_completions table
CREATE TABLE IF NOT EXISTS quest_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  quest_id uuid REFERENCES quests(id) ON DELETE CASCADE NOT NULL,
  completed boolean DEFAULT false,
  code_submitted text,
  language text,
  attempts integer DEFAULT 0,
  hints_used integer DEFAULT 0,
  time_taken_seconds integer,
  xp_earned integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, quest_id)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  category text NOT NULL,
  requirement jsonb NOT NULL,
  xp_reward integer DEFAULT 0,
  rarity text CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')) DEFAULT 'common',
  created_at timestamptz DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create boss_fights table
CREATE TABLE IF NOT EXISTS boss_fights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL,
  unlock_level integer DEFAULT 1,
  problems jsonb NOT NULL DEFAULT '[]',
  time_limit_minutes integer NOT NULL,
  xp_reward integer NOT NULL,
  special_rewards jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create boss_attempts table
CREATE TABLE IF NOT EXISTS boss_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  boss_id uuid REFERENCES boss_fights(id) ON DELETE CASCADE NOT NULL,
  completed boolean DEFAULT false,
  problems_solved integer DEFAULT 0,
  total_problems integer NOT NULL,
  time_taken_seconds integer,
  xp_earned integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create leaderboards table
CREATE TABLE IF NOT EXISTS leaderboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_xp integer DEFAULT 0,
  quests_completed integer DEFAULT 0,
  bosses_defeated integer DEFAULT 0,
  achievements_unlocked integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_active timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create daily_streaks table
CREATE TABLE IF NOT EXISTS daily_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  streak_count integer DEFAULT 0,
  last_activity_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create code_wars table
CREATE TABLE IF NOT EXISTS code_wars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text CHECK (status IN ('waiting', 'in_progress', 'completed')) DEFAULT 'waiting',
  problem_id uuid NOT NULL,
  max_players integer DEFAULT 2,
  time_limit_minutes integer DEFAULT 30,
  created_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create code_war_participants table
CREATE TABLE IF NOT EXISTS code_war_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_war_id uuid REFERENCES code_wars(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  completed boolean DEFAULT false,
  completion_time_seconds integer,
  rank integer,
  xp_earned integer DEFAULT 0,
  joined_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(code_war_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE boss_fights ENABLE ROW LEVEL SECURITY;
ALTER TABLE boss_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_wars ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_war_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for quests (publicly readable)
CREATE POLICY "Anyone can view quests"
  ON quests FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for quest_completions
CREATE POLICY "Users can view own quest completions"
  ON quest_completions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quest completions"
  ON quest_completions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quest completions"
  ON quest_completions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for achievements (publicly readable)
CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for boss_fights (publicly readable)
CREATE POLICY "Anyone can view boss fights"
  ON boss_fights FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for boss_attempts
CREATE POLICY "Users can view own boss attempts"
  ON boss_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own boss attempts"
  ON boss_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own boss attempts"
  ON boss_attempts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for leaderboards (publicly readable)
CREATE POLICY "Anyone can view leaderboards"
  ON leaderboards FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own leaderboard entry"
  ON leaderboards FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own leaderboard entry"
  ON leaderboards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for daily_streaks
CREATE POLICY "Users can view own streaks"
  ON daily_streaks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks"
  ON daily_streaks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
  ON daily_streaks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for code_wars
CREATE POLICY "Anyone can view code wars"
  ON code_wars FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create code wars"
  ON code_wars FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creator can update code wars"
  ON code_wars FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- RLS Policies for code_war_participants
CREATE POLICY "Participants can view code war participants"
  ON code_war_participants FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM code_war_participants cp
      WHERE cp.code_war_id = code_war_participants.code_war_id
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join code wars"
  ON code_war_participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own participation"
  ON code_war_participants FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quest_completions_user_id ON quest_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_quest_completions_quest_id ON quest_completions(quest_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_boss_attempts_user_id ON boss_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_total_xp ON leaderboards(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_code_wars_status ON code_wars(status);
CREATE INDEX IF NOT EXISTS idx_code_war_participants_code_war_id ON code_war_participants(code_war_id);

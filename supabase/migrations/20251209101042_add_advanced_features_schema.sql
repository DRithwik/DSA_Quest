/*
  # Advanced DSA-QUEST Features Schema

  ## Overview
  Extended database schema supporting Code Battles, Clans, Equipment, Skill Trees,
  and advanced progression mechanics.

  ## 1. New Tables

  ### `character_classes`
  Available character class options
  - `id` (uuid, primary key)
  - `name` (text, unique)
  - `description` (text)
  - `icon` (text)
  - `speed_bonus` (integer, percentage)
  - `optimization_bonus` (integer)
  - `accuracy_bonus` (integer)
  - `defense_bonus` (integer)
  - `created_at` (timestamptz)

  ### `user_character`
  User's selected character and customization
  - `id` (uuid, primary key)
  - `user_id` (uuid, references user_profiles)
  - `class_id` (uuid, references character_classes)
  - `selected_class` (text)
  - `health` (integer, default 100)
  - `mana` (integer, default 50)
  - `created_at` (timestamptz)

  ### `skill_trees`
  Available skills for learning
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `category` (text: offensive/defensive/utility)
  - `icon` (text)
  - `cost_xp` (integer)
  - `prerequisite_skill_id` (uuid)
  - `effect` (jsonb)
  - `created_at` (timestamptz)

  ### `user_skills`
  Track unlocked skills per user
  - `id` (uuid, primary key)
  - `user_id` (uuid, references user_profiles)
  - `skill_id` (uuid, references skill_trees)
  - `unlocked_at` (timestamptz)
  - `active` (boolean, default true)

  ### `equipment`
  Loot items (weapons, armor, accessories)
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `rarity` (text: common/uncommon/rare/epic/legendary)
  - `item_type` (text: weapon/armor/accessory)
  - `stat_bonuses` (jsonb: xp_gain, battle_rewards, coding_speed)
  - `cosmetic_effects` (jsonb: avatar_effect, nameplate_color)
  - `drop_rate` (float, 0-1)
  - `created_at` (timestamptz)

  ### `user_inventory`
  User's equipment and items
  - `id` (uuid, primary key)
  - `user_id` (uuid, references user_profiles)
  - `equipment_id` (uuid, references equipment)
  - `equipped` (boolean, default false)
  - `quantity` (integer, default 1)
  - `acquired_at` (timestamptz)

  ### `code_battles`
  Real-time 1v1 competitive matches
  - `id` (uuid, primary key)
  - `status` (text: waiting/in_progress/completed)
  - `problem_id` (uuid)
  - `difficulty` (text)
  - `player1_id` (uuid, references user_profiles)
  - `player2_id` (uuid, references user_profiles)
  - `player1_elo` (integer)
  - `player2_elo` (integer)
  - `time_limit_seconds` (integer, default 900)
  - `started_at` (timestamptz)
  - `ended_at` (timestamptz)
  - `created_at` (timestamptz)

  ### `code_battle_scores`
  Track performance during battles
  - `id` (uuid, primary key)
  - `battle_id` (uuid, references code_battles)
  - `player_id` (uuid, references user_profiles)
  - `score` (integer)
  - `time_taken_seconds` (integer)
  - `code_lines` (integer)
  - `debugging_attempts` (integer)
  - `time_complexity_rank` (text: optimal/good/average/poor)
  - `space_complexity_rank` (text: optimal/good/average/poor)
  - `all_tests_passed` (boolean)
  - `winner` (boolean)
  - `xp_earned` (integer)
  - `elo_gained` (integer)

  ### `elo_ratings`
  Track ELO rating for competitive matchmaking
  - `id` (uuid, primary key)
  - `user_id` (uuid, references user_profiles, unique)
  - `current_elo` (integer, default 1200)
  - `peak_elo` (integer, default 1200)
  - `battles_won` (integer, default 0)
  - `battles_lost` (integer, default 0)
  - `win_rate` (float)
  - `updated_at` (timestamptz)

  ### `clans`
  Guild/Clan organizations
  - `id` (uuid, primary key)
  - `name` (text, unique)
  - `description` (text)
  - `icon` (text)
  - `leader_id` (uuid, references user_profiles)
  - `level` (integer, default 1)
  - `total_xp` (integer, default 0)
  - `member_count` (integer, default 1)
  - `max_members` (integer, default 50)
  - `created_at` (timestamptz)

  ### `clan_members`
  Clan membership tracking
  - `id` (uuid, primary key)
  - `clan_id` (uuid, references clans)
  - `user_id` (uuid, references user_profiles)
  - `role` (text: leader/officer/member)
  - `joined_at` (timestamptz)

  ### `study_groups`
  Small collaborative learning groups
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `creator_id` (uuid, references user_profiles)
  - `max_members` (integer, default 10)
  - `topic` (text, default 'General DSA')
  - `difficulty_level` (text: beginner/intermediate/advanced)
  - `created_at` (timestamptz)

  ### `study_group_members`
  Study group membership
  - `id` (uuid, primary key)
  - `group_id` (uuid, references study_groups)
  - `user_id` (uuid, references user_profiles)
  - `joined_at` (timestamptz)

  ### `raid_quests`
  Cooperative multiplayer challenges
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `difficulty` (text)
  - `min_players` (integer, default 2)
  - `max_players` (integer, default 5)
  - `problems` (jsonb, array of problem configurations)
  - `time_limit_minutes` (integer)
  - `xp_reward_per_player` (integer)
  - `unlock_level` (integer)
  - `created_at` (timestamptz)

  ### `raid_instances`
  Active raid groups in progress
  - `id` (uuid, primary key)
  - `raid_quest_id` (uuid, references raid_quests)
  - `status` (text: waiting/in_progress/completed/failed)
  - `leader_id` (uuid, references user_profiles)
  - `created_at` (timestamptz)

  ### `raid_participants`
  Players in raid instances
  - `id` (uuid, primary key)
  - `raid_instance_id` (uuid, references raid_instances)
  - `user_id` (uuid, references user_profiles)
  - `joined_at` (timestamptz)

  ### `tournaments`
  Competitive tournament events
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `status` (text: registration/in_progress/completed)
  - `start_date` (timestamptz)
  - `end_date` (timestamptz)
  - `max_participants` (integer)
  - `participant_count` (integer, default 0)
  - `prize_pool` (jsonb)
  - `format` (text: single_elimination/round_robin)
  - `created_at` (timestamptz)

  ### `tournament_participants`
  Tournament registration
  - `id` (uuid, primary key)
  - `tournament_id` (uuid, references tournaments)
  - `user_id` (uuid, references user_profiles)
  - `rank` (integer)
  - `points` (integer, default 0)
  - `joined_at` (timestamptz)

  ### `seasonal_events`
  Time-limited event content
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `event_type` (text: challenge/campaign/festival)
  - `start_date` (timestamptz)
  - `end_date` (timestamptz)
  - `reward_pool` (jsonb)
  - `created_at` (timestamptz)

  ### `user_season_progress`
  Track user progress in seasonal events
  - `id` (uuid, primary key)
  - `user_id` (uuid, references user_profiles)
  - `event_id` (uuid, references seasonal_events)
  - `progress` (integer)
  - `rewards_claimed` (boolean array)
  - `updated_at` (timestamptz)

  ## 2. Enhancements to Existing Tables

  ### Updated `user_profiles`
  Add new columns:
  - `character_class` (text)
  - `health` (integer)
  - `elo_rating` (integer)
  - `preferred_playstyle` (text)

  ### Updated `daily_streaks`
  Add new columns:
  - `login_rewards_claimed` (boolean array)
  - `current_reward_tier` (integer)

  ## 3. Security (RLS Policies)
  - All team/clan data readable by members
  - Battle results publicly viewable
  - Private user data protected
  - Inventory visible only to user

  ## 4. Indexes for Performance
  - ELO leaderboard queries
  - Clan member lookups
  - Battle history queries
  - Seasonal event progress tracking
*/

-- Create character_classes table
CREATE TABLE IF NOT EXISTS character_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  speed_bonus integer DEFAULT 0,
  optimization_bonus integer DEFAULT 0,
  accuracy_bonus integer DEFAULT 0,
  defense_bonus integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create user_character table
CREATE TABLE IF NOT EXISTS user_character (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  class_id uuid REFERENCES character_classes(id),
  selected_class text,
  health integer DEFAULT 100,
  mana integer DEFAULT 50,
  created_at timestamptz DEFAULT now()
);

-- Create skill_trees table
CREATE TABLE IF NOT EXISTS skill_trees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  icon text NOT NULL,
  cost_xp integer NOT NULL,
  prerequisite_skill_id uuid REFERENCES skill_trees(id),
  effect jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create user_skills table
CREATE TABLE IF NOT EXISTS user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  skill_id uuid REFERENCES skill_trees(id) ON DELETE CASCADE NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  active boolean DEFAULT true,
  UNIQUE(user_id, skill_id)
);

-- Create equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  rarity text CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  item_type text NOT NULL,
  stat_bonuses jsonb DEFAULT '{}',
  cosmetic_effects jsonb DEFAULT '{}',
  drop_rate float DEFAULT 0.5,
  created_at timestamptz DEFAULT now()
);

-- Create user_inventory table
CREATE TABLE IF NOT EXISTS user_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  equipment_id uuid REFERENCES equipment(id) ON DELETE CASCADE NOT NULL,
  equipped boolean DEFAULT false,
  quantity integer DEFAULT 1,
  acquired_at timestamptz DEFAULT now()
);

-- Create code_battles table
CREATE TABLE IF NOT EXISTS code_battles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text CHECK (status IN ('waiting', 'in_progress', 'completed')),
  problem_id uuid,
  difficulty text,
  player1_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  player2_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  player1_elo integer,
  player2_elo integer,
  time_limit_seconds integer DEFAULT 900,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create code_battle_scores table
CREATE TABLE IF NOT EXISTS code_battle_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_id uuid REFERENCES code_battles(id) ON DELETE CASCADE NOT NULL,
  player_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  score integer DEFAULT 0,
  time_taken_seconds integer,
  code_lines integer,
  debugging_attempts integer DEFAULT 0,
  time_complexity_rank text,
  space_complexity_rank text,
  all_tests_passed boolean DEFAULT false,
  winner boolean DEFAULT false,
  xp_earned integer DEFAULT 0,
  elo_gained integer DEFAULT 0,
  UNIQUE(battle_id, player_id)
);

-- Create elo_ratings table
CREATE TABLE IF NOT EXISTS elo_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  current_elo integer DEFAULT 1200,
  peak_elo integer DEFAULT 1200,
  battles_won integer DEFAULT 0,
  battles_lost integer DEFAULT 0,
  win_rate float DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Create clans table
CREATE TABLE IF NOT EXISTS clans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  icon text,
  leader_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  level integer DEFAULT 1,
  total_xp integer DEFAULT 0,
  member_count integer DEFAULT 1,
  max_members integer DEFAULT 50,
  created_at timestamptz DEFAULT now()
);

-- Create clan_members table
CREATE TABLE IF NOT EXISTS clan_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clan_id uuid REFERENCES clans(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  role text CHECK (role IN ('leader', 'officer', 'member')) DEFAULT 'member',
  joined_at timestamptz DEFAULT now(),
  UNIQUE(clan_id, user_id)
);

-- Create study_groups table
CREATE TABLE IF NOT EXISTS study_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  creator_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  max_members integer DEFAULT 10,
  topic text DEFAULT 'General DSA',
  difficulty_level text,
  created_at timestamptz DEFAULT now()
);

-- Create study_group_members table
CREATE TABLE IF NOT EXISTS study_group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES study_groups(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create raid_quests table
CREATE TABLE IF NOT EXISTS raid_quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL,
  min_players integer DEFAULT 2,
  max_players integer DEFAULT 5,
  problems jsonb DEFAULT '[]',
  time_limit_minutes integer NOT NULL,
  xp_reward_per_player integer NOT NULL,
  unlock_level integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create raid_instances table
CREATE TABLE IF NOT EXISTS raid_instances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raid_quest_id uuid REFERENCES raid_quests(id) ON DELETE CASCADE NOT NULL,
  status text CHECK (status IN ('waiting', 'in_progress', 'completed', 'failed')),
  leader_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create raid_participants table
CREATE TABLE IF NOT EXISTS raid_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raid_instance_id uuid REFERENCES raid_instances(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(raid_instance_id, user_id)
);

-- Create tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text CHECK (status IN ('registration', 'in_progress', 'completed')),
  start_date timestamptz,
  end_date timestamptz,
  max_participants integer,
  participant_count integer DEFAULT 0,
  prize_pool jsonb DEFAULT '{}',
  format text,
  created_at timestamptz DEFAULT now()
);

-- Create tournament_participants table
CREATE TABLE IF NOT EXISTS tournament_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid REFERENCES tournaments(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  rank integer,
  points integer DEFAULT 0,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(tournament_id, user_id)
);

-- Create seasonal_events table
CREATE TABLE IF NOT EXISTS seasonal_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  event_type text,
  start_date timestamptz,
  end_date timestamptz,
  reward_pool jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create user_season_progress table
CREATE TABLE IF NOT EXISTS user_season_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  event_id uuid REFERENCES seasonal_events(id) ON DELETE CASCADE NOT NULL,
  progress integer DEFAULT 0,
  rewards_claimed boolean[] DEFAULT '{}',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Enable RLS on new tables
ALTER TABLE character_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_character ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_battle_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE elo_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE clans ENABLE ROW LEVEL SECURITY;
ALTER TABLE clan_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE raid_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE raid_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE raid_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasonal_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_season_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- character_classes: public read
CREATE POLICY "Anyone can view character classes"
  ON character_classes FOR SELECT
  TO authenticated
  USING (true);

-- user_character: user can view/update own
CREATE POLICY "Users can view own character"
  ON user_character FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own character"
  ON user_character FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can create own character"
  ON user_character FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- skill_trees: public read
CREATE POLICY "Anyone can view skill trees"
  ON skill_trees FOR SELECT
  TO authenticated
  USING (true);

-- user_skills: user can view/add own
CREATE POLICY "Users can view own skills"
  ON user_skills FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add skills"
  ON user_skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- equipment: public read
CREATE POLICY "Anyone can view equipment"
  ON equipment FOR SELECT
  TO authenticated
  USING (true);

-- user_inventory: user can view/manage own
CREATE POLICY "Users can view own inventory"
  ON user_inventory FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own inventory"
  ON user_inventory FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can add to inventory"
  ON user_inventory FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- code_battles: participants can view
CREATE POLICY "Battle participants can view"
  ON code_battles FOR SELECT
  TO authenticated
  USING (auth.uid() = player1_id OR auth.uid() = player2_id);

CREATE POLICY "Users can create battles"
  ON code_battles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = player1_id);

CREATE POLICY "Participants can update battle"
  ON code_battles FOR UPDATE
  TO authenticated
  USING (auth.uid() = player1_id OR auth.uid() = player2_id)
  WITH CHECK (auth.uid() = player1_id OR auth.uid() = player2_id);

-- code_battle_scores: participants can view/insert
CREATE POLICY "Battle participants can view scores"
  ON code_battle_scores FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM code_battles
      WHERE id = code_battles.id
      AND (code_battles.player1_id = auth.uid() OR code_battles.player2_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert own battle scores"
  ON code_battle_scores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = player_id);

-- elo_ratings: anyone can view
CREATE POLICY "Anyone can view ELO ratings"
  ON elo_ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own ELO"
  ON elo_ratings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- clans: members and public can view
CREATE POLICY "Anyone can view clans"
  ON clans FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create clans"
  ON clans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = leader_id);

-- clan_members: members can view
CREATE POLICY "Clan members can view other members"
  ON clan_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clan_members cm
      WHERE cm.clan_id = clan_members.clan_id AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join clans"
  ON clan_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- study_groups: members can view
CREATE POLICY "Study group members can view"
  ON study_groups FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM study_group_members
      WHERE study_group_members.group_id = study_groups.id
      AND study_group_members.user_id = auth.uid()
    ) OR creator_id = auth.uid()
  );

-- raid_quests: public read
CREATE POLICY "Anyone can view raid quests"
  ON raid_quests FOR SELECT
  TO authenticated
  USING (true);

-- tournaments: public read
CREATE POLICY "Anyone can view tournaments"
  ON tournaments FOR SELECT
  TO authenticated
  USING (true);

-- seasonal_events: public read
CREATE POLICY "Anyone can view seasonal events"
  ON seasonal_events FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_character_user_id ON user_character(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_inventory_user_id ON user_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_code_battles_players ON code_battles(player1_id, player2_id);
CREATE INDEX IF NOT EXISTS idx_code_battles_status ON code_battles(status);
CREATE INDEX IF NOT EXISTS idx_elo_ratings_current ON elo_ratings(current_elo DESC);
CREATE INDEX IF NOT EXISTS idx_clan_members_user_id ON clan_members(user_id);
CREATE INDEX IF NOT EXISTS idx_study_group_members_user_id ON study_group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_user_id ON tournament_participants(user_id);

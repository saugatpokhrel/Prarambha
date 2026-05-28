-- supabase/migrations/009_wordle_settings.sql

-- 1. Create Wordle Settings Table (single-row config)
CREATE TABLE IF NOT EXISTS wordle_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  active_word_id uuid REFERENCES wordle_words(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE wordle_settings ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Anyone can read settings (needed for the game)
CREATE POLICY "Anyone can read wordle_settings"
ON wordle_settings FOR SELECT
TO public
USING (true);

-- Only service_role can insert/update/delete
CREATE POLICY "Only service_role can insert wordle_settings"
ON wordle_settings FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Only service_role can update wordle_settings"
ON wordle_settings FOR UPDATE
TO authenticated
USING (true);

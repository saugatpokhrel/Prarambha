-- supabase/migrations/008_wordle_words.sql

-- 1. Create Wordle Words Table
CREATE TABLE IF NOT EXISTS wordle_words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text UNIQUE NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE wordle_words ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Anyone can read the word list (needed for the game to function)
CREATE POLICY "Anyone can read wordle_words"
ON wordle_words FOR SELECT
TO public
USING (true);

-- Only service_role can insert/update/delete (admin-only operations)

-- 4. Seed initial word list
INSERT INTO wordle_words (word) VALUES
  ('CRANE'), ('SLATE'), ('TRACE'), ('AROSE'), ('STALE'),
  ('CRATE'), ('ADIEU'), ('ARISE'), ('RADIO'), ('AUDIO'),
  ('LATER'), ('PLATE'), ('TABLE'), ('MAPLE'), ('FLAME'),
  ('PLACE'), ('BLAME'), ('PLANE'), ('GRADE'), ('SHADE'),
  ('SPACE'), ('STARE'), ('SCORE'), ('STORE'), ('SHORE'),
  ('STONE'), ('THOSE'), ('PHONE'), ('ABOVE'), ('LEMON'),
  ('MELON'), ('NOVEL'), ('ROBOT'), ('PILOT'), ('TIGER'),
  ('RIVER'), ('LIVER'), ('OLIVE'), ('OZONE'), ('GLARE'),
  ('FLARE'), ('SNARE'), ('SPARE'), ('SHARE'), ('WHALE'),
  ('SHALE'), ('SCALE'), ('BRAVE'), ('CRAVE'), ('GRAVE'),
  ('PRUNE'), ('TRUCE'), ('FORCE'), ('FORGE'), ('PURGE'),
  ('SURGE'), ('JUDGE'), ('NUDGE'), ('HEDGE'), ('WEDGE'),
  ('LEDGE'), ('BADGE'), ('LODGE'), ('DODGE'), ('CRIMP'),
  ('EXPEL'), ('FJORD'), ('GUILD'), ('HASTY'), ('INFIX'),
  ('JUICY'), ('KNELT'), ('LYMPH'), ('MOULT'), ('NYMPH'),
  ('OXIDE'), ('PROXY'), ('QUILT'), ('SKIMP'), ('TRYST'),
  ('ULTRA'), ('VOMIT'), ('WALTZ'), ('YACHT'), ('ZONAL'),
  ('ABBEY'), ('BLUNT'), ('CLAMP')
ON CONFLICT (word) DO NOTHING;

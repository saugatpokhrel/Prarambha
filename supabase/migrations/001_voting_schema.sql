-- supabase/migrations/001_voting_schema.sql

-- 1. Create Contestants Table
CREATE TABLE IF NOT EXISTS contestants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('mr', 'miss')),
  image_url text,
  bio text,
  created_at timestamptz DEFAULT now()
);

-- 2. Create Voters Table
CREATE TABLE IF NOT EXISTS voters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Map to auth.users.id
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now()
);

-- 3. Create Votes Table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_id uuid REFERENCES voters(id) ON DELETE CASCADE NOT NULL,
  contestant_id uuid REFERENCES contestants(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL CHECK (category IN ('mr', 'miss')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(voter_id, category) -- Enforces one vote per category (mr or miss) per voter
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE contestants ENABLE ROW LEVEL SECURITY;
ALTER TABLE voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Contestants
-- Public can read contestants
CREATE POLICY "Allow public read contestants" 
ON contestants FOR SELECT 
TO public 
USING (true);

-- Only database owner/service_role can insert/update/delete contestants (no policy allowed, default blocks others)

-- 6. RLS Policies for Voters
-- Voters can only insert/select/update their own profile
CREATE POLICY "Allow insert own voter profile" 
ON voters FOR INSERT 
TO authenticated 
WITH CHECK (id = auth.uid());

CREATE POLICY "Allow select own voter profile" 
ON voters FOR SELECT 
TO authenticated 
USING (id = auth.uid());

CREATE POLICY "Allow update own voter profile" 
ON voters FOR UPDATE 
TO authenticated 
USING (id = auth.uid());

-- 7. RLS Policies for Votes
-- Authenticated users can insert their own votes (verified by auth.uid())
CREATE POLICY "Allow insert own votes" 
ON votes FOR INSERT 
TO authenticated 
WITH CHECK (voter_id = auth.uid());

-- Authenticated users can select their own votes to see who they voted for in the UI
CREATE POLICY "Allow select own votes" 
ON votes FOR SELECT 
TO authenticated 
USING (voter_id = auth.uid());

-- 8. Create Secure View for Vote Counts (Privacy Preserving)
-- Views default to SECURITY DEFINER in PostgreSQL unless SECURITY INVOKER is set.
-- This bypasses RLS on votes to compute the counts, but only returns anonymized aggregated totals.
CREATE OR REPLACE VIEW contestant_vote_counts AS
SELECT 
  c.id AS contestant_id,
  c.name,
  c.category,
  c.image_url,
  c.bio,
  COALESCE(COUNT(v.id), 0) AS vote_count
FROM contestants c
LEFT JOIN votes v ON c.id = v.contestant_id
GROUP BY c.id, c.name, c.category, c.image_url, c.bio;

-- Grant select permission on the view to public, authenticated, and anon roles
GRANT SELECT ON contestant_vote_counts TO public, authenticated, anon;

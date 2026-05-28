-- supabase/migrations/002_registration_schema.sql
-- Registration system for Mr & Miss Fresher Candidates

-- 1. Create Candidates Table (for Mr/Miss Fresher registration)
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  category text NOT NULL CHECK (category IN ('mr', 'miss')),
  phone text NOT NULL,
  semester text NOT NULL,
  department text NOT NULL,
  bio text,
  image_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for Candidates
-- Authenticated users can insert their own candidate registration
CREATE POLICY "Allow insert own candidate registration" 
ON candidates FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid() AND email = auth.jwt() ->> 'email');

-- Authenticated users can view their own registration
CREATE POLICY "Allow select own candidate registration" 
ON candidates FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

-- Authenticated users can update their own registration (only if pending status)
CREATE POLICY "Allow update own pending candidate registration" 
ON candidates FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid() AND status = 'pending')
WITH CHECK (user_id = auth.uid() AND status = 'pending');

-- Authenticated users can delete their own registration (only if pending status)
CREATE POLICY "Allow delete own pending candidate registration" 
ON candidates FOR DELETE 
TO authenticated 
USING (user_id = auth.uid() AND status = 'pending');

-- Public can view approved candidates only (for display purposes)
CREATE POLICY "Allow public read approved candidates" 
ON candidates FOR SELECT 
TO public 
USING (status = 'approved');

-- 4. Create index for faster lookups
CREATE INDEX idx_candidates_user_id ON candidates(user_id);
CREATE INDEX idx_candidates_email ON candidates(email);
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_category ON candidates(category);

-- 5. Create view for approved candidates with vote counts
CREATE OR REPLACE VIEW approved_candidates_with_stats AS
SELECT 
  c.id,
  c.full_name,
  c.category,
  c.bio,
  c.image_url,
  c.phone,
  c.semester,
  c.department,
  c.created_at,
  COALESCE(COUNT(v.id), 0) AS vote_count
FROM candidates c
LEFT JOIN votes v ON v.contestant_id = c.id
WHERE c.status = 'approved'
GROUP BY c.id, c.full_name, c.category, c.bio, c.image_url, c.phone, c.semester, c.department, c.created_at;

GRANT SELECT ON approved_candidates_with_stats TO public, authenticated, anon;

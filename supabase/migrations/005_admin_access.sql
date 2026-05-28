-- supabase/migrations/005_admin_access.sql
-- Add admin role and policies for admin dashboard access

-- 1. Create admin role in database (optional, for reference)
CREATE ROLE admin_role;

-- 2. Update RLS policies for candidates table to allow admin access
-- Drop the old public read policy if it exists
DROP POLICY IF EXISTS "Allow public read approved candidates" ON candidates;

-- 3. Add new policies for admin and public access

-- Admins (identified by special email pattern or custom claim) can read all candidates
CREATE POLICY "Allow admin read all candidates" 
ON candidates FOR SELECT 
TO authenticated 
USING (
  auth.jwt() ->> 'email' LIKE '%@tcioe.edu.np' 
  AND (
    auth.jwt() ->> 'email' LIKE 'admin%@tcioe.edu.np' 
    OR auth.jwt() ->> 'email' = 'principal@tcioe.edu.np'
  )
);

-- Public can view approved candidates only (for display purposes)
CREATE POLICY "Allow public read approved candidates" 
ON candidates FOR SELECT 
TO public 
USING (status = 'approved');

-- 4. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO admin_role;
GRANT SELECT ON candidates TO admin_role;
GRANT UPDATE ON candidates TO admin_role;


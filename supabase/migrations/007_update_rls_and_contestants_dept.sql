-- 1. Allow candidates with rejected status to update their own registration
DROP POLICY IF EXISTS "Allow update own pending candidate registration" ON candidates;

CREATE POLICY "Allow update own candidate registration"
ON candidates FOR UPDATE
TO authenticated
USING (user_id = auth.uid() AND status IN ('pending', 'rejected'))
WITH CHECK (user_id = auth.uid());

-- 2. Add department column to contestants so faculty shows on voting cards
ALTER TABLE contestants ADD COLUMN IF NOT EXISTS department text;

-- 3. Backfill department from already-synced candidates
UPDATE contestants c
SET department = ca.department
FROM candidates ca
WHERE c.id = ca.id;

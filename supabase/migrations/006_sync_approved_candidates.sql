-- Backfill: copy any already-approved candidates into the contestants table
-- so they appear in the voting section immediately.
-- Uses the candidate id as the contestant id to keep votes linkable.

INSERT INTO contestants (id, name, category, image_url, bio, created_at)
SELECT
  c.id,
  c.full_name AS name,
  c.category,
  c.image_url,
  c.bio,
  c.created_at
FROM candidates c
WHERE c.status = 'approved'
ON CONFLICT (id) DO UPDATE SET
  name        = EXCLUDED.name,
  category    = EXCLUDED.category,
  image_url   = EXCLUDED.image_url,
  bio         = EXCLUDED.bio;

-- supabase/migrations/004_remove_semester_from_candidates.sql
-- Remove semester field from candidates table

ALTER TABLE candidates DROP COLUMN IF EXISTS semester;

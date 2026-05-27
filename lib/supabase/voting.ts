// lib/supabase/voting.ts
import { SupabaseClient } from "@supabase/supabase-js"

// --- TypeScript Interfaces ---

export interface Contestant {
  id: string
  name: string
  category: "mr" | "miss"
  image_url: string | null
  bio: string | null
  created_at?: string
}

export interface Voter {
  id: string
  email: string
  full_name: string | null
  created_at?: string
}

export interface Vote {
  id: string
  voter_id: string
  contestant_id: string
  category: "mr" | "miss"
  created_at?: string
}

export interface LeaderboardEntry extends Contestant {
  vote_count: number
}

// --- Typed Database Helper Functions ---

/**
 * Fetches all contestants of both categories (or filtered by category) from the database.
 */
export async function fetchContestantsDb(supabase: SupabaseClient): Promise<Contestant[]> {
  const { data, error } = await supabase
    .from("contestants")
    .select("id, name, category, image_url, bio, created_at")
    .order("name", { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch contestants: ${error.message}`)
  }

  return (data || []) as Contestant[]
}

/**
 * Fetches the voter's profile by their email.
 */
export async function fetchVoterByEmailDb(supabase: SupabaseClient, email: string): Promise<Voter | null> {
  const { data, error } = await supabase
    .from("voters")
    .select("id, email, full_name, created_at")
    .eq("email", email)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch voter: ${error.message}`)
  }

  return data as Voter | null
}

/**
 * Fetches all votes cast by a specific voter.
 * Useful for restoring voting state on initial load.
 */
export async function fetchVoterVotesDb(supabase: SupabaseClient, voterId: string): Promise<Vote[]> {
  const { data, error } = await supabase
    .from("votes")
    .select("id, voter_id, contestant_id, category, created_at")
    .eq("voter_id", voterId)

  if (error) {
    throw new Error(`Failed to fetch voter votes: ${error.message}`)
  }

  return (data || []) as Vote[]
}

/**
 * Fetches the leaderboard data with aggregate vote counts.
 * Uses the secure database view `contestant_vote_counts`.
 */
export async function fetchLeaderboardDb(supabase: SupabaseClient): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from("contestant_vote_counts")
    .select("contestant_id, name, category, image_url, bio, vote_count")
    .order("vote_count", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch leaderboard: ${error.message}`)
  }

  // Map view fields back to LeaderboardEntry interface
  return (data || []).map((row) => ({
    id: row.contestant_id,
    name: row.name,
    category: row.category as "mr" | "miss",
    image_url: row.image_url,
    bio: row.bio,
    vote_count: Number(row.vote_count),
  }))
}

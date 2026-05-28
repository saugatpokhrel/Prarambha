// app/actions/voting.ts
"use server"

import { revalidatePath } from "next/cache"
import { createClient, createPublicClient } from "@/lib/supabase/server"
import { Contestant, LeaderboardEntry } from "@/lib/supabase/voting"

/**
 * Action to fetch all contestants from the database.
 * Accessible publicly as contestants table has public SELECT RLS.
 */
export async function getContestants(): Promise<Contestant[]> {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("contestants")
      .select("id, name, category, image_url, bio, department")
      .order("name", { ascending: true })

    if (error) {
      console.error("Database error in getContestants:", error.message)
      return []
    }

    return (data || []) as Contestant[]
  } catch (err) {
    console.error("Unexpected error in getContestants Server Action:", err)
    return []
  }
}

/**
 * Action to cast a vote for a contestant in a specific category.
 * Implements session validation, domain validation, and duplicate checks.
 */
export async function castVote(
  contestantId: string,
  category: "mr" | "miss"
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Session validation (Server-side authority constraint 5)
    const supabase = await createClient()
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session || !session.user) {
      return {
        success: false,
        error: "Authentication required. Please sign in with your student Google account.",
      }
    }

    const user = session.user

    // 2. Domain restriction check inside server action (Constraint 1)
    if (!user.email || !user.email.endsWith("@tcioe.edu.np")) {
      return {
        success: false,
        error: "Unauthorized domain. Only @tcioe.edu.np student accounts are allowed to vote.",
      }
    }

    // 3. Ensure voter is registered in voters table
    const { data: voter, error: voterError } = await supabase
      .from("voters")
      .select("id")
      .eq("id", user.id)
      .maybeSingle()

    if (voterError || !voter) {
      return {
        success: false,
        error: "Voter account is not registered. Please re-sign in to synchronize your profile.",
      }
    }

    // 4. One vote per category pre-check (Constraint 2)
    const { data: existingVote, error: checkError } = await supabase
      .from("votes")
      .select("id")
      .eq("voter_id", voter.id)
      .eq("category", category)
      .maybeSingle()

    if (checkError) {
      return {
        success: false,
        error: "An error occurred while validating your voting history.",
      }
    }

    if (existingVote) {
      return {
        success: false,
        error: `You have already cast your vote for ${
          category === "mr" ? "Mr. Freshers" : "Miss Freshers"
        }.`,
      }
    }

    // 5. Submit vote to database (Constraint 4)
    const { error: insertError } = await supabase.from("votes").insert({
      voter_id: voter.id,
      contestant_id: contestantId,
      category: category,
    })

    if (insertError) {
      // Handles rare concurrent DB race conditions if constraint is breached
      if (insertError.code === "23505") {
        return {
          success: false,
          error: `Double vote attempt detected. You have already voted in this category.`,
        }
      }
      return {
        success: false,
        error: `Failed to register your vote: ${insertError.message}`,
      }
    }

    // Revalidate paths to refresh page cache immediately
    revalidatePath("/voting")
    return { success: true }
  } catch (err) {
    console.error("Unexpected error in castVote Server Action:", err)
    return {
      success: false,
      error: "An unexpected server-side error occurred. Please try again.",
    }
  }
}

/**
 * Action to fetch the current user's votes.
 * Useful to determine disabled button states on client components.
 */
export async function getUserVotes(): Promise<{ contestant_id: string; category: "mr" | "miss" }[]> {
  try {
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session || !session.user) {
      return []
    }

    const { data, error } = await supabase
      .from("votes")
      .select("contestant_id, category")
      .eq("voter_id", session.user.id)

    if (error) {
      console.error("Error in getUserVotes Server Action:", error.message)
      return []
    }

    return (data || []) as { contestant_id: string; category: "mr" | "miss" }[]
  } catch (err) {
    console.error("Unexpected error in getUserVotes Server Action:", err)
    return []
  }
}

/**
 * Action to fetch the current leaderboard statistics.
 * Respects voter privacy by fetching aggregated data from the secure view only (Constraint 3).
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("contestant_vote_counts")
      .select("contestant_id, name, category, image_url, bio, vote_count")
      .order("vote_count", { ascending: false })

    if (error) {
      console.error("Database error in getLeaderboard:", error.message)
      return []
    }

    return (data || []).map((row) => ({
      id: row.contestant_id,
      name: row.name,
      category: row.category as "mr" | "miss",
      image_url: row.image_url,
      bio: row.bio,
      vote_count: Number(row.vote_count),
    }))
  } catch (err) {
    console.error("Unexpected error in getLeaderboard Server Action:", err)
    return []
  }
}

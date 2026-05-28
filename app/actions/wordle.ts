"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, createClient, createPublicClient } from "@/lib/supabase/server";
import type { WordleWord } from "@/types/index";

function getAuthorizedAdmins(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

async function verifyAdminAccess(): Promise<
  { userId: string } | { error: string }
> {
  const supabase = await createClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user?.id) {
    return { error: "Authentication required" };
  }

  const userEmail = session.user.email?.toLowerCase() || "";
  if (!getAuthorizedAdmins().includes(userEmail)) {
    return { error: "Admin access required" };
  }

  return { userId: session.user.id };
}

export async function getRandomWord(): Promise<{ word: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return { error: "You must be signed in to play Wordle" };
  }

  const publicClient = createPublicClient();

  // First check if an active word is set by admin
  const { data: settings, error: settingsError } = await publicClient
    .from("wordle_settings")
    .select("active_word_id")
    .limit(1)
    .maybeSingle();

  if (!settingsError && settings?.active_word_id) {
    const { data: activeWord } = await publicClient
      .from("wordle_words")
      .select("word")
      .eq("id", settings.active_word_id)
      .single();

    if (activeWord?.word) {
      return { word: activeWord.word };
    }
  }

  // Fallback: pick a random word from the pool
  const { data, error } = await publicClient
    .from("wordle_words")
    .select("word");

  if (error) {
    console.error("Error fetching wordle words:", error);
    return { error: "Failed to fetch word" };
  }

  if (!data || data.length === 0) {
    return { error: "No words available" };
  }

  const random = data[Math.floor(Math.random() * data.length)];
  return { word: random.word };
}

export async function setActiveWord(wordId: string | null): Promise<
  { success: true } | { error: string }
> {
  const authResult = await verifyAdminAccess();
  if ("error" in authResult) {
    return { error: authResult.error };
  }

  const adminClient = createAdminClient();

  // Upsert the settings row (ensure only one row exists)
  const { data: existing } = await adminClient
    .from("wordle_settings")
    .select("id")
    .limit(1);

  if (existing && existing.length > 0) {
    const { error } = await adminClient
      .from("wordle_settings")
      .update({
        active_word_id: wordId,
        updated_by: authResult.userId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing[0].id);

    if (error) {
      console.error("Error updating active word:", error);
      return { error: error.message };
    }
  } else {
    const { error } = await adminClient
      .from("wordle_settings")
      .insert({
        active_word_id: wordId,
        updated_by: authResult.userId,
      });

    if (error) {
      console.error("Error setting active word:", error);
      return { error: error.message };
    }
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function getActiveWord(): Promise<
  { word: WordleWord | null } | { error: string }
> {
  const publicClient = createPublicClient();

  const { data: settings, error: settingsError } = await publicClient
    .from("wordle_settings")
    .select("active_word_id")
    .limit(1)
    .maybeSingle();

  if (settingsError) {
    return { error: settingsError.message };
  }

  if (!settings?.active_word_id) {
    return { word: null };
  }

  const { data: word, error: wordError } = await publicClient
    .from("wordle_words")
    .select("*")
    .eq("id", settings.active_word_id)
    .single();

  if (wordError) {
    return { error: wordError.message };
  }

  return { word: word as WordleWord };
}

export async function getAllWords(): Promise<
  { words: WordleWord[] } | { error: string }
> {
  const authResult = await verifyAdminAccess();
  if ("error" in authResult) {
    return { error: authResult.error };
  }

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("wordle_words")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching wordle words:", error);
    return { error: error.message };
  }

  return { words: (data || []) as WordleWord[] };
}

export async function addWord(word: string): Promise<
  { success: true } | { error: string }
> {
  const authResult = await verifyAdminAccess();
  if ("error" in authResult) {
    return { error: authResult.error };
  }

  const cleaned = word.trim().toUpperCase();
  if (!/^[A-Z]{5}$/.test(cleaned)) {
    return { error: "Word must be exactly 5 letters" };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("wordle_words")
    .insert({ word: cleaned, created_by: authResult.userId });

  if (error) {
    if (error.code === "23505") {
      return { error: `"${cleaned}" already exists in the word list` };
    }
    console.error("Error adding wordle word:", error);
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function removeWord(id: string): Promise<
  { success: true } | { error: string }
> {
  const authResult = await verifyAdminAccess();
  if ("error" in authResult) {
    return { error: authResult.error };
  }

  // If this word is the active word, clear it
  const adminClient = createAdminClient();
  const { data: settings } = await adminClient
    .from("wordle_settings")
    .select("id, active_word_id")
    .limit(1)
    .maybeSingle();

  if (settings?.active_word_id === id) {
    await adminClient
      .from("wordle_settings")
      .update({ active_word_id: null, updated_at: new Date().toISOString() })
      .eq("id", settings.id);
  }

  const { error } = await adminClient
    .from("wordle_words")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error removing wordle word:", error);
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}

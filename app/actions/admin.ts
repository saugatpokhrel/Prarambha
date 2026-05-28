"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { Candidate } from "@/types/index";

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

  const adminClient = createAdminClient();
  const { data: profile, error: profileError } = await adminClient
    .from("profiles")
    .select("is_admin")
    .eq("id", session.user.id)
    .single();

  if (profileError || !profile?.is_admin) {
    return { error: "Admin access required" };
  }

  return { userId: session.user.id };
}

export async function checkIsAdmin(): Promise<boolean> {
  const result = await verifyAdminAccess();
  return !("error" in result);
}

export async function fetchAllCandidates(
  filter?: "all" | "pending" | "approved" | "rejected",
): Promise<Candidate[]> {
  const authResult = await verifyAdminAccess();
  if ("error" in authResult) {
    throw new Error(authResult.error);
  }

  const adminClient = createAdminClient();
  let query = adminClient.from("candidates").select("*");

  if (filter && filter !== "all") {
    query = query.eq("status", filter);
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    console.error("Error fetching candidates:", error);
    throw error;
  }

  return (data || []) as Candidate[];
}

export async function updateCandidateStatus(
  candidateId: string,
  newStatus: "approved" | "rejected",
): Promise<{ success: boolean; error?: string }> {
  const authResult = await verifyAdminAccess();
  if ("error" in authResult) {
    return { success: false, error: authResult.error };
  }

  const adminClient = createAdminClient();

  // Fetch candidate data needed for contestants sync
  const { data: candidate, error: fetchError } = await adminClient
    .from("candidates")
    .select("id, full_name, category, image_url, bio, department")
    .eq("id", candidateId)
    .single();

  if (fetchError || !candidate) {
    return { success: false, error: "Candidate not found" };
  }

  // Update status in candidates table
  const { error: updateError } = await adminClient
    .from("candidates")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", candidateId);

  if (updateError) {
    console.error("Error updating candidate:", updateError);
    return { success: false, error: updateError.message };
  }

  // Sync to contestants table so the voting section reflects the decision
  if (newStatus === "approved") {
    const { error: upsertError } = await adminClient
      .from("contestants")
      .upsert({
        id: candidateId,
        name: candidate.full_name,
        category: candidate.category,
        image_url: candidate.image_url,
        bio: candidate.bio,
        department: candidate.department,
      });

    if (upsertError) {
      console.error("Error syncing to contestants:", upsertError);
      return {
        success: false,
        error:
          "Approved but failed to add to voting list: " + upsertError.message,
      };
    }
  } else {
    // Remove from contestants (cascades to delete their votes too)
    await adminClient.from("contestants").delete().eq("id", candidateId);
  }

  revalidatePath("/voting");
  return { success: true };
}

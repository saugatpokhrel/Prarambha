// app/actions/registration.ts
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { Candidate, CandidateFormData } from "@/types/index";

/**
 * Get current user's candidate registration if exists
 */
export async function getUserRegistration(): Promise<Candidate | null> {
  try {
    const supabase = await createClient();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user?.id) {
      return null;
    }

    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching registration:", error.message);
      return null;
    }

    return data as Candidate | null;
  } catch (err) {
    console.error("Unexpected error in getUserRegistration:", err);
    return null;
  }
}

/**
 * Register a new candidate for Mr/Miss Fresher
 * One registration per user, domain restricted to @tcioe.edu.np
 */
export async function registerCandidate(
  formData: CandidateFormData,
): Promise<{ success: boolean; data?: Candidate; error?: string }> {
  try {
    // 1. Session validation
    const supabase = await createClient();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return {
        success: false,
        error:
          "Authentication required. Please sign in with your student Google account.",
      };
    }

    const user = session.user;

    // 2. Domain restriction check
    if (!user.email || !user.email.endsWith("@tcioe.edu.np")) {
      return {
        success: false,
        error:
          "Unauthorized domain. Only @tcioe.edu.np student accounts are allowed to register.",
      };
    }

    // 3. Check if user already has a registration
    const { data: existingRegistration, error: checkError } = await supabase
      .from("candidates")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      return {
        success: false,
        error: "An error occurred while checking your registration status.",
      };
    }

    if (existingRegistration) {
      return {
        success: false,
        error:
          "You have already registered as a candidate. One registration per student is allowed.",
      };
    }

    // 4. Validate form data
    if (!formData.full_name?.trim()) {
      return { success: false, error: "Full name is required." };
    }

    if (!formData.category || !["mr", "miss"].includes(formData.category)) {
      return { success: false, error: "Category (Mr/Miss) is required." };
    }

    if (!formData.phone?.trim()) {
      return { success: false, error: "Phone number is required." };
    }

    if (!formData.department?.trim()) {
      return { success: false, error: "Department is required." };
    }

    // 5. Insert candidate registration
    const { data: newCandidate, error: insertError } = await supabase
      .from("candidates")
      .insert({
        user_id: user.id,
        email: user.email,
        full_name: formData.full_name.trim(),
        category: formData.category,
        phone: formData.phone.trim(),
        department: formData.department.trim(),
        bio: formData.bio?.trim() || null,
        image_url: formData.image_url || null,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error(
        "Database error in registerCandidate:",
        insertError.message,
      );
      return {
        success: false,
        error: "Failed to register as candidate. Please try again.",
      };
    }

    revalidatePath("/registration");
    return {
      success: true,
      data: newCandidate as Candidate,
    };
  } catch (err) {
    console.error("Unexpected error in registerCandidate:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Update candidate registration (only if status is pending)
 */
export async function updateCandidate(
  candidateId: string,
  formData: CandidateFormData,
): Promise<{ success: boolean; data?: Candidate; error?: string }> {
  try {
    // 1. Session validation
    const supabase = await createClient();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return {
        success: false,
        error: "Authentication required.",
      };
    }

    // 2. Check ownership and status
    const { data: candidate, error: fetchError } = await supabase
      .from("candidates")
      .select("*")
      .eq("id", candidateId)
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (fetchError || !candidate) {
      return {
        success: false,
        error:
          "Candidate record not found or you do not have permission to edit it.",
      };
    }

    if (candidate.status === "approved") {
      return {
        success: false,
        error: "Approved registrations cannot be edited.",
      };
    }

    // 3. Update the record; rejected → reset to pending for re-review
    const { data: updatedCandidate, error: updateError } = await supabase
      .from("candidates")
      .update({
        full_name: formData.full_name.trim(),
        category: formData.category,
        phone: formData.phone.trim(),
        department: formData.department.trim(),
        bio: formData.bio?.trim() || null,
        image_url: formData.image_url || null,
        status: candidate.status === "rejected" ? "pending" : candidate.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", candidateId)
      .eq("user_id", session.user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Database error in updateCandidate:", updateError.message);
      return {
        success: false,
        error: "Failed to update registration.",
      };
    }

    revalidatePath("/registration");
    return {
      success: true,
      data: updatedCandidate as Candidate,
    };
  } catch (err) {
    console.error("Unexpected error in updateCandidate:", err);
    return {
      success: false,
      error: "An unexpected error occurred.",
    };
  }
}

/**
 * Delete candidate registration (only if status is pending)
 */
export async function deleteCandidate(
  candidateId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Session validation
    const supabase = await createClient();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return {
        success: false,
        error: "Authentication required.",
      };
    }

    // 2. Check ownership and status
    const { data: candidate, error: fetchError } = await supabase
      .from("candidates")
      .select("status")
      .eq("id", candidateId)
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (fetchError || !candidate) {
      return {
        success: false,
        error: "Candidate record not found.",
      };
    }

    if (candidate.status !== "pending") {
      return {
        success: false,
        error: `Cannot delete a ${candidate.status} registration.`,
      };
    }

    // 3. Delete the record
    const { error: deleteError } = await supabase
      .from("candidates")
      .delete()
      .eq("id", candidateId)
      .eq("user_id", session.user.id);

    if (deleteError) {
      console.error("Database error in deleteCandidate:", deleteError.message);
      return {
        success: false,
        error: "Failed to delete registration.",
      };
    }

    revalidatePath("/registration");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in deleteCandidate:", err);
    return {
      success: false,
      error: "An unexpected error occurred.",
    };
  }
}

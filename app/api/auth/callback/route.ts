// app/api/auth/callback/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Next.js Route Handler for Google OAuth redirect callback.
 * Implements strict domain restriction for security.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/voting"

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const user = data.user
      const email = user.email

      // 1. Domain Restriction Check
      if (!email || !email.endsWith("@tcioe.edu.np")) {
        // Sign out immediately to clean up cookie/session
        await supabase.auth.signOut()
        return NextResponse.redirect(
          `${origin}/voting?error=invalid_domain`
        )
      }

      // 2. Voter DB Profile Auto-registration / Sync
      const { error: dbError } = await supabase
        .from("voters")
        .upsert(
          {
            id: user.id, // Maps directly to auth.uid()
            email: email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || "TCE Student",
          },
          { onConflict: "email" }
        )

      if (dbError) {
        console.error("Voter registration database error:", dbError.message)
        // Log them out if we can't save them to the voters table to prevent orphan votes
        await supabase.auth.signOut()
        return NextResponse.redirect(
          `${origin}/voting?error=registration_error`
        )
      }

      // Successful authentication and domain validation
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Fallback in case code exchange fails
  return NextResponse.redirect(`${origin}/voting?error=auth_failed`)
}

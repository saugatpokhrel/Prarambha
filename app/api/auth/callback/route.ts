import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/voting"
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${new URL(request.url).origin}`

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const user = data.user
      const email = user.email

      if (!email) {
        await supabase.auth.signOut()
        return NextResponse.redirect(`${origin}/voting?error=auth_failed`)
      }

      // Allow authorized admin emails to bypass domain/voter restrictions
      const authorizedAdmins = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)

      if (authorizedAdmins.includes(email.toLowerCase())) {
        return NextResponse.redirect(`${origin}${next}`)
      }

      // Domain restriction for students
      if (!email.endsWith("@tcioe.edu.np")) {
        await supabase.auth.signOut()
        return NextResponse.redirect(`${origin}/voting?error=invalid_domain`)
      }

      // Voter DB profile auto-registration/sync
      const { error: dbError } = await supabase
        .from("voters")
        .upsert(
          {
            id: user.id,
            email: email,
            full_name:
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              "TCE Student",
          },
          { onConflict: "email" }
        )

      if (dbError) {
        console.error("Voter registration database error:", dbError.message)
        await supabase.auth.signOut()
        return NextResponse.redirect(`${origin}/voting?error=registration_error`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/voting?error=auth_failed`)
}

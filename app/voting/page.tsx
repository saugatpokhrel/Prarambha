// app/voting/page.tsx
/**
 * Next.js 16 Instant Navigation validation.
 * Enables build-time and dev-time structures checks for instantaneous page loads.
 * Matches next.js-managed guidelines inside docs/01-app/02-guides/instant-navigation.md.
 */
export const unstable_instant = { prefetch: "static" }

import { getContestants, getLeaderboard } from "@/app/actions/voting"
import { VotingHero } from "@/components/voting/VotingHero"
import { VotingStats } from "@/components/voting/VotingStats"
import { Leaderboard } from "@/components/voting/Leaderboard"
import { AuthGuard, VotingConsole } from "@/components/voting/AuthGuard"
import { Toaster } from "@/components/ui/sonner"

/**
 * VotingPage acts as the primary layout root for Mr & Miss Freshers 2082.
 * Renders public stats/rankings and wraps mutable interfaces with the domain Guard.
 */
export default async function VotingPage() {
  // Fetch data in parallel on the server
  const [contestants, leaderboard] = await Promise.all([
    getContestants(),
    getLeaderboard(),
  ])

  return (
    <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8 max-w-7xl space-y-12">
      {/* 1. Public Event Header Hero */}
      <VotingHero />

      {/* 2. Public Dynamic Event Metrics & Closure Countdown */}
      <VotingStats entries={leaderboard} />

      {/* 3. Secure Authenticated Voting Workspace */}
      <div className="border-t border-neutral-200/60 dark:border-white/5 pt-10">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white">
            Secure Voting Portal
          </h2>
          <p className="mt-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
            Review the candidates below and cast your vote in each category.
          </p>
        </div>

        {/* Access is securely isolated by the Google OAuth Domain Guard */}
        <AuthGuard>
          <VotingConsole contestants={contestants} />
        </AuthGuard>
      </div>

      {/* 4. Public Live Standings Leaderboard */}
      <div className="border-t border-neutral-200/60 dark:border-white/5 pt-10">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white">
            Live Election Standings
          </h2>
          <p className="mt-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
            Real-time aggregate totals calculated securely. Individual voters are kept strictly anonymous.
          </p>
        </div>

        <Leaderboard entries={leaderboard} />
      </div>

      {/* Mounting Toast Provider for reactive actions feedback */}
      <Toaster position="bottom-right" />
    </div>
  )
}

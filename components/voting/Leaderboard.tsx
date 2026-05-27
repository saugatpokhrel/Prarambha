// components/voting/Leaderboard.tsx
"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { LeaderboardEntry } from "@/lib/supabase/voting"
import { Award, Trophy, Users } from "lucide-react"

interface LeaderboardProps {
  entries: LeaderboardEntry[]
}

/**
 * Leaderboard displays real-time, privacy-preserving event statistics.
 * Computes category-relative percentages and renders top-three medals.
 */
export function Leaderboard({ entries }: LeaderboardProps) {
  // 1. Partition entries by category
  const mrEntries = entries
    .filter((e) => e.category === "mr")
    .sort((a, b) => b.vote_count - a.vote_count)

  const missEntries = entries
    .filter((e) => e.category === "miss")
    .sort((a, b) => b.vote_count - a.vote_count)

  // 2. Sum up total category votes for percentages
  const totalMrVotes = mrEntries.reduce((acc, curr) => acc + curr.vote_count, 0)
  const totalMissVotes = missEntries.reduce((acc, curr) => acc + curr.vote_count, 0)

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return (
          <span className="p-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 rounded-lg flex items-center justify-center">
            <Trophy className="size-4 animate-bounce-short" />
          </span>
        )
      case 1:
        return (
          <span className="p-1.5 bg-slate-350/15 text-slate-400 border border-slate-400/30 rounded-lg flex items-center justify-center">
            <Award className="size-4" />
          </span>
        )
      case 2:
        return (
          <span className="p-1.5 bg-amber-700/10 text-amber-700 dark:text-amber-500 border border-amber-750/30 rounded-lg flex items-center justify-center">
            <Award className="size-4" />
          </span>
        )
      default:
        return (
          <span className="w-7 h-7 flex items-center justify-center font-bold text-xs text-gray-400 border border-neutral-200/50 dark:border-white/5 rounded-lg">
            {index + 1}
          </span>
        )
    }
  }

  const renderRankingsList = (list: LeaderboardEntry[], totalVotes: number) => {
    if (list.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 border border-dashed border-neutral-200 dark:border-white/10 rounded-2xl text-gray-400 text-xs">
          <Users className="size-8 opacity-40 mb-2" />
          No contestants registered yet.
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {list.map((entry, index) => {
          const voteShare = totalVotes > 0 ? (entry.vote_count / totalVotes) * 100 : 0
          const imageUrl =
            entry.image_url ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100"

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-2xl bg-white/40 dark:bg-neutral-900/15 border border-neutral-100 dark:border-white/5 shadow-sm"
            >
              {/* Rank Medal */}
              <div className="flex-shrink-0 w-8 flex items-center justify-center">
                {getRankBadge(index)}
              </div>

              {/* Contestant Avatar */}
              <div className="relative size-11 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 shadow-inner">
                <Image
                  src={imageUrl}
                  alt={entry.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>

              {/* Name & Progress Bar Column */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h5 className="font-semibold text-sm text-neutral-900 dark:text-white truncate">
                    {entry.name}
                  </h5>
                  <div className="flex items-baseline gap-1 text-xs">
                    <span className="font-bold text-rose-955 dark:text-rose-455">
                      {entry.vote_count}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      ({voteShare.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar container */}
                <div className="w-full h-2 bg-neutral-200/50 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${voteShare}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-rose-955 to-rose-400 dark:from-rose-900 dark:to-rose-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
      {/* Mr. Freshers Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-neutral-200 dark:border-white/10 bg-white/60 dark:bg-black/25 backdrop-blur-xl p-6 sm:p-8 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
            <Trophy className="size-5" />
          </span>
          <div>
            <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
              Mr. Freshers Leaderboard
            </h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold mt-0.5">
              Live Standings • {totalMrVotes} Total Votes
            </p>
          </div>
        </div>

        {renderRankingsList(mrEntries, totalMrVotes)}
      </motion.div>

      {/* Miss Freshers Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-3xl border border-neutral-200 dark:border-white/10 bg-white/60 dark:bg-black/25 backdrop-blur-xl p-6 sm:p-8 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
            <Trophy className="size-5" />
          </span>
          <div>
            <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
              Miss Freshers Leaderboard
            </h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold mt-0.5">
              Live Standings • {totalMissVotes} Total Votes
            </p>
          </div>
        </div>

        {renderRankingsList(missEntries, totalMissVotes)}
      </motion.div>
    </div>
  )
}

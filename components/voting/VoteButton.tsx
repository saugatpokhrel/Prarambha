// components/voting/VoteButton.tsx
"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, Heart, Loader2, Lock } from "lucide-react"

interface VoteButtonProps {
  isVoted: boolean
  hasVotedInCategory: boolean
  isLoading: boolean
  onClick: () => void
}

/**
 * VoteButton provides an interactive state-aware button for casting a vote.
 * Employs micro-animations, loaders, and distinct visuals for locked or voted states.
 */
export function VoteButton({
  isVoted,
  hasVotedInCategory,
  isLoading,
  onClick,
}: VoteButtonProps) {
  // 1. Loading State
  if (isLoading) {
    return (
      <Button
        disabled
        className="w-full py-6 rounded-xl bg-rose-955/40 text-rose-300 dark:bg-rose-950/40 border border-rose-900/20 flex items-center justify-center gap-2 cursor-not-allowed"
      >
        <Loader2 className="size-4 animate-spin text-rose-400" />
        Recording vote...
      </Button>
    )
  }

  // 2. User has already voted for this exact contestant
  if (isVoted) {
    return (
      <motion.div
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <Button
          disabled
          className="w-full py-6 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-2 cursor-not-allowed font-bold"
        >
          <Check className="size-4 text-emerald-500 animate-pulse" />
          Voted ✓
        </Button>
      </motion.div>
    )
  }

  // 3. User has voted in this category, but for a different contestant (vote is locked)
  if (hasVotedInCategory) {
    return (
      <Button
        disabled
        className="w-full py-6 rounded-xl bg-neutral-100 dark:bg-neutral-900/50 text-gray-400 dark:text-gray-600 border border-neutral-200/50 dark:border-white/5 flex items-center justify-center gap-2 cursor-not-allowed font-medium text-xs uppercase tracking-wider"
      >
        <Lock className="size-3.5" />
        Vote Locked
      </Button>
    )
  }

  // 4. Active state (voter can cast vote)
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="w-full"
    >
      <Button
        onClick={onClick}
        className="w-full py-6 rounded-xl bg-rose-900 hover:bg-rose-800 text-white dark:bg-rose-900/80 dark:hover:bg-rose-850 font-bold transition-all duration-300 shadow-md shadow-rose-900/10 hover:shadow-rose-900/25 flex items-center justify-center gap-2 cursor-pointer border border-rose-800/10"
      >
        <Heart className="size-4 text-rose-350 fill-rose-350/20 group-hover:fill-rose-350" />
        Cast Vote
      </Button>
    </motion.div>
  )
}

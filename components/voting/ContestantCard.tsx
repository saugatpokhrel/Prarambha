// components/voting/ContestantCard.tsx
"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Contestant } from "@/lib/supabase/voting"
import { VoteButton } from "./VoteButton"
import { Sparkles } from "lucide-react"

interface ContestantCardProps {
  contestant: Contestant
  isVoted: boolean
  hasVotedInCategory: boolean
  isLoading: boolean
  onVote: (id: string) => void
}

/**
 * ContestantCard displays high-fidelity individual contestant profiles.
 * Features hover-scaling, rose-palette glowing boundaries if voted, and glassmorphism.
 */
export function ContestantCard({
  contestant,
  isVoted,
  hasVotedInCategory,
  isLoading,
  onVote,
}: ContestantCardProps) {
  // Use a high-quality placeholder image if none is provided
  const imageUrl =
    contestant.image_url ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=400"

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-3xl border backdrop-blur-xl bg-white/60 dark:bg-neutral-900/40 p-4 transition-all duration-300 shadow-lg ${
        isVoted
          ? "border-rose-500/60 dark:border-rose-450 ring-2 ring-rose-500/20 dark:ring-rose-400/10 shadow-rose-955/5"
          : "border-neutral-200/80 dark:border-white/10 hover:border-rose-900/30 dark:hover:border-white/20"
      }`}
    >
      {/* Voted badge overlay */}
      {isVoted && (
        <span className="absolute top-6 right-6 z-10 inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
          <Sparkles className="size-3" />
          My Pick
        </span>
      )}

      {/* Contestant Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 shadow-inner group">
        <Image
          src={imageUrl}
          alt={contestant.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          className="object-cover object-center rounded-2xl transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 rounded-2xl" />
      </div>

      {/* Card Info Area */}
      <div className="mt-4 mb-5 flex flex-col justify-between flex-grow min-h-[90px]">
        <div>
          <h3 className="font-bold text-lg md:text-xl text-neutral-900 dark:text-white group-hover:text-rose-900 dark:group-hover:text-rose-400 transition-colors duration-200">
            {contestant.name}
          </h3>
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium line-clamp-3">
            {contestant.bio || "No bio available for this contestant yet. Event participant for Prarambha 2082."}
          </p>
        </div>
      </div>

      {/* Action Button at bottom */}
      <div className="mt-auto">
        <VoteButton
          isVoted={isVoted}
          hasVotedInCategory={hasVotedInCategory}
          isLoading={isLoading}
          onClick={() => onVote(contestant.id)}
        />
      </div>
    </motion.div>
  )
}

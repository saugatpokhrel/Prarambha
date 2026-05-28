// components/voting/ContestantCard.tsx
"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Contestant } from "@/lib/supabase/voting"
import { VoteButton } from "./VoteButton"
import { Sparkles, GraduationCap } from "lucide-react"
import { MrAvatar, MissAvatar } from "@/components/ui/CategoryAvatar"

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
  const Avatar = contestant.category === "mr" ? MrAvatar : MissAvatar

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
        {contestant.image_url ? (
          <Image
            src={contestant.image_url}
            alt={contestant.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            className="object-cover object-center rounded-2xl transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Avatar className="w-full h-full transition-transform duration-500 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 rounded-2xl" />
      </div>

      {/* Card Info Area */}
      <div className="mt-4 mb-5 flex flex-col justify-between flex-grow min-h-[90px]">
        <div>
          <h3 className="font-bold text-lg md:text-xl text-neutral-900 dark:text-white group-hover:text-rose-900 dark:group-hover:text-rose-400 transition-colors duration-200">
            {contestant.name}
          </h3>
          {contestant.department && (
            <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-full">
              <GraduationCap className="size-3" />
              {contestant.department}
            </span>
          )}
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium line-clamp-3">
            {contestant.bio || "Event participant for Prarambha 2082."}
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

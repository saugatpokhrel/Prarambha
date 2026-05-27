// components/voting/VotingStats.tsx
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LeaderboardEntry } from "@/lib/supabase/voting"
import { Calendar, CheckSquare, Clock, Users } from "lucide-react"

interface VotingStatsProps {
  entries: LeaderboardEntry[]
}

/**
 * VotingStats renders dynamic high-fidelity counters and a live poll closure timer.
 */
export function VotingStats({ entries }: VotingStatsProps) {
  const totalVotes = entries.reduce((acc, curr) => acc + curr.vote_count, 0)
  const totalContestants = entries.length

  // State for poll countdown
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Set target date for poll closure (e.g. June 15, 2026)
    const targetDate = new Date("2026-06-15T18:00:00+05:45")

    function updateCountdown() {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  const statCards = [
    {
      icon: <CheckSquare className="size-5 text-rose-500" />,
      title: "Total Ballots Cast",
      value: totalVotes,
      description: "Live verified submissions",
    },
    {
      icon: <Users className="size-5 text-rose-500" />,
      title: "Vying Contestants",
      value: totalContestants,
      description: "Batch of 2082 participants",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 my-8">
      {/* Metric Cards */}
      {statCards.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="p-6 rounded-3xl border border-neutral-200/60 dark:border-white/10 bg-white/60 dark:bg-neutral-900/15 backdrop-blur-xl shadow-md flex items-center gap-4 relative overflow-hidden"
        >
          <div className="p-3.5 bg-rose-500/10 text-rose-500 rounded-2xl shadow-inner flex-shrink-0">
            {stat.icon}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none mb-1.5">
              {stat.title}
            </p>
            <h4 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white leading-none mb-1">
              {stat.value}
            </h4>
            <p className="text-[10px] text-gray-400 dark:text-rose-300/60 font-medium">
              {stat.description}
            </p>
          </div>
        </motion.div>
      ))}

      {/* Visual Countdown Timer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="p-6 rounded-3xl border border-neutral-200/60 dark:border-white/10 bg-white/60 dark:bg-neutral-900/15 backdrop-blur-xl shadow-md flex flex-col justify-center relative overflow-hidden"
      >
        <div className="flex items-center gap-2 mb-2">
          <Clock className="size-4 text-rose-500" />
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none">
            Poll Closure In
          </p>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-center">
          <div>
            <span className="block text-xl font-extrabold text-neutral-900 dark:text-white leading-none">
              {String(timeLeft.days).padStart(2, "0")}
            </span>
            <span className="text-[8px] uppercase tracking-wider text-gray-400 font-sans font-bold">
              Days
            </span>
          </div>
          <span className="text-lg font-bold text-gray-400 leading-none -mt-3">:</span>
          <div>
            <span className="block text-xl font-extrabold text-neutral-900 dark:text-white leading-none">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[8px] uppercase tracking-wider text-gray-400 font-sans font-bold">
              Hrs
            </span>
          </div>
          <span className="text-lg font-bold text-gray-400 leading-none -mt-3">:</span>
          <div>
            <span className="block text-xl font-extrabold text-neutral-900 dark:text-white leading-none">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-[8px] uppercase tracking-wider text-gray-400 font-sans font-bold">
              Min
            </span>
          </div>
          <span className="text-lg font-bold text-gray-400 leading-none -mt-3">:</span>
          <div>
            <span className="block text-xl font-extrabold text-rose-955 dark:text-rose-455 leading-none animate-pulse">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-[8px] uppercase tracking-wider text-gray-400 font-sans font-bold">
              Sec
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// components/voting/CategoryTabs.tsx
"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CategoryTabsProps {
  activeCategory: "mr" | "miss"
  onChange: (category: "mr" | "miss") => void
}

/**
 * CategoryTabs provides a high-fidelity slider tab system for switching categories.
 * Employs Framer Motion layout animations for a premium fluid sliding pill transition.
 */
export function CategoryTabs({ activeCategory, onChange }: CategoryTabsProps) {
  const tabs = [
    { id: "mr" as const, label: "Mr. Freshers", subtitle: "Male Contestants" },
    { id: "miss" as const, label: "Miss Freshers", subtitle: "Female Contestants" },
  ]

  return (
    <div className="flex justify-center my-6">
      <div className="flex p-1.5 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-neutral-200/60 dark:border-white/5 backdrop-blur-md max-w-md w-full shadow-inner relative z-0">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative flex-1 py-3 px-4 rounded-xl text-center transition-colors duration-300 font-semibold focus:outline-none flex flex-col items-center justify-center cursor-pointer",
                isActive
                  ? "text-rose-955 dark:text-rose-350"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              )}
            >
              {/* Sliding Pill Background using Framer Motion layoutId */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-white dark:bg-white/10 rounded-xl shadow-sm border border-neutral-200/20 dark:border-white/10 -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              
              <span className="text-sm md:text-base leading-tight">
                {tab.label}
              </span>
              <span className="text-[10px] opacity-75 font-normal tracking-wide mt-0.5 hidden sm:inline">
                {tab.subtitle}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

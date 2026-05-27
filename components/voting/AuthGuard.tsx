// components/voting/AuthGuard.tsx
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, ShieldCheck, UserCheck } from "lucide-react"
import { toast } from "sonner"
import { Contestant } from "@/lib/supabase/voting"
import { castVote, getUserVotes } from "@/app/actions/voting"
import { CategoryTabs } from "./CategoryTabs"
import { ContestantCard } from "./ContestantCard"

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * AuthGuard is a Client Component that secures the voting system interfaces.
 * Displays user authentication details or forces Google Sign-in restrictable by domain.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getUser()

    // Listen for auth changes reactively
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        queryParams: {
          hd: "tcioe.edu.np", // Direct Google Auth UI to prioritize or limit to college email domain
        },
      },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] py-12">
        <div className="size-10 border-4 border-rose-900 border-t-rose-400 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm font-medium tracking-wide">
          Verifying secure credentials...
        </p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-3xl border border-neutral-200 dark:border-white/10 bg-white/60 dark:bg-black/30 backdrop-blur-xl p-8 shadow-xl relative overflow-hidden"
        >
          {/* Accent top boundary gradient */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-900 via-rose-500 to-rose-900"></div>
          
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl mb-6 shadow-inner">
              <ShieldCheck className="size-12 animate-pulse" />
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
              Student Authorization Required
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-8 leading-relaxed max-w-sm">
              To guarantee absolute fairness and limit voting strictly to departments of Thapathali Campus, IOE, you must sign in with your official <span className="font-semibold text-rose-500">@tcioe.edu.np</span> Google account.
            </p>

            <Button
              onClick={handleSignIn}
              size="lg"
              className="w-full bg-rose-900 hover:bg-rose-800 text-white dark:bg-rose-900 dark:hover:bg-rose-800 font-semibold tracking-wide py-6 rounded-2xl transition-all duration-300 shadow-md shadow-rose-900/25 hover:shadow-rose-900/40 flex items-center justify-center gap-3 border border-rose-800/20"
            >
              <LogIn className="size-5" />
              Sign In with Google
            </Button>

            <div className="mt-6 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <span className="size-2 rounded-full bg-emerald-500 animate-ping"></span>
              Secure OAuth2 Domain Gate Active
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Dynamic authenticated banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/40 dark:bg-neutral-900/20 backdrop-blur-md shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl shadow-inner">
            <UserCheck className="size-5" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-left">
              Authorized Student Voter
            </p>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              {user.user_metadata?.full_name || user.user_metadata?.name || "Student Voter"}
            </h4>
            <p className="text-xs text-gray-500 dark:text-rose-450 font-medium text-left">
              {user.email}
            </p>
          </div>
        </div>
        <Button
          onClick={handleSignOut}
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 dark:text-gray-400 dark:hover:text-rose-400 dark:hover:bg-rose-500/5 transition-all duration-200 rounded-xl font-semibold text-xs tracking-wider uppercase px-4 py-2"
        >
          <LogOut className="size-4 mr-2" />
          Sign Out
        </Button>
      </motion.div>

      {/* Renders main voting UI under protection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  )
}

interface VotingConsoleProps {
  contestants: Contestant[]
}

/**
 * VotingConsole coordinates client states for active tab category,
 * current voter's vote cast checklist, and handles action execution transitions.
 */
export function VotingConsole({ contestants }: VotingConsoleProps) {
  const [category, setCategory] = useState<"mr" | "miss">("mr")
  const [userVotes, setUserVotes] = useState<{ contestant_id: string; category: "mr" | "miss" }[]>([])
  const [votingId, setVotingId] = useState<string | null>(null)

  // Load the authenticated user's existing choices to freeze buttons
  useEffect(() => {
    async function loadVotes() {
      try {
        const votes = await getUserVotes()
        setUserVotes(votes)
      } catch (err) {
        console.error("Failed to load user votes:", err)
      }
    }
    loadVotes()
  }, [])

  const filteredContestants = contestants.filter((c) => c.category === category)
  const hasVotedInCategory = userVotes.some((v) => v.category === category)

  const handleVote = async (contestantId: string) => {
    setVotingId(contestantId)
    
    // Create standard loading Sonner toast
    const toastId = toast.loading("Registering your vote securely...")

    try {
      const result = await castVote(contestantId, category)
      
      if (result.success) {
        toast.success("Vote registered successfully! Thank you for participating.", { id: toastId })
        setUserVotes((prev) => [...prev, { contestant_id: contestantId, category }])
      } else {
        toast.error(result.error || "Failed to submit vote. Please try again.", { id: toastId })
      }
    } catch (err) {
      toast.error("A network communication error occurred.", { id: toastId })
    } finally {
      setVotingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Category selector */}
      <CategoryTabs activeCategory={category} onChange={setCategory} />

      {/* Grid of Contestants */}
      {filteredContestants.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400 font-medium">
          No candidates registered in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContestants.map((contestant) => {
            const isVoted = userVotes.some((v) => v.contestant_id === contestant.id)
            return (
              <ContestantCard
                key={contestant.id}
                contestant={contestant}
                isVoted={isVoted}
                hasVotedInCategory={hasVotedInCategory}
                isLoading={votingId === contestant.id}
                onVote={handleVote}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

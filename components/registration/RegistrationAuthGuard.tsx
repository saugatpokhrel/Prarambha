// components/registration/RegistrationAuthGuard.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Candidate } from "@/types/index";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Shield } from "lucide-react";
import { getUserRegistration } from "@/app/actions/registration";

interface RegistrationAuthGuardProps {
  children: (candidate: Candidate | null) => React.ReactNode;
}

/**
 * RegistrationAuthGuard protects the registration form with authentication
 */
export function RegistrationAuthGuard({
  children,
}: RegistrationAuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function initializeAuth() {
      try {
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        // If user exists, fetch their registration
        if (session?.user) {
          const registration = await getUserRegistration();
          setCandidate(registration);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        const registration = await getUserRegistration();
        setCandidate(registration);
      } else {
        setCandidate(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/registration`,
        queryParams: {
          hd: "tcioe.edu.np",
        },
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
        <div className="size-12 border-4 border-rose-900 border-t-rose-400 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm font-medium tracking-wide">
          Verifying your credentials...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-lg text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-rose-100 dark:bg-rose-900/30 p-4 rounded-full">
              <Shield className="w-8 h-8 text-rose-600 dark:text-rose-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            Sign In Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You must sign in with your <strong>@tcioe.edu.np</strong> email
            account to register as a candidate for Mr/Miss Fresher 2082.
          </p>

          <div className="flex justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSignIn}
                className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Sign in with Google
              </Button>
            </motion.div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Only student accounts with @tcioe.edu.np domain are allowed
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      {/* User Info Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-rose-600">
              <span className="text-white font-semibold text-sm">
                {user.email?.[0].toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">
              {user.user_metadata?.full_name || "Student"}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSignOut}
          className="text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 flex items-center gap-1"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </motion.button>
      </motion.div>

      {/* Main Content */}
      {children(candidate)}
    </div>
  );
}

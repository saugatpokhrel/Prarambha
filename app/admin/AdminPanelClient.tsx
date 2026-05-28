"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export default function AdminPanelClient({
  authorizedAdmins,
}: {
  authorizedAdmins: string[];
}) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        setSession(currentSession);

        if (!currentSession) {
          setLoading(false);
          return;
        }

        const userEmail = (currentSession.user?.email || "").toLowerCase();
        setIsAdmin(authorizedAdmins.includes(userEmail));
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        const userEmail = (session.user?.email || "").toLowerCase();
        setIsAdmin(authorizedAdmins.includes(userEmail));
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, authorizedAdmins]);

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=/admin`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
      setSession(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 p-4">
        <div className="max-w-md w-full bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 text-center space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              Admin Panel
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Sign in with your Google account to access the admin dashboard.
            </p>
          </div>
          <Button
            onClick={handleSignIn}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white"
          >
            Sign in with Google
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 p-4">
        <div className="max-w-md w-full bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 text-center space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              Access Denied
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              You do not have permission to access this panel. Signed in as{" "}
              <strong>{session.user?.email}</strong>.
            </p>
          </div>
          <Button
            onClick={handleSignOut}
            className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-900"
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 mt-20">
      <div className="p-4 sm:p-2">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Admin Dashboard
          </h1>
          <Button
            onClick={handleSignOut}
            className="bg-neutral-200 hover:bg-neutral-300 text-neutral-900"
          >
            Sign out
          </Button>
        </div>
        <AdminDashboard />
        <Toaster position="bottom-right" />
      </div>
    </div>
  );
}

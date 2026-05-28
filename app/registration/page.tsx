"use client";

import { RegistrationAuthGuard } from "@/components/registration/RegistrationAuthGuard";
import { RegistrationManager } from "@/components/registration/RegistrationManager";
import { Heart, Star, Award } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export default function RegistrationPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black mt-20">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100 dark:bg-rose-900/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 mb-4">
            <Star className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span className="text-sm font-semibold text-rose-700 dark:text-rose-300">
              Mr &amp; Miss Fresher 2082
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white mb-4">
            Become a Candidate
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join the Mr &amp; Miss Fresher competition and showcase your talent!
            Register below to start your journey.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            {
              icon: Heart,
              title: "Fair Voting",
              description: "Transparent voting system for all students",
            },
            {
              icon: Award,
              title: "Recognition",
              description: "Get recognized as a campus personality",
            },
            {
              icon: Star,
              title: "Exclusive Access",
              description: "Special privileges and opportunities",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 text-center hover:border-rose-300 dark:hover:border-rose-700 transition-all"
            >
              <feature.icon className="w-8 h-8 text-rose-600 dark:text-rose-400 mx-auto mb-3" />
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Main Registration Section */}
        <RegistrationAuthGuard>
          {(candidate) => <RegistrationManager initialData={candidate} />}
        </RegistrationAuthGuard>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
            Important Information
          </h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-400 text-sm">
            <li>✓ Only @tcioe.edu.np email accounts are allowed to register</li>
            <li>✓ One registration per student is allowed</li>
            <li>
              ✓ Your registration will be reviewed and approved by
              administrators
            </li>
            <li>
              ✓ You can edit your registration only while it&apos;s in pending
              status
            </li>
            <li>
              ✓ Once approved, you become an official candidate and can be voted
              for
            </li>
          </ul>
        </div>
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
}

// app/voting/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Loading component provides the Suspense fallback skeleton for the `/voting` route.
 * Replicates the structure of the Voting page for visual consistency.
 */
export default function VotingLoading() {
  return (
    <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8 space-y-12 max-w-7xl">
      {/* 1. Hero Area Skeleton */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto py-10">
        {/* Badge Skeleton */}
        <Skeleton className="h-6 w-44 rounded-full" />
        
        {/* Title Skeletons */}
        <div className="space-y-3 w-full">
          <Skeleton className="h-12 md:h-16 w-3/4 mx-auto rounded-2xl animate-pulse" />
          <Skeleton className="h-12 md:h-16 w-1/2 mx-auto rounded-2xl" />
        </div>
        
        {/* Subtitle Skeletons */}
        <div className="space-y-2 w-full pt-4">
          <Skeleton className="h-4 w-5/6 mx-auto rounded-md" />
          <Skeleton className="h-4 w-4/6 mx-auto rounded-md" />
        </div>
      </div>

      {/* 2. Guidelines Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-2xl border border-neutral-200/50 dark:border-white/5 bg-white/40 dark:bg-neutral-900/10 space-y-4">
            <Skeleton className="size-11 rounded-xl" />
            <Skeleton className="h-5 w-1/2 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-5/6 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Metric Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-3xl border border-neutral-200/50 dark:border-white/5 bg-white/40 dark:bg-neutral-900/10 flex items-center gap-4">
            <Skeleton className="size-12 rounded-2xl flex-shrink-0" />
            <div className="space-y-2 flex-grow">
              <Skeleton className="h-3 w-2/5 rounded" />
              <Skeleton className="h-7 w-3/5 rounded-md" />
              <Skeleton className="h-2 w-4/5 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* 4. Tab Slider Skeleton */}
      <div className="flex justify-center py-6">
        <Skeleton className="h-14 w-80 rounded-2xl" />
      </div>

      {/* 5. Contestant Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto pt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-3xl border border-neutral-200/50 dark:border-white/5 bg-white/40 dark:bg-neutral-900/10 space-y-4">
            {/* Image Aspect ratio placeholder */}
            <Skeleton className="aspect-[3/4] w-full rounded-2xl animate-pulse" />
            {/* Name and bio skeletons */}
            <div className="space-y-3 py-2">
              <Skeleton className="h-6 w-2/3 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-4/5 rounded" />
              </div>
            </div>
            {/* Button Skeleton */}
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}

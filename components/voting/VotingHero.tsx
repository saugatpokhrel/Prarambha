// components/voting/VotingHero.tsx
import { Info, Shield, Vote } from "lucide-react"

/**
 * VotingHero renders a beautiful, premium visual introduction for the freshers voting segment.
 * Includes event theme descriptions and essential voting rules to educate users.
 */
export function VotingHero() {
  const guidelines = [
    {
      icon: <Shield className="size-5 text-rose-500" />,
      title: "Student Verification",
      description: "Login with your official @tcioe.edu.np Google account. All other domains are securely restricted.",
    },
    {
      icon: <Vote className="size-5 text-rose-500" />,
      title: "One Vote Limit",
      description: "Cast exactly one vote in each category (Mr. Freshers and Miss Freshers). Once submitted, votes are permanent.",
    },
    {
      icon: <Info className="size-5 text-rose-500" />,
      title: "Privacy First",
      description: "Your individual vote choice is kept anonymous. Only aggregate vote totals are displayed on the public standings.",
    },
  ]

  return (
    <section className="relative py-10 md:py-16 text-center overflow-hidden">
      {/* Decorative ambient blobs in background */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-rose-900/10 dark:bg-rose-500/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute -top-10 left-1/3 w-60 h-60 bg-rose-500/5 dark:bg-rose-955/5 blur-[100px] rounded-full -z-10 animate-pulse" />

      {/* Main Title Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/5 dark:bg-rose-900/35 border border-rose-900/20 text-rose-900 dark:text-rose-350 text-xs md:text-sm font-semibold tracking-wide mb-6">
        <Vote className="size-4 animate-bounce-short" />
        Departmental Event segment
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white max-w-4xl mx-auto leading-tight">
        Prarambha 2082 <br className="sm:hidden" />
        <span className="bg-gradient-to-r from-rose-955 via-rose-500 to-rose-455 dark:from-rose-900 dark:via-rose-400 dark:to-rose-300 bg-clip-text text-transparent">
          Mr & Miss Freshers
        </span>
      </h1>

      {/* Subtitle description */}
      <p className="mt-6 text-gray-500 dark:text-gray-300 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
        Choose your class representatives for the electronics and computer engineering department. Cast your votes to support the most outstanding freshers of the batch of 2082!
      </p>

      {/* Glassmorphic Guidelines Grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left px-4">
        {guidelines.map((guide, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl border border-neutral-200/60 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-md hover:border-rose-900/20 dark:hover:border-white/10 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="p-3 bg-rose-500/5 dark:bg-rose-950/20 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-inner">
              {guide.icon}
            </div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-white mt-4 mb-2">
              {guide.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              {guide.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

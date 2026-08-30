/**
 * Pre-built avatar options for user profiles.
 * Each avatar is a gradient + pattern combo rendered purely with CSS.
 * Stored as an ID string in the database.
 */

export interface AvatarOption {
  id: string
  label: string
  gradient: string       // CSS gradient for background
  textColor: string      // Tailwind text color class
  borderColor: string    // Tailwind border color class
  pattern?: string       // Optional decorative SVG pattern overlay
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: "sunset",
    label: "Sunset",
    gradient: "linear-gradient(135deg, #F97316 0%, #EC4899 100%)",
    textColor: "text-white",
    borderColor: "border-orange-500/40",
  },
  {
    id: "ocean",
    label: "Ocean",
    gradient: "linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)",
    textColor: "text-white",
    borderColor: "border-sky-500/40",
  },
  {
    id: "forest",
    label: "Forest",
    gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    textColor: "text-white",
    borderColor: "border-emerald-500/40",
  },
  {
    id: "lavender",
    label: "Lavender",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)",
    textColor: "text-white",
    borderColor: "border-violet-500/40",
  },
  {
    id: "ember",
    label: "Ember",
    gradient: "linear-gradient(135deg, #EF4444 0%, #F97316 100%)",
    textColor: "text-white",
    borderColor: "border-red-500/40",
  },
  {
    id: "midnight",
    label: "Midnight",
    gradient: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
    textColor: "text-slate-200",
    borderColor: "border-slate-500/40",
  },
  {
    id: "gold",
    label: "Gold",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    textColor: "text-white",
    borderColor: "border-amber-500/40",
  },
  {
    id: "rose",
    label: "Rose",
    gradient: "linear-gradient(135deg, #F43F5E 0%, #FB7185 100%)",
    textColor: "text-white",
    borderColor: "border-rose-500/40",
  },
  {
    id: "teal",
    label: "Teal",
    gradient: "linear-gradient(135deg, #14B8A6 0%, #2DD4BF 100%)",
    textColor: "text-white",
    borderColor: "border-teal-500/40",
  },
  {
    id: "slate",
    label: "Slate",
    gradient: "linear-gradient(135deg, #475569 0%, #64748B 100%)",
    textColor: "text-slate-100",
    borderColor: "border-slate-400/40",
  },
  {
    id: "coral",
    label: "Coral",
    gradient: "linear-gradient(135deg, #FB923C 0%, #F472B6 100%)",
    textColor: "text-white",
    borderColor: "border-orange-400/40",
  },
  {
    id: "arctic",
    label: "Arctic",
    gradient: "linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)",
    textColor: "text-white",
    borderColor: "border-blue-400/40",
  },
]

/**
 * Retrieve an avatar option by ID.
 * Returns a default (orange/amber) gradient if no match is found.
 */
export function getAvatarById(id: string | undefined | null): AvatarOption {
  if (!id) {
    return {
      id: "",
      label: "Default",
      gradient: "linear-gradient(135deg, rgba(249,115,22,0.2) 0%, rgba(245,158,11,0.1) 100%)",
      textColor: "text-orange-400",
      borderColor: "border-orange-500/30",
    }
  }
  return AVATAR_OPTIONS.find((a) => a.id === id) || AVATAR_OPTIONS[0]
}

import React from "react"
import {
  IconOwl,
  IconRocket,
  IconZap,
  IconAtom,
  IconCode,
  IconTarget,
  IconTrophy,
  IconBrain,
  IconShield,
  IconCompass,
  IconFlame,
  IconBookOpen,
} from "@/app/components/ui/icons"

export interface AvatarOption {
  id: string
  label: string
  gradient: string       // CSS gradient for background
  textColor: string      // Tailwind text color class
  borderColor: string    // Tailwind border color class
  iconName?: string      // Vector icon key (e.g. "owl", "rocket", "zap")
  category?: "gradient" | "persona"
  pattern?: string       // Optional decorative SVG pattern overlay
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  // ── Academic Personas & Vector Badges ─────────────────────────────
  {
    id: "scholar-owl",
    label: "Scholar Owl",
    gradient: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
    textColor: "text-blue-100",
    borderColor: "border-blue-400/50",
    iconName: "owl",
    category: "persona",
  },
  {
    id: "rocket-voyager",
    label: "Rocket Voyager",
    gradient: "linear-gradient(135deg, #991B1B 0%, #F97316 100%)",
    textColor: "text-orange-100",
    borderColor: "border-orange-500/50",
    iconName: "rocket",
    category: "persona",
  },
  {
    id: "lightning-spark",
    label: "Lightning Spark",
    gradient: "linear-gradient(135deg, #92400E 0%, #FBBF24 100%)",
    textColor: "text-amber-100",
    borderColor: "border-amber-400/50",
    iconName: "zap",
    category: "persona",
  },
  {
    id: "lab-scientist",
    label: "Science Prodigy",
    gradient: "linear-gradient(135deg, #065F46 0%, #10B981 100%)",
    textColor: "text-emerald-100",
    borderColor: "border-emerald-400/50",
    iconName: "atom",
    category: "persona",
  },
  {
    id: "code-wizard",
    label: "Tech Wizard",
    gradient: "linear-gradient(135deg, #3730A3 0%, #6366F1 100%)",
    textColor: "text-indigo-100",
    borderColor: "border-indigo-400/50",
    iconName: "code",
    category: "persona",
  },
  {
    id: "target-focus",
    label: "Focus Master",
    gradient: "linear-gradient(135deg, #831843 0%, #EC4899 100%)",
    textColor: "text-pink-100",
    borderColor: "border-pink-400/50",
    iconName: "target",
    category: "persona",
  },
  {
    id: "champion-trophy",
    label: "Top Ranker",
    gradient: "linear-gradient(135deg, #78350F 0%, #F59E0B 100%)",
    textColor: "text-amber-100",
    borderColor: "border-amber-300/60",
    iconName: "trophy",
    category: "persona",
  },
  {
    id: "brain-thinker",
    label: "Deep Thinker",
    gradient: "linear-gradient(135deg, #4C1D95 0%, #8B5CF6 100%)",
    textColor: "text-purple-100",
    borderColor: "border-purple-400/50",
    iconName: "brain",
    category: "persona",
  },
  {
    id: "noble-lion",
    label: "Brave Leader",
    gradient: "linear-gradient(135deg, #7C2D12 0%, #EA580C 100%)",
    textColor: "text-orange-100",
    borderColor: "border-orange-400/50",
    iconName: "shield",
    category: "persona",
  },
  {
    id: "clever-fox",
    label: "Sharp Navigator",
    gradient: "linear-gradient(135deg, #9A3412 0%, #FB923C 100%)",
    textColor: "text-amber-100",
    borderColor: "border-amber-500/50",
    iconName: "compass",
    category: "persona",
  },
  {
    id: "fire-dragon",
    label: "Dragon Spirit",
    gradient: "linear-gradient(135deg, #7F1D1D 0%, #EF4444 100%)",
    textColor: "text-red-100",
    borderColor: "border-red-400/50",
    iconName: "flame",
    category: "persona",
  },
  {
    id: "book-scholar",
    label: "Polymath",
    gradient: "linear-gradient(135deg, #0C4A6E 0%, #0284C7 100%)",
    textColor: "text-sky-100",
    borderColor: "border-sky-400/50",
    iconName: "book",
    category: "persona",
  },

  // ── Color Gradients & Monograms ────────────────────────────
  {
    id: "sunset",
    label: "Sunset Flare",
    gradient: "linear-gradient(135deg, #F97316 0%, #EC4899 100%)",
    textColor: "text-white",
    borderColor: "border-orange-500/40",
    category: "gradient",
  },
  {
    id: "ocean",
    label: "Ocean Depth",
    gradient: "linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)",
    textColor: "text-white",
    borderColor: "border-sky-500/40",
    category: "gradient",
  },
  {
    id: "forest",
    label: "Emerald Canopy",
    gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    textColor: "text-white",
    borderColor: "border-emerald-500/40",
    category: "gradient",
  },
  {
    id: "lavender",
    label: "Violet Astral",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)",
    textColor: "text-white",
    borderColor: "border-violet-500/40",
    category: "gradient",
  },
  {
    id: "ember",
    label: "Molten Ember",
    gradient: "linear-gradient(135deg, #EF4444 0%, #F97316 100%)",
    textColor: "text-white",
    borderColor: "border-red-500/40",
    category: "gradient",
  },
  {
    id: "midnight",
    label: "Obsidian Slate",
    gradient: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
    textColor: "text-slate-200",
    borderColor: "border-slate-500/40",
    category: "gradient",
  },
  {
    id: "gold",
    label: "Imperial Gold",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    textColor: "text-white",
    borderColor: "border-amber-500/40",
    category: "gradient",
  },
  {
    id: "rose",
    label: "Rose Quartz",
    gradient: "linear-gradient(135deg, #F43F5E 0%, #FB7185 100%)",
    textColor: "text-white",
    borderColor: "border-rose-500/40",
    category: "gradient",
  },
  {
    id: "teal",
    label: "Teal Matrix",
    gradient: "linear-gradient(135deg, #14B8A6 0%, #2DD4BF 100%)",
    textColor: "text-white",
    borderColor: "border-teal-500/40",
    category: "gradient",
  },
  {
    id: "slate",
    label: "Titanium Metal",
    gradient: "linear-gradient(135deg, #475569 0%, #64748B 100%)",
    textColor: "text-slate-100",
    borderColor: "border-slate-400/40",
    category: "gradient",
  },
  {
    id: "coral",
    label: "Coral Dawn",
    gradient: "linear-gradient(135deg, #FB923C 0%, #F472B6 100%)",
    textColor: "text-white",
    borderColor: "border-orange-400/40",
    category: "gradient",
  },
  {
    id: "arctic",
    label: "Arctic Frost",
    gradient: "linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)",
    textColor: "text-white",
    borderColor: "border-blue-400/40",
    category: "gradient",
  },
  {
    id: "cyberpunk",
    label: "Cyber Neon",
    gradient: "linear-gradient(135deg, #06B6D4 0%, #EC4899 100%)",
    textColor: "text-white",
    borderColor: "border-cyan-400/50",
    category: "gradient",
  },
  {
    id: "aurora",
    label: "Northern Lights",
    gradient: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)",
    textColor: "text-white",
    borderColor: "border-emerald-400/50",
    category: "gradient",
  },
  {
    id: "nebula",
    label: "Cosmic Violet",
    gradient: "linear-gradient(135deg, #4F46E5 0%, #D946EF 100%)",
    textColor: "text-white",
    borderColor: "border-purple-400/50",
    category: "gradient",
  },
  {
    id: "solar",
    label: "Solar Flare",
    gradient: "linear-gradient(135deg, #F43F5E 0%, #FBBF24 100%)",
    textColor: "text-white",
    borderColor: "border-rose-400/50",
    category: "gradient",
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
      label: "Default Monogram",
      gradient: "linear-gradient(135deg, rgba(249,115,22,0.2) 0%, rgba(245,158,11,0.1) 100%)",
      textColor: "text-orange-400",
      borderColor: "border-orange-500/30",
    }
  }
  return AVATAR_OPTIONS.find((a) => a.id === id) || AVATAR_OPTIONS[0]
}

/**
 * Render crisp vector emblem or monogram letter initial.
 * Strictly avoids raw emojis to maintain a sleek, premium aesthetic.
 */
export function AvatarGlyph({
  iconName,
  initial,
  size = 18,
  className = "",
}: {
  iconName?: string
  initial?: string
  size?: number
  className?: string
}) {
  switch (iconName) {
    case "owl":
      return <IconOwl size={size} className={className} />
    case "rocket":
      return <IconRocket size={size} className={className} />
    case "zap":
      return <IconZap size={size} className={className} />
    case "atom":
      return <IconAtom size={size} className={className} />
    case "code":
      return <IconCode size={size} className={className} />
    case "target":
      return <IconTarget size={size} className={className} />
    case "trophy":
      return <IconTrophy size={size} className={className} />
    case "brain":
      return <IconBrain size={size} className={className} />
    case "shield":
      return <IconShield size={size} className={className} />
    case "compass":
      return <IconCompass size={size} className={className} />
    case "flame":
      return <IconFlame size={size} className={className} />
    case "book":
      return <IconBookOpen size={size} className={className} />
    default:
      return <span>{initial || "U"}</span>
  }
}

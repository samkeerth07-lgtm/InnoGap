import { Bot, Trash2, Sprout, Heart, Sparkles, Bookmark } from 'lucide-react'

export const ANALYSIS_ICONS = {
  bot: Bot,
  trash: Trash2,
  sprout: Sprout,
  heart: Heart,
  sparkles: Sparkles,
  bookmark: Bookmark,
}

// Used for analyses created at runtime (from the New Analysis form),
// since we don't yet know a more fitting icon for a freshly typed idea.
export const DEFAULT_NEW_ANALYSIS_ICON = 'sparkles'
export const DEFAULT_NEW_ANALYSIS_ICON_BG = 'bg-indigo-50 text-indigo-500'
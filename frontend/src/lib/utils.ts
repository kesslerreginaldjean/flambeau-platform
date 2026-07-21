import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Our theme adds custom color tokens (Swiss system + shadcn semantic names).
// tailwind-merge doesn't know them by default, so conflicting classes like
// `text-card-foreground` + `text-paper` would BOTH survive a cn() merge and the
// stylesheet order decides the winner (e.g. an invisible dark numeral on an ink
// card). Registering the tokens lets the LAST class win, as intended.
const COLOR_TOKENS = [
  // shadcn semantic
  "background", "foreground", "card", "card-foreground", "popover",
  "popover-foreground", "primary", "primary-foreground", "secondary",
  "secondary-foreground", "muted", "muted-foreground", "accent",
  "accent-foreground", "accent-ink", "destructive", "border", "input", "ring",
  // Swiss system
  "ink", "paper", "soft", "line", "panel",
]

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "text-color": [{ text: COLOR_TOKENS }],
      "bg-color": [{ bg: COLOR_TOKENS }],
      "border-color": [{ border: COLOR_TOKENS }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

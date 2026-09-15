import { notFound } from 'next/navigation'

// Catches every path under /[locale] that no other route matches. Without it,
// unmatched URLs are resolved at the routing level and render app/not-found.tsx
// outside the locale layout — no header, footer, or translations.
export default function CatchAllNotFound() {
  notFound()
}

/**
 * Colour-contrast debt that exists today, recorded so it cannot grow.
 *
 * Every pair below is a real WCAG AA failure found by axe. They are listed
 * rather than fixed because they are design decisions, not lint fixes. The
 * white/black/red/beige palette was picked to clear AA, which retired every
 * pair the old red, sky blue and cream produced; what is left is the status
 * colours (green, amber), which that palette does not touch.
 *
 * The suite fails on any pair that is NOT in this list, and on any violation
 * that is not colour-contrast at all (there are currently none of those).
 *
 * To burn this down: fix the token, delete the line. If a line stops appearing
 * the test does not complain — it only guards against new ones.
 *
 * Format: "<foreground> on <background>" as axe reports them, lowercase hex.
 */
export const KNOWN_CONTRAST_FAILURES: Record<string, string> = {
  // ── Worst first ──────────────────────────────────────────────────────────
  // The RDKit panel is forced to a white background so the depiction SVG reads,
  // but its loading text keeps the dark-theme grey. In dark mode the line
  // "Loading RDKit.js…" is very nearly invisible. This one is a bug, not a
  // palette trade-off.
  '#ced7e3 on #ffffff': '1.45 — RDKit panel loading text, dark theme',

  // Green = "after" in every before → after pair. Too light on the beige and
  // white surfaces at 16px.
  '#00a63e on #f5efe6': '2.81 — outcome "after" value on beige',
  '#00a63e on #ffffff': '3.21 — outcome "after" value on white',
  '#008236 on #f5efe6': '4.32 — outcome "after" value, KPI tile',

  // Inline code inside a callout.
  '#a65f00 on #f5efe6': '4.31 — code in a warning callout',
}

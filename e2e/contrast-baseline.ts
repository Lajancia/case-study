/**
 * Colour-contrast debt that exists today, recorded so it cannot grow.
 *
 * Every pair below is a real WCAG AA failure found by axe. They are listed
 * rather than fixed because they come from the brand palette — the red, the
 * sky blue and the cream are deliberate choices, and darkening them is a design
 * decision, not a lint fix.
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

  // Green = "after" in every before → after pair. Too light on the cream and
  // white surfaces at 16px.
  '#00a63e on #f5ebdd': '2.72 — outcome "after" value on cream',
  '#00a63e on #ffffff': '3.21 — outcome "after" value on white',
  '#008236 on #f6ecdd': '4.22 — outcome "after" value, KPI tile',

  // Brand sky/red as a button fill with white text.
  '#ffffff on #0ea5e9': '2.77 — primary CTA, dark theme',
  '#ffffff on #ff204e': '3.77 — primary CTA, light theme',
  '#ffffff on #0284c7': '4.09 — stack/expertise pills, dark theme',

  // Brand red as text: the industry eyebrow and outline-button label.
  '#ff204e on #ffffff': '3.77 — industry eyebrow label',
  '#ff204e on #f5ebdd': '3.19 — outline button label on cream',

  // Muted greys: the "before" value, the inactive locale, prose captions.
  '#7b8ea6 on #f5ebdd': '2.84 — struck-through "before" value on cream',
  '#7b8ea6 on #f6ecdd': '2.86 — struck-through "before" value, KPI tile',
  '#7b8ea6 on #ffffff': '3.35 — inactive locale in the language switcher',
  '#8395ab on #ffffff': '3.06 — muted prose text',
  '#64748b on #131f3d': '3.41 — "before" value, dark theme',
  '#64748b on #001736': '3.75 — KPI tile muted text, dark theme',
  '#64748b on #0b1329': '3.87 — inactive locale, dark theme',
  '#5f6f86 on #0b1329': '3.60 — muted prose text, dark theme',

  // Inline code inside a callout.
  '#a65f00 on #f5ebdd': '4.18 — code in a warning callout',
}

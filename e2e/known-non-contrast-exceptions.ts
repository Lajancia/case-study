import type { NodeResult } from 'axe-core'

/**
 * Non-colour-contrast accessibility debt that exists today, recorded so it
 * cannot grow — the same mechanism `contrast-baseline.ts` uses for colour, for
 * everything else axe checks.
 *
 * The suite fails outright on any violation that is not in this list (and, for
 * colour-contrast, is not in `contrast-baseline.ts`). A rule id alone is too
 * blunt to record here: axe's `scrollable-region-focusable` would otherwise
 * also excuse an unrelated future scrollable region that genuinely should be
 * fixed. Each entry names the rule and a predicate over the violating node,
 * so only the specific case that was actually decided gets a pass.
 */
export interface KnownNonContrastException {
  ruleId: string
  /** True only for the node this exception was written for. */
  matches: (node: NodeResult) => boolean
  reason: string
}

export const KNOWN_NON_CONTRAST_EXCEPTIONS: KnownNonContrastException[] = [
  {
    ruleId: 'scrollable-region-focusable',
    matches: (node) => node.target.some((t) => typeof t === 'string' && /^table\b/i.test(t)),
    reason:
      "A raw <table> written directly in an .mdx file is never routed through " +
      "the MDX `components` map (verified by compiling one), so it cannot be " +
      "given a focusable wrapper without a remark/rehype AST pass. `.prose " +
      "table` scrolls the table itself via `display: block; overflow-x: auto` " +
      "instead. That makes it a scroll container axe can see overflows, but " +
      "not one reachable by Tab — a keyboard-only user has no guaranteed way " +
      "to trigger the scroll. Accepted deliberately, scoped to table elements " +
      "only: a future scrollable region that is not this table should still " +
      "fail.",
  },
]

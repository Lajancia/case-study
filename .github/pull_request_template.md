## What and why

<!-- What changes, and the reason for it. Link the issue or measurement that prompted it. -->

## Trade-off

<!-- What this costs, or what it gives up. "None" is a claim too — say why. -->

## Verification

<!--
CONTRIBUTING.md §4. Paste what the commands printed, not "passes".
A skipped step is reported as skipped.
-->

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test`
- [ ] `npm run test:e2e`
- [ ] Runtime check (`next-dev-loop`, or `npm run build && npx next start` for headers, caching or anything served)

**New or changed tests** — seen failing before the fix? (Invariant 2)

<!-- Which test, and what it printed when it failed. -->

**Numbers or causes claimed above** — the command that measured each one: (Invariant 1)

<!-- e.g. `curl -sI https://soominlab.com/en | grep cache-control` → output -->

## Before merging

- [ ] Case study prose (`content/work/{en,ko}/*.mdx`) and README still true after this change
- [ ] Nothing added to `nginx/case-studies.conf` that belongs in `next.config.ts` / `proxy.ts`
- [ ] **Merging deploys to production.** Anything to do on the server or Cloudflare first?

<!-- Screenshots for visual changes: light and dark, desktop and mobile. -->

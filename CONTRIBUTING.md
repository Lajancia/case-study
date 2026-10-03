# Contributing

How to work in this repo. [`AGENTS.md`](AGENTS.md) is the entrypoint; this file is the detail.

Every rule below is here because it was broken once, in this repo, and shipped. The parenthetical
after each one says what happened.

## Global Invariants

1. **Measure before you claim.** Any statement about a cause, a size, a duration or a behaviour
   needs a command and its output. If you did not run it, say you did not.
   _(Shipped: "every visit re-downloads 2 MB of WASM" — it was a 304 and zero bytes.)_

2. **A passing test proves nothing until you have seen it fail.** Revert the fix, watch it go red,
   restore the fix, watch it go green.
   _(Shipped: a CSP that broke the RDKit viewer in production, under two green specs.)_

3. **Assert on the thing itself.** `locator('svg').first()` finds the theme toggle in the header.
   Waiting for a loading message to disappear also succeeds when the thing errored. Give the
   element a `data-testid` and address it by name.
   _(Shipped: the viewer spec never once looked at RDKit's output.)_

4. **What the repo says is not what production does.** `nginx/case-studies.conf` is copied onto the
   host by hand. Claims about live behaviour are verified with `curl` against the live site.
   _(Shipped: production served none of the security headers this repo declares, for an unknown
   period, because the server's copy had fallen behind.)_

5. **Read the bundled Next docs before writing Next code.** `node_modules/next/dist/docs/`. The
   installed version differs from training data, and the answer is usually already written down.
   _(Shipped: `listen ... http2`, deprecated since nginx 1.25.1 and silently ignored, left HTTP/2
   off. The same class of mistake.)_

6. **One observation is not a rule.** Two browsers, two routes, or one measurement repeated is the
   minimum before generalising.
   _(Shipped: "`'unsafe-eval'` is not needed" — concluded from a single green run of a test that
   could not fail.)_

## 1. Read-First Checklist

Before the first edit:

- [ ] Read the Next guide for what you are touching, in `node_modules/next/dist/docs/`.
- [ ] For anything shipping to production, skim `…/01-app/02-guides/production-checklist.md` for
      the sections the change touches — rendering, caching, security, SEO, Web Vitals.
- [ ] Read `README.md` §Rendering mode, §Security headers, §Theming if the change goes near
      rendering, CSP, cookies or the theme. Those sections record decisions and their costs.
- [ ] Check whether a case study asserts something about the behaviour you are changing
      (`content/work/{en,ko}/*.mdx`). The site is its own evidence; a change that makes the prose
      false is incomplete until the prose changes with it.
- [ ] Confirm the claim you are acting on is still true. Measure the current state first.

## 2. Plan Before Building

Anything beyond a typo gets a plan in chat before any edit: the approach, the files it touches,
how it will be verified. Wait for a yes.

Scale the ceremony, never the approval:

| Shape of the work | What to present |
| ----------------- | --------------- |
| A feasibility question | The question and the cheapest probe that answers it |
| A change to an existing flow | A few sentences: approach, files, verification |
| New structure, or anything crossing routing/deploy/SEO | Approaches with trade-offs, then a design |

When a task turns out larger than it looked, stop and say so rather than finishing on the old
classification.

## 3. Tests

Vitest for units, Playwright for anything that only exists in a real build — the proxy, route-scoped
chunks, the CSP, the theme.

- Write the failing test first, or if the fix came first, revert it and watch the test fail.
- Prefer a budget in bytes or a named element over a proxy for the thing you care about.
- A console listener cannot see a CSP violation. Use the `securitypolicyviolation` event
  (`e2e/security-headers.spec.ts` has the pattern).
- `npm run test:e2e` builds through `npm run build`, not `next build`, so the `prebuild` hook that
  copies the RDKit assets runs. Keep it that way.

## 4. Self-Verification

Before saying anything is done, run these and read the output:

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
```

For changes to app code, verify at runtime before verifying in CI: the
`next-dev-loop` skill (`.claude/skills/next-dev-loop`) drives `next dev` through `/_next/mcp` and a
real browser. A page that compiles and type-checks can still be broken on screen — that is exactly
how the RDKit viewer shipped broken.

If the change touches headers, caching or anything served, also verify against a real server —
`npm run build && npx next start` locally, or `curl -sI` against production once deployed.

Report what the commands printed. "Tests pass" without the output is not a verification, and a
skipped step is reported as skipped.

## 5. Commits and Pull Requests

- Conventional Commits: `feat` / `fix` / `refactor` / `chore` / `perf` / `ci` / `test`.
- Explain why, and what it cost. A commit that records the trade-off it made is worth more later
  than one that records the diff.
- Never push to `main`. Branch, push with `git push -u origin <branch>`, open a PR.
- Merging `main` deploys: Jenkins builds, pushes to GHCR, updates the GitOps repo, ArgoCD syncs.
  Treat a merge as a deploy.

## Never-Do

- **Never state a cause you have not measured.** Say "I have not checked" instead.
- **Never claim a test covers something without watching it fail.**
- **Never put security headers or a CSP in `nginx/case-studies.conf`.** They live in
  `next.config.ts` and `proxy.ts` so they ship with the image. Two sources means a Content-Security-Policy
  enforced as the intersection of both, and a silent breakage when only one is edited.
- **Never import `@rdkit/rdkit` in application code.** It is a dependency for its two asset files
  only; importing it puts RDKit back in a bundle and undoes the route-scoped loading the case study
  is about.
- **Never widen the CSP globally to fix one route.** Scope it, the way `'unsafe-eval'` is scoped to
  the RDKit route in `proxy.ts`.
- **Never edit inside the `<!-- BEGIN:nextjs-agent-rules -->` markers.** `next dev` rewrites that
  block. Project instructions go outside it.
- **Never push to `main`, and never resolve a rejected push with `git push origin HEAD:main`.**

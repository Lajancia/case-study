# Static-by-default rendering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the two dynamic-forcing APIs (`headers()` for the CSP nonce, `cookies()` for the hire-track banner) so `app/[locale]` and the RDKit embed can render statically, while keeping every CSP protection except the nonce/`strict-dynamic` requirement.

**Architecture:** CSP moves from a per-request header built in `proxy.ts` to a static declaration in `next.config.ts`'s `headers()`, with path-scoped overrides for the RDKit embed (adds `wasm-unsafe-eval`/`unsafe-eval`, relaxes `frame-ancestors`) and the Molstar demo page (adds an RCSB `connect-src` allowance) — mirroring the path-scoping `proxy.ts` already does today. `script-src` is `'unsafe-inline'` everywhere, RDKit included, instead of `nonce`+`strict-dynamic`. The hire-track cookie mechanism is deleted outright rather than replaced.

**Tech Stack:** Next.js 16.3.3 (App Router), next-intl 4.14.2, next-themes, Playwright (e2e), Vitest (unit), TypeScript.

**Spec:** `docs/superpowers/specs/2026-09-18-static-by-default-rendering-design.md`

## Global Constraints

- Never put security headers or CSP in `nginx/case-studies.conf` — they live in `next.config.ts` and `proxy.ts` only (`CONTRIBUTING.md`).
- Never widen the CSP globally to fix one route — keep RDKit's `wasm-unsafe-eval`/`unsafe-eval` and `frame-ancestors 'self'` scoped to `RDKIT_EMBED_PATH` only, and Molstar's `connect-src` allowance scoped to the Molstar demo path only.
- Never import `@rdkit/rdkit` in application code — not touched by this plan, called out only so no task accidentally does it.
- Never state a cause, a size, or a behavior without having run the command that shows it. Every "Verify" step below must actually be run, and its real output reported — not assumed.
- A passing test proves nothing until you've seen it fail first (revert-and-watch-red, or in this plan's case, edit-the-assertion-and-watch-it-fail-against-old-code).
- Self-verification before calling anything done: `npm run lint && npm run typecheck && npm run test && npm run test:e2e`, plus a real-server check (`npm run build && npx next start`, or `curl -sI`) for anything touching headers.
- `.kilo/worktrees/rose-dragon/` contains a stale copy of `proxy.ts`/`SiteHeader.tsx` from an unrelated tool's worktree. It is not part of this app's build — do not edit it, and do not let a grep match against it be mistaken for a live reference.

---

### Task 1: Remove the hire-track cookie mechanism

**Files:**
- Modify: `proxy.ts` (remove `HIRE_PATH`, `HIRE_TRACK_COOKIE`, and the cookie-setting block)
- Modify: `components/site/SiteHeader.tsx` (remove the `cookies()` read and all `onHireTrack` branches)
- Test: `e2e/security-headers.spec.ts` (no change needed here — hire-cookie has no CSP-related coverage)

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `SiteHeader` renders unconditionally as if `onHireTrack` were always `false` — resume link always shown, hire nav link never shown. Later tasks do not depend on this component's internals.

- [ ] **Step 1: Confirm current behavior before touching it**

Run: `grep -rn "onHireTrack\|HIRE_TRACK_COOKIE\|HIRE_PATH" proxy.ts components/site/SiteHeader.tsx`

Expected: the 6 occurrences already found during design (3 in `proxy.ts`, 3 in `SiteHeader.tsx`). This is the baseline the next steps remove.

- [ ] **Step 2: Remove the cookie-setting logic from `proxy.ts`**

Delete these three pieces from `proxy.ts`:

```ts
// DELETE this block (HIRE_PATH comment + declaration):
const HIRE_PATH = new RegExp(`^/(?:(?:${routing.locales.join('|')})/)?hire/?$`)

// DELETE this export:
export const HIRE_TRACK_COOKIE = 'track'
```

```ts
// DELETE this block from inside proxy():
if (HIRE_PATH.test(request.nextUrl.pathname)) {
  response.cookies.set(HIRE_TRACK_COOKIE, 'hire', {
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: isProduction,
  })
}
```

(Leave `isProduction` alone for now — Task 3 removes it entirely once nothing else in `proxy.ts` needs it.)

- [ ] **Step 3: Remove the cookie read from `SiteHeader.tsx`**

`components/site/SiteHeader.tsx` currently:

```tsx
import { cookies } from 'next/headers';
...
import { HIRE_TRACK_COOKIE } from '@/proxy';
...
export async function SiteHeader({ locale }: { locale: Locale }) {
	const t = await getTranslations({ locale, namespace: 'nav' });
	const resumeUrl = `/resume_${locale}.pdf`;

	// Set by the proxy when someone lands on /hire. The page is unlinked by
	// design, so this is the only way back to it once they follow a link out.
	const onHireTrack =
		(await cookies()).get(HIRE_TRACK_COOKIE)?.value === 'hire';

	const navLinks = [
		{ label: t('about'), href: '/about' as const },
		{ label: t('work'), href: '/work' as const },
		...(onHireTrack ? [{ label: t('hire'), href: '/hire' as const }] : []),
		{
			label: t('technicalWriting'),
			href: siteConfig.social.medium,
			external: true,
		},
	];
```

Change to:

```tsx
export async function SiteHeader({ locale }: { locale: Locale }) {
	const t = await getTranslations({ locale, namespace: 'nav' });
	const resumeUrl = `/resume_${locale}.pdf`;

	const navLinks = [
		{ label: t('about'), href: '/about' as const },
		{ label: t('work'), href: '/work' as const },
		{
			label: t('technicalWriting'),
			href: siteConfig.social.medium,
			external: true,
		},
	];
```

Remove the `import { cookies } from 'next/headers';` line and the `import { HIRE_TRACK_COOKIE } from '@/proxy';` line entirely.

Then, further down in the same file, remove the three `onHireTrack` branches:

```tsx
// DELETE this whole conditional block from the desktop nav:
{onHireTrack && (
	<Link
		href="/hire"
		className="hover:text-gray-900 transition-colors dark:hover:text-gray-100"
	>
		{t('hire')}
	</Link>
)}
```

```tsx
// CHANGE: the resume button was gated on `!onHireTrack &&` — remove the gate so
// it always renders:
{!onHireTrack && (
	<a
		href={resumeUrl}
		...
```

becomes:

```tsx
<a
	href={resumeUrl}
	...
```

(remove the matching closing `)}` for that block too — the `<a>` tag's own closing tag stays.)

```tsx
// CHANGE this MobileNav prop:
resumeUrl={onHireTrack ? null : resumeUrl}
```

becomes:

```tsx
resumeUrl={resumeUrl}
```

- [ ] **Step 4: Typecheck**

Run: `npm run typecheck`
Expected: PASS. If `MobileNav`'s `resumeUrl` prop type was `string | null`, it may now show as unused-nullability — that's fine, leave the prop type as-is unless the compiler errors.

- [ ] **Step 5: Confirm nothing else references the removed exports**

Run: `grep -rn "HIRE_TRACK_COOKIE\|onHireTrack\|HIRE_PATH" app components lib proxy.ts --include="*.ts" --include="*.tsx"`
Expected: no matches (the `.kilo/worktrees/` copy is not part of this grep's target dirs, so it won't show up — confirm the command above targets only `app`, `components`, `lib`, `proxy.ts` for this reason).

- [ ] **Step 6: Commit**

```bash
git add proxy.ts components/site/SiteHeader.tsx
git commit -m "refactor: remove the hire-track cookie mechanism

Not used for now; removing the cookies() read is also one of the two
dynamic APIs blocking static rendering site-wide."
```

---

### Task 2: Remove the CSP nonce from the root layout's theme script

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: `ThemeProvider` renders with no `nonce` prop, for every route. Task 3 must land in the same overall change before this is safe to ship alone (see Verify note below) — the RDKit embed's own CSP still requires a nonce until Task 3 relaxes it.

- [ ] **Step 1: Read the current file**

`app/layout.tsx` currently:

```tsx
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
...
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // next-themes settles the theme from localStorage in an inline script that
  // runs before first paint. Under this site's CSP that script only executes if
  // it carries the request's nonce, which proxy.ts puts on the request as
  // x-nonce. Without it the page would paint light and then correct itself.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          nonce={nonce}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Remove the `headers()` call and the `nonce` prop**

Change to:

```tsx
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
...
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        {/* attribute="class" to match the `dark` variant globals.css declares.
            The stylesheet has no .light rule — light is the :root default — so
            the class next-themes adds for it is simply inert. Under this
            site's CSP, script-src carries 'unsafe-inline' (next.config.ts), so
            this inline theme-init script runs without needing a nonce. */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Note: `RootLayout` no longer needs to be `async` since it awaits nothing — drop `async` from the function signature as shown above. Remove the `import { headers } from "next/headers";` line entirely.

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Do NOT verify in the browser yet**

The RDKit embed route still expects a nonce in its CSP at this point (Task 3 hasn't run), so loading it now would show a broken theme toggle on that one route. This is expected and temporary — don't debug it, just proceed to Task 3. If working with `subagent-driven-development`, note this explicitly so the reviewing agent doesn't flag it as a regression mid-plan.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx
git commit -m "refactor: drop the CSP nonce from the root layout's theme script

Second of two dynamic-forcing APIs removed; RDKit's own CSP still
expects a nonce until the next commit relaxes it too."
```

---

### Task 3: Move CSP to `next.config.ts`, strip `proxy.ts` down to locale routing

**Files:**
- Modify: `next.config.ts`
- Modify: `proxy.ts`
- Test: `e2e/security-headers.spec.ts`

**Interfaces:**
- Consumes: Task 2's now-nonce-less `ThemeProvider`.
- Produces: every route's CSP header comes from `next.config.ts`, static, path-scoped by `RDKIT_EMBED_PATH` and the Molstar demo path. `proxy.ts` no longer sets any header at all. This is what later tasks (4, 5, 6) verify against.

- [ ] **Step 1: Write the failing e2e assertions first**

`e2e/security-headers.spec.ts` currently has three tests that assume the nonce model. Replace them.

Replace this test (currently lines 50–66):

```ts
test('every route is covered, and the nonce is fresh each time', async ({
  request,
}) => {
  const seen = new Set<string>()

  for (const route of [...ROUTES, DEMO_ROUTE, RDKIT_EMBED_ROUTE]) {
    const csp = (await request.get(route)).headers()['content-security-policy']
    expect(csp, `no CSP on ${route}`).toBeTruthy()

    const nonce = csp.match(/'nonce-([a-f0-9]+)'/)?.[1]
    expect(nonce, `no nonce on ${route}`).toBeTruthy()
    expect(seen.has(nonce!), `nonce repeated on ${route}`).toBe(false)
    seen.add(nonce!)
  }
})
```

with:

```ts
test('every route is covered by a fixed, non-empty CSP', async ({ request }) => {
  for (const route of [...ROUTES, DEMO_ROUTE, RDKIT_EMBED_ROUTE]) {
    const csp = (await request.get(route)).headers()['content-security-policy']
    expect(csp, `no CSP on ${route}`).toBeTruthy()
  }
})
```

Replace this test (currently lines 68–85):

```ts
test('the policy keeps script injection closed', async ({ request }) => {
  const csp = (await request.get('/en')).headers()['content-security-policy']
  const scriptSrc = csp.split(';').find((d) => d.trim().startsWith('script-src'))!

  expect(scriptSrc).not.toContain('unsafe-inline')
  expect(scriptSrc).toContain(`'strict-dynamic'`)

  for (const directive of [
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ]) {
    expect(csp).toContain(directive)
  }
})
```

with:

```ts
test('the policy has no nonce anywhere, and the rest still holds', async ({ request }) => {
  const csp = (await request.get('/en')).headers()['content-security-policy']
  const scriptSrc = csp.split(';').find((d) => d.trim().startsWith('script-src'))!

  // Static rendering means no per-request nonce is possible — script-src
  // relies on 'unsafe-inline' instead, everywhere, RDKit included.
  expect(csp).not.toContain('nonce-')
  expect(scriptSrc).toContain(`'unsafe-inline'`)

  for (const directive of [
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ]) {
    expect(csp).toContain(directive)
  }
})
```

Delete this test entirely (currently lines 87–101) — it tests a mechanism (`nonce="..."` stamped onto every script tag) that no longer exists. The "no CSP violations while rendering" tests later in the same file (`test.describe('the policy does not block the site itself', ...)`) already cover the thing this test was a proxy for, more directly:

```ts
// DELETE:
test('Next stamps the nonce onto every script it emits', async ({ request }) => {
  ...
})
```

Leave every other test in the file untouched — `only the RDKit embed may compile WebAssembly`, `only the page that mounts Molstar may connect to RCSB`, `only the RDKit embed may be framed, and only by this origin`, `X-Frame-Options matches frame-ancestors...`, `the RDKit embed is not indexed...`, and the whole `the policy does not block the site itself` describe block stay exactly as they are — they assert things that remain true after this change.

- [ ] **Step 2: Run the suite and confirm it fails against the current (unmodified) `next.config.ts`/`proxy.ts`**

Run: `npm run test:e2e -- security-headers`
Expected: FAIL — the two rewritten tests fail because the current CSP still has a nonce and `strict-dynamic`, no `unsafe-inline`. Read the actual failure output; confirm it fails for that reason and not something else (e.g., a typo in the new assertions).

- [ ] **Step 3: Rewrite `next.config.ts`**

Current file:

```ts
import createMDX from '@next/mdx'
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { RDKIT_EMBED_PATH } from './lib/rdkit-route';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
]

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  output: 'standalone',
  logging: { browserToTerminal: 'warn' },
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        source: RDKIT_EMBED_PATH,
        headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
      },
    ]
  },
};

const withMDX = createMDX({});
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(withMDX(nextConfig));
```

Replace with:

```ts
import createMDX from '@next/mdx'
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { RDKIT_EMBED_PATH, MOLSTAR_DEMO_SLUG } from './lib/rdkit-route';
import { routing } from './i18n/routing';

/**
 * All headers are static now — nothing here varies by request, which is what
 * lets every route render at build time. The Content-Security-Policy used to
 * live in proxy.ts because its nonce had to be fresh per response; there is
 * no nonce anymore (see README §Rendering mode for why), so it lives here
 * instead, next to the rest of the security headers.
 *
 * These belong to the app rather than to nginx/case-studies.conf on purpose.
 * That file is copied onto the VPS by hand, and the copy there had fallen
 * behind: the security headers it declares were reaching no one. Setting
 * them here ships them with the image, so a deploy cannot leave them behind.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
]

const DEFAULT_CSP = [
  `default-src 'self'`,
  // No nonce is possible without a per-request response, so script-src
  // relies on 'unsafe-inline'. There is no live injection vector on this
  // site to justify the dynamic-rendering cost of a nonce instead (see the
  // design doc linked from the README for the reasoning).
  `script-src 'self' 'unsafe-inline'`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob:`,
  `font-src 'self'`,
  `connect-src 'self'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests`,
].join('; ')

// RDKit needs both of these to compile, learned the hard way (see
// lib/rdkit-route.ts). 'wasm-unsafe-eval' lets the browser compile the WASM
// module; Emscripten's embind layer then builds its method invokers with
// `new Function(...)`, so 'unsafe-eval' is required too. Scoped to this one
// route, the same as before — see CONTRIBUTING.md's "never widen the CSP
// globally to fix one route".
const RDKIT_EMBED_CSP = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' 'unsafe-eval'`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob:`,
  `font-src 'self'`,
  `connect-src 'self'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  // The one route this site frames on purpose — see lib/rdkit-route.ts.
  `frame-ancestors 'self'`,
  `upgrade-insecure-requests`,
].join('; ')

// Molstar fetches the demo structure straight from RCSB (lib/rdkit-route.ts)
// — scoped to the one route that mounts it, same reasoning as above.
const MOLSTAR_DEMO_CSP = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob:`,
  `font-src 'self'`,
  `connect-src 'self' https://files.rcsb.org`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests`,
].join('; ')

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  output: 'standalone',
  logging: { browserToTerminal: 'warn' },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          ...securityHeaders,
          { key: 'Content-Security-Policy', value: DEFAULT_CSP },
        ],
      },
      // Header sets are merged by key with the last match winning, so these
      // two overrides only replace Content-Security-Policy (and, for RDKit,
      // X-Frame-Options) for their own path.
      {
        source: RDKIT_EMBED_PATH,
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: RDKIT_EMBED_CSP },
        ],
      },
      {
        source: `/:locale(${routing.locales.join('|')})/work/${MOLSTAR_DEMO_SLUG}`,
        headers: [{ key: 'Content-Security-Policy', value: MOLSTAR_DEMO_CSP }],
      },
    ]
  },
};

const withMDX = createMDX({});
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(withMDX(nextConfig));
```

- [ ] **Step 4: Rewrite `proxy.ts`**

Current file (146 lines) becomes just locale routing plus the RDKit-path skip. Replace the entire file with:

```ts
import createMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import { RDKIT_EMBED_PATH } from './lib/rdkit-route'

const handleI18nRouting = createMiddleware(routing)

// The RDKit embed sits outside app/[locale] (lib/rdkit-route.ts) — it has
// no locale-prefixed identity, and handing it to next-intl finds that out
// the hard way: with localePrefix 'always', next-intl redirects any
// unprefixed path to one, e.g. /en/embed/rdkit-viewer. That 404s (there is
// no app/[locale]/embed route). Skip next-intl entirely for it. This is
// unrelated to the CSP now — headers are static (next.config.ts) — it's
// purely to avoid the unwanted redirect/404.
const RDKIT_PATH = new RegExp(`^${RDKIT_EMBED_PATH}/?$`)

export function proxy(request: NextRequest) {
  if (RDKIT_PATH.test(request.nextUrl.pathname)) {
    return
  }
  return handleI18nRouting(request)
}

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
}
```

Confirmed against `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`: the documented minimal example is `export default function proxy(request) { // Proxy logic }` with no return at all, so returning nothing for the RDKit path (as above) is the documented way to continue with default behavior — no explicit `NextResponse.next()` needed.

- [ ] **Step 5: Run the e2e CSP suite again**

Run: `npm run build && npm run test:e2e -- security-headers`
Expected: PASS, all tests in `e2e/security-headers.spec.ts`. Read the actual output — don't infer from exit code alone.

- [ ] **Step 6: Commit**

```bash
git add next.config.ts proxy.ts e2e/security-headers.spec.ts
git commit -m "refactor: move CSP to next.config.ts as static headers, drop the nonce

script-src is 'unsafe-inline' everywhere, RDKit's route included — its
wasm-unsafe-eval/unsafe-eval scoping is unchanged, only the nonce
requirement that forced dynamic rendering is gone. proxy.ts now only
handles locale routing and the RDKit-path redirect-avoidance case."
```

---

### Task 4: Confirm static generation actually takes effect; fix next-intl if it doesn't

**Files:**
- Possibly modify: `app/[locale]/layout.tsx`, `app/[locale]/work/[slug]/page.tsx`
- Test: none new — this task is a measurement, not a feature.

**Interfaces:**
- Consumes: Tasks 1–3 (both dynamic APIs removed, CSP static).
- Produces: either "already static, no code change" or a `setRequestLocale()` call added to the two files above. Task 5 (live verification) depends on knowing which.

- [ ] **Step 1: Build and read the route summary**

Run: `npm run build`

Read the build output's route table. Next prints a symbol per route (commonly `○` for static, `ƒ` for dynamic — confirm the exact legend from this build's own printed key rather than assuming, since symbols have changed across versions). Note which of `/[locale]`, `/[locale]/work`, `/[locale]/work/[slug]`, `/[locale]/about`, `/[locale]/hire` show as static vs dynamic.

- [ ] **Step 2: If everything is already static, stop here**

If the build output shows the locale routes as static, `generateStaticParams()` (already present in `app/[locale]/layout.tsx` and `app/[locale]/work/[slug]/page.tsx`) was sufficient on its own once the two dynamic APIs were gone. Do not add `setRequestLocale()` — it would be unnecessary code. Skip to Task 5.

- [ ] **Step 3: If routes are still dynamic, add `setRequestLocale()`**

`next-intl` 4.14.2 exports `setRequestLocale` from `next-intl/server`, marked deprecated in favor of Next's newer `next/root-params` (introduced in Next 16.3.0) — but deprecated is not removed, and `next/root-params` is a separate mechanism this codebase doesn't otherwise use. Use `setRequestLocale()`: it is the mechanism that actually exists in this next-intl version for telling it which locale a given static-generation pass is for.

In `app/[locale]/layout.tsx`, add as the first line inside `LocaleLayout`, before any other next-intl call:

```tsx
import { setRequestLocale } from 'next-intl/server';
// ... existing imports

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  // ... rest unchanged
```

In `app/[locale]/work/[slug]/page.tsx`, add the same call in `CaseStudyPage`, before it does anything else:

```tsx
import { setRequestLocale } from 'next-intl/server';
// ... existing imports

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const study = getCaseStudy(locale, slug);
  // ... rest unchanged
```

- [ ] **Step 4: Rebuild and re-check the route table**

Run: `npm run build`
Expected: the routes that were dynamic in Step 1 now show static. If they still don't, stop and report the actual build output rather than guessing at another fix — this plan's assumptions about this next-intl/Next combination need re-checking against `node_modules/next-intl` and `node_modules/next/dist/docs` before proceeding.

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Commit (only if Step 3 was needed)**

```bash
git add app/\[locale\]/layout.tsx "app/[locale]/work/[slug]/page.tsx"
git commit -m "fix: call next-intl's setRequestLocale so static generation actually applies

generateStaticParams() alone wasn't enough; next-intl still needed to
be told which locale a given static pass is for."
```

---

### Task 5: Live verification — RDKit, theme, and zero CSP violations

**Files:** none modified — this task is verification only.

**Interfaces:**
- Consumes: the final state of Tasks 1–4.
- Produces: confidence (or a bug report) before Task 6's docs and final sign-off.

This is the task CONTRIBUTING.md's Global Invariant #2 exists for: *"a passing test proves nothing until you have seen it fail... a CSP that broke the RDKit viewer in production, under two green specs."* Do not skip it or treat the e2e suite alone as sufficient.

- [ ] **Step 1: Run the full e2e suite**

Run: `npm run test:e2e`
Expected: PASS, including `the RDKit viewer runs under the policy` and the per-route `renders with no policy violations` tests in `e2e/security-headers.spec.ts`, and all of `e2e/theme.spec.ts`. Read the actual output.

- [ ] **Step 2: Drive the RDKit route live, in a real browser, via next-dev-loop**

Invoke the `next-dev-loop` skill against a running `next dev` (or start one if none is running). Navigate to the case-study page that embeds RDKit (`/en/work/scientific-platform-performance`) and confirm:
- The RDKit depiction actually renders (an SVG appears inside the `[data-testid="rdkit-frame"]` iframe) — not just "no error in the console."
- No `securitypolicyviolation` events fire (check via the browser tab, not just server logs).
- The dark-mode toggle works correctly both on this page and, separately, by opening `/embed/rdkit-viewer` directly and toggling from the parent page while the embed is open (the cross-frame theme-sync behavior described in `app/embed/rdkit-viewer/page.tsx`'s comments).

- [ ] **Step 3: Verify against a real production-mode server, not just `next dev`**

Run: `npm run build && npx next start`

Then in another terminal:

```bash
curl -sI http://localhost:3000/en | grep -i content-security-policy
curl -sI http://localhost:3000/embed/rdkit-viewer | grep -i content-security-policy
curl -sI http://localhost:3000/en/work/scientific-platform-performance | grep -i content-security-policy
```

Expected: three different CSP values, matching `DEFAULT_CSP`, `RDKIT_EMBED_CSP`, and `MOLSTAR_DEMO_CSP` respectively from `next.config.ts`. Report what each curl actually printed.

- [ ] **Step 4: Report findings before proceeding**

If any of Steps 1–3 show a problem, stop and fix it before Task 6 — do not write documentation describing behavior that hasn't been confirmed to work.

---

### Task 6: Update `README.md`

**Files:**
- Modify: `README.md` (§Rendering mode, §Theming, §Security headers — exact section names may differ slightly; read the file first and match its actual headings)

**Interfaces:**
- Consumes: the verified end state from Task 5.
- Produces: documentation that matches reality, per this repo's own stated bar ("the site is itself the evidence for what it claims" — `AGENTS.md`).

- [ ] **Step 1: Read the current README sections that describe rendering, theming, and security headers**

Run: `grep -n "^## " README.md` to find the exact section headings, then read each one this change affects in full before editing.

- [ ] **Step 2: Rewrite §Rendering mode**

Replace the description of "every route renders on demand because of the CSP nonce" with the new reality: routes are statically generated; the CSP still applies everywhere but without a nonce, `unsafe-inline` in `script-src` instead; the RDKit embed and Molstar demo page carry their own path-scoped CSP overrides via `next.config.ts`, same scoping principle as before, just declared statically instead of computed per-request in `proxy.ts`. Link to `docs/superpowers/specs/2026-09-18-static-by-default-rendering-design.md` for the full reasoning (no live injection vector, nonce's actual protection was never against this codebase's real exposure, RDKit's eval risk math didn't support keeping it different from the rest of the site).

Add a forward-looking note: if a form, `dangerouslySetInnerHTML`, or any other HTML-injecting feature is added later, that is the moment to reconsider `script-src` for the specific route it lands on — and the mechanism for keeping the rest of the site static while that one piece is dynamic is Next's `cacheComponents` config (Cache Components / Partial Prerendering) with the dynamic piece wrapped in `<Suspense>`, not a page-wide reversion to `headers()`/`cookies()`-forced dynamic rendering.

- [ ] **Step 3: Rewrite §Theming**

Remove the nonce-plumbing description (`app/layout.tsx` reading `headers()` to pass a nonce to next-themes). Describe the current mechanism: `ThemeProvider`'s inline script runs under `script-src 'unsafe-inline'`, no nonce needed.

- [ ] **Step 4: Rewrite §Security headers (or wherever CSP is documented)**

Remove any remaining reference to `proxy.ts` generating the CSP. State that it's static, in `next.config.ts`, path-scoped for the RDKit embed and Molstar demo page the same way it always was.

- [ ] **Step 5: Read the diff back**

Run: `git diff README.md`

Confirm every sentence changed still reads correctly next to the sentences around it that weren't touched — a partial edit that leaves one stale sentence is worse than not editing at all (this is exactly the class of mistake `AGENTS.md` opens with).

- [ ] **Step 6: Commit**

```bash
git add README.md
git commit -m "docs: describe static rendering instead of the CSP-nonce-forced dynamic model

README §Rendering mode, §Theming, and §Security headers now match
what the code actually does after removing the nonce."
```

---

### Task 7: Final self-verification and wrap-up

**Files:** none — verification and cleanup only.

- [ ] **Step 1: Run the full local check suite**

Run: `npm run lint && npm run typecheck && npm run test && npm run test:e2e`

Report the actual output of each command. Do not summarize as "all passing" without having seen each command's output.

- [ ] **Step 2: Confirm the build's route table one more time, from a clean build**

Run: `rm -rf .next && npm run build`

Read the printed route table again. Confirm the static/dynamic split matches what Task 4 established, from a genuinely clean build (a stale `.next` directory can hide a regression).

- [ ] **Step 3: Review the full diff against `main`**

Run: `git diff main...perf/static-by-default --stat`

Confirm the file list matches this plan's scope (`app/layout.tsx`, `proxy.ts`, `components/site/SiteHeader.tsx`, `next.config.ts`, `README.md`, `e2e/security-headers.spec.ts`, plus `app/[locale]/layout.tsx` and `app/[locale]/work/[slug]/page.tsx` if Task 4 needed them, plus the two docs files from the spec/plan). Nothing outside this list should have changed.

- [ ] **Step 4: Push and open a PR**

```bash
git push -u origin perf/static-by-default
gh pr create --title "perf: static-by-default rendering, drop the CSP nonce" --body "$(cat <<'EOF'
## Summary
- Removes the two dynamic APIs (headers() for the CSP nonce, cookies() for
  the hire-track banner) that forced every route to render on demand.
- Moves the CSP from proxy.ts (per-request) to next.config.ts (static),
  unifying script-src to 'unsafe-inline' everywhere — RDKit's route
  included — after confirming the eval-concession risk math doesn't
  support treating it differently from the rest of the site.
- Removes the hire-track cookie/banner mechanism outright (not used
  for now); /hire itself is untouched.

Design: docs/superpowers/specs/2026-09-18-static-by-default-rendering-design.md

## Test plan
- [ ] npm run lint / typecheck / test / test:e2e all pass
- [ ] Build output shows app/[locale] routes and the RDKit embed as static
- [ ] RDKit viewer confirmed rendering live (not just "no CSP violation")
- [ ] curl against `next start` shows the three distinct CSP values
      (default, RDKit embed, Molstar demo) matching next.config.ts
EOF
)"
```

Report the PR URL.

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
  // Deliberately no X-XSS-Protection: the auditor it switched on was removed
  // from every major browser years ago, and could itself be turned into a
  // vulnerability. The CSP is what guards this now.
]

const isProduction = process.env.NODE_ENV === 'production'

// React reconstructs server error stacks in the browser during development,
// which needs eval() — production doesn't use eval on its own. Dev-only, the
// same as proxy.ts granted before CSP moved here (see git history).
const devEval = isProduction ? '' : ` 'unsafe-eval'`

const DEFAULT_CSP = [
  `default-src 'self'`,
  // No nonce is possible without a per-request response, so script-src
  // relies on 'unsafe-inline'. There is no live injection vector on this
  // site to justify the dynamic-rendering cost of a nonce instead (see the
  // design doc linked from the README for the reasoning).
  `script-src 'self' 'unsafe-inline'${devEval}`,
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
  `script-src 'self' 'unsafe-inline'${devEval}`,
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

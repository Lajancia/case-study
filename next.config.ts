import createMDX from '@next/mdx'
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { RDKIT_EMBED_PATH } from './lib/rdkit-route';

/**
 * Headers that never vary by request. The per-request Content-Security-Policy
 * lives in proxy.ts, because its nonce has to be fresh each time.
 *
 * These belong to the app rather than to nginx/case-studies.conf on purpose.
 * That file is copied onto the VPS by hand, and the copy there had fallen
 * behind: the security headers it declares were reaching no one. Setting them
 * here ships them with the image, so a deploy cannot leave them behind.
 */
const securityHeaders = [
  // Keeps a browser from second-guessing a declared Content-Type — the reason
  // the self-hosted RDKit .wasm is safe to serve as application/wasm.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Superseded by the CSP's frame-ancestors, kept for browsers that never
  // implemented that directive.
  { key: 'X-Frame-Options', value: 'DENY' },
  // Deliberately no X-XSS-Protection: the auditor it switched on was removed
  // from every major browser years ago, and could itself be turned into a
  // vulnerability. The CSP is what guards this now.
]

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  output: 'standalone',
  // Forward browser warnings and errors from `next dev` to the terminal, where
  // an agent can actually read them. Set explicitly rather than left to the
  // default: client-side failures that never reach the terminal are the ones
  // that ship, and this repo has shipped one.
  logging: { browserToTerminal: 'warn' },
  // Announces the framework to anyone scanning for a version to target.
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // The RDKit embed (lib/rdkit-route.ts) is the one page another page on
      // this site frames on purpose. Header sets are merged by key with the
      // last match winning, so this overrides only X-Frame-Options for this
      // path — SAMEORIGIN is the legacy equivalent of the `frame-ancestors
      // 'self'` proxy.ts already sends it in the CSP; DENY here would block
      // the very framing that CSP allows.
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

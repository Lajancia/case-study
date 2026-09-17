import createMDX from '@next/mdx'
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

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
  // Announces the framework to anyone scanning for a version to target.
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
};

const withMDX = createMDX({});
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(withMDX(nextConfig));

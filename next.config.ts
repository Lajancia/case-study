import createMDX from '@next/mdx'
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  output: 'standalone',
};

const withMDX = createMDX({});
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(withMDX(nextConfig));
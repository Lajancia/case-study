import type { MDXComponents } from 'mdx/types'
import PerformanceDashboard from '@/components/case-study/PerformanceDashboard'

const components: MDXComponents = {
  // Override img to use next/image
  img: ({ alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt || ''} style={{ maxWidth: '100%', height: 'auto' }} {...props} />
  ),
  PerformanceDashboard,
}

export function useMDXComponents(): MDXComponents {
  return components
}
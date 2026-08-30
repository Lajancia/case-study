import type { MDXComponents } from 'mdx/types'
import PerformanceDashboard from '@/components/case-study/PerformanceDashboard'
import MolecularViewer from '@/components/case-study/MolecularViewer'

const components: MDXComponents = {
  img: ({ alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt || ''} style={{ maxWidth: '100%', height: 'auto' }} {...props} />
  ),
  PerformanceDashboard,
  MolecularViewer,
}

export function useMDXComponents(): MDXComponents {
  return components
}
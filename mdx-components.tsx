import type { MDXComponents } from 'mdx/types'
import PerformanceDashboard from '@/components/case-study/PerformanceDashboard'
import MolecularViewer from '@/components/case-study/MolecularViewer'

const components: MDXComponents = {
  img: ({ alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt || ''} style={{ maxWidth: '100%', height: 'auto' }} {...props} />
  ),
  // `.prose pre` scrolls horizontally for long lines. <pre> carries no
  // implicit ARIA role, so it can be named and focused directly — no wrapper
  // and no style change needed.
  pre: (props) => <pre role="region" aria-label="Code sample" tabIndex={0} {...props} />,
  PerformanceDashboard,
  MolecularViewer,
}

export function useMDXComponents(): MDXComponents {
  return components
}
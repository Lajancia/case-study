import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {
  // Override img to use next/image
  img: ({ alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt || ''} style={{ maxWidth: '100%', height: 'auto' }} {...props} />
  ),
}

export function useMDXComponents(): MDXComponents {
  return components
}
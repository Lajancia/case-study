import cicdPipeline from './cicd-pipeline.mdx'
import devsecopsPipeline from './devsecops-pipeline.mdx'
import next14R3fPortfolio from './next14-r3f-portfolio.mdx'
import scientificPlatformPerformance from './scientific-platform-performance.mdx'
import scientificVisualization from './scientific-visualization.mdx'

export const mdxModules: Record<string, React.ComponentType> = {
  'cicd-pipeline': cicdPipeline,
  'devsecops-pipeline': devsecopsPipeline,
  'next14-r3f-portfolio': next14R3fPortfolio,
  'scientific-platform-performance': scientificPlatformPerformance,
  'scientific-visualization': scientificVisualization,
}
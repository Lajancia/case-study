import enCicdPipeline from './en/cicd-pipeline.mdx'
import enDevsecopsPipeline from './en/devsecops-pipeline.mdx'
import enNext14R3fPortfolio from './en/next14-r3f-portfolio.mdx'
import enScientificPlatformPerformance from './en/scientific-platform-performance.mdx'
import enScientificVisualization from './en/scientific-visualization.mdx'
import koCicdPipeline from './ko/cicd-pipeline.mdx'
import koDevsecopsPipeline from './ko/devsecops-pipeline.mdx'
import koNext14R3fPortfolio from './ko/next14-r3f-portfolio.mdx'
import koScientificPlatformPerformance from './ko/scientific-platform-performance.mdx'
import koScientificVisualization from './ko/scientific-visualization.mdx'

export const mdxModules: Record<string, Record<string, React.ComponentType>> = {
  en: {
    'cicd-pipeline': enCicdPipeline,
    'devsecops-pipeline': enDevsecopsPipeline,
    'next14-r3f-portfolio': enNext14R3fPortfolio,
    'scientific-platform-performance': enScientificPlatformPerformance,
    'scientific-visualization': enScientificVisualization,
  },
  ko: {
    'cicd-pipeline': koCicdPipeline,
    'devsecops-pipeline': koDevsecopsPipeline,
    'next14-r3f-portfolio': koNext14R3fPortfolio,
    'scientific-platform-performance': koScientificPlatformPerformance,
    'scientific-visualization': koScientificVisualization,
  },
}

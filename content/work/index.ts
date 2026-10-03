import enAdcVisualization from './en/adc-visualization.mdx'
import enCicdPipeline from './en/cicd-pipeline.mdx'
import enCommonSrlWebsite from './en/common-srl-website.mdx'
import enDevsecopsPipeline from './en/devsecops-pipeline.mdx'
import enIlluminareanDockerization from './en/illuminarean-dockerization.mdx'
import enIlluminareanHiringPlatform from './en/illuminarean-hiring-platform.mdx'
import enNext14R3fPortfolio from './en/next14-r3f-portfolio.mdx'
import enPathWsiViewer from './en/path-wsi-viewer.mdx'
import enScientificPlatformPerformance from './en/scientific-platform-performance.mdx'
import enYuraSmartFactory from './en/yura-smart-factory.mdx'
import koAdcVisualization from './ko/adc-visualization.mdx'
import koCicdPipeline from './ko/cicd-pipeline.mdx'
import koCommonSrlWebsite from './ko/common-srl-website.mdx'
import koDevsecopsPipeline from './ko/devsecops-pipeline.mdx'
import koIlluminareanDockerization from './ko/illuminarean-dockerization.mdx'
import koIlluminareanHiringPlatform from './ko/illuminarean-hiring-platform.mdx'
import koNext14R3fPortfolio from './ko/next14-r3f-portfolio.mdx'
import koPathWsiViewer from './ko/path-wsi-viewer.mdx'
import koScientificPlatformPerformance from './ko/scientific-platform-performance.mdx'
import koYuraSmartFactory from './ko/yura-smart-factory.mdx'

export const mdxModules: Record<string, Record<string, React.ComponentType>> = {
  en: {
    'adc-visualization': enAdcVisualization,
    'cicd-pipeline': enCicdPipeline,
    'common-srl-website': enCommonSrlWebsite,
    'devsecops-pipeline': enDevsecopsPipeline,
    'illuminarean-dockerization': enIlluminareanDockerization,
    'illuminarean-hiring-platform': enIlluminareanHiringPlatform,
    'next14-r3f-portfolio': enNext14R3fPortfolio,
    'path-wsi-viewer': enPathWsiViewer,
    'scientific-platform-performance': enScientificPlatformPerformance,
    'yura-smart-factory': enYuraSmartFactory,
  },
  ko: {
    'adc-visualization': koAdcVisualization,
    'cicd-pipeline': koCicdPipeline,
    'common-srl-website': koCommonSrlWebsite,
    'devsecops-pipeline': koDevsecopsPipeline,
    'illuminarean-dockerization': koIlluminareanDockerization,
    'illuminarean-hiring-platform': koIlluminareanHiringPlatform,
    'next14-r3f-portfolio': koNext14R3fPortfolio,
    'path-wsi-viewer': koPathWsiViewer,
    'scientific-platform-performance': koScientificPlatformPerformance,
    'yura-smart-factory': koYuraSmartFactory,
  },
}

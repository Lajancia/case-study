'use client'

import dynamic from 'next/dynamic'
import { siteMetrics } from '@/lib/metrics'

/**
 * ApexCharts loaded DYNAMICALLY — zero bytes on pages without this component.
 * See the code snippet below for the exact import pattern.
 */
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-4 p-8">
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <div className="h-48 bg-gray-200 rounded" />
    </div>
  ),
})

export default function PerformanceDashboard() {
  const { mainBundle, docker, lighthouse } = siteMetrics

  const dockerSeries = [{
    name: 'Size (MB)',
    data: [docker.estimatedNonStandaloneMb, docker.standaloneMb],
  }]

  const lighthouseSeries = [{
    name: 'Score',
    data: [lighthouse.performance, lighthouse.accessibility, lighthouse.bestPractices, lighthouse.seo],
  }]

  return (
    <div className="not-prose my-10 space-y-8">
      <h3 className="text-lg font-semibold text-gray-900">This site&rsquo;s live metrics</h3>
      <p className="text-sm text-gray-500">
        Measured from the production build of <em>this</em> case study site.
        ApexCharts itself is loaded route-scoped — the library adds zero bytes to any other page.
      </p>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bundle */}
        <div className="border border-gray-200 rounded-lg p-5">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Main bundle</h4>
          <div className="text-3xl font-bold text-gray-900">
            {mainBundle.gzippedKb}
            <span className="text-lg text-gray-500"> KB</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">gzipped &middot; {mainBundle.chunkCount} chunks</p>
          <p className="text-xs text-gray-400">{mainBundle.totalKb} KB uncompressed</p>
        </div>

        {/* Lighthouse */}
        <div className="border border-gray-200 rounded-lg p-5">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Lighthouse</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-600">{lighthouse.performance}</span>
            <span className="text-sm text-gray-500">/ 100</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            A: {lighthouse.accessibility} &middot; BP: {lighthouse.bestPractices} &middot; SEO: {lighthouse.seo}
          </p>
        </div>

        {/* Docker */}
        <div className="border border-gray-200 rounded-lg p-5">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Docker image</h4>
          <div className="text-3xl font-bold text-gray-900">
            {docker.standaloneMb}
            <span className="text-lg text-gray-500"> MB</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {docker.reductionPercent}% smaller vs non-standalone
          </p>
          <p className="text-xs text-gray-400">vs ~{docker.estimatedNonStandaloneMb} MB</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Docker bar chart */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Docker image size (MB)</h5>
          {typeof window !== 'undefined' && (
            <Chart
              type="bar"
              options={{
                chart: { type: 'bar', toolbar: { show: false } },
                plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
                colors: ['#6B7280', '#22c55e'],
                xaxis: {
                  categories: ['Non-standalone', 'Standalone'],
                  title: { text: 'Size (MB)' },
                },
              }}
              series={dockerSeries}
              height={120}
            />
          )}
        </div>

        {/* Lighthouse bar chart */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Lighthouse scores</h5>
          {typeof window !== 'undefined' && (
            <Chart
              type="bar"
              options={{
                chart: { type: 'bar', toolbar: { show: false } },
                plotOptions: { bar: { borderRadius: 4 } },
                colors: ['#22c55e'],
                xaxis: {
                  categories: ['Performance', 'Accessibility', 'Best Practices', 'SEO'],
                },
                yaxis: { max: 100 },
              }}
              series={lighthouseSeries}
              height={200}
            />
          )}
        </div>
      </div>

      {/* Code snippet: dynamic import pattern */}
      <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-yellow-800 mb-2">Route-scoped loading in action</h5>
        <pre className="text-xs text-yellow-900 overflow-x-auto"><code>{`// ApexCharts loaded ONLY on this page:
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

// Molstar loaded ONLY on routes that render 3D:
const MolstarViewer = dynamic(() => import('@/components/3d/MolstarViewer'))
`}</code></pre>
        <p className="text-xs text-yellow-700 mt-2">
          Open browser DevTools &rarr; Network and filter &quot;apexcharts&quot; to see it load on-demand.
        </p>
      </div>
    </div>
  )
}
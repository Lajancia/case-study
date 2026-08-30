'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { siteMetrics } from '@/lib/metrics'

/**
 * ApexCharts loaded DYNAMICALLY — zero bytes on pages without this component.
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
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { comparisons, currentSiteBundle, docker } = siteMetrics

  const compLabels = comparisons.map((c) => c.label.split('(')[0].trim())
  const beforeValues = comparisons.map((c) => c.beforeValue)
  const afterValues = comparisons.map((c) => c.afterValue)
  const compUnit = comparisons[0]?.unit || 'KB'

  const comparisonSeries = [
    { name: 'Before (unoptimized)', data: beforeValues },
    { name: 'After (optimized)', data: afterValues },
  ]

  return (
    <div className="not-prose my-10 space-y-8">
      <h3 className="text-lg font-semibold text-gray-900">This site&rsquo;s live metrics</h3>
      <p className="text-sm text-gray-500">
        Measured from the production build of <em>this</em> case study site.
        ApexCharts itself is loaded route-scoped — the library adds zero bytes to any other page.
      </p>

      {/* Before/After comparison chart */}
      <div className="border border-gray-200 rounded-lg p-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-1">Before &amp; After: same techniques on this site</h4>
        <p className="text-xs text-gray-400 mb-4">
          The &ldquo;before&rdquo; state recreates the AD3 anti-pattern: an eager 3D library import on every route
          plus a non-standalone Docker build. Measured from the <code>perf/before-optimization</code> branch.
        </p>
        {mounted && (
          <Chart
            type="bar"
            options={{
              chart: { type: 'bar', toolbar: { show: false } },
              plotOptions: { bar: { horizontal: false, borderRadius: 4 } },
              colors: ['#EF4444', '#22c55e'],
              xaxis: {
                categories: compLabels,
                labels: { style: { fontSize: '11px' } },
              },
              yaxis: {
                title: { text: compUnit },
              },
              dataLabels: {
                enabled: true,
                formatter: (val: number) => `${val}${compUnit === 'KB' ? ' KB' : ' MB'}`,
                style: { fontSize: '10px' },
              },
              legend: { position: 'top' },
            }}
            series={comparisonSeries}
            height={260}
          />
        )}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          {comparisons.map((c) => (
            <div key={c.label} className="text-xs">
              <span className="text-gray-500">{c.label.split('(')[0].trim()}</span>
              <div className="flex gap-2 mt-0.5">
                <span className="text-red-600 line-through">{c.before}</span>
                <span className="text-green-700 font-semibold">{c.after}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-5">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Main bundle</h4>
          <div className="text-3xl font-bold text-gray-900">
            {currentSiteBundle.gzippedKb}
            <span className="text-lg text-gray-500"> KB</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">gzipped &middot; {currentSiteBundle.chunkCount} chunks</p>
          <p className="text-xs text-gray-400">{currentSiteBundle.totalKb} KB uncompressed</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-5">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Docker image (runner stage)</h4>
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

      {/* Code snippet */}
      <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-yellow-800 mb-2">Route-scoped loading in action</h5>
        <pre className="text-xs text-yellow-900 overflow-x-auto"><code>{`// ApexCharts loaded ONLY on this page:
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

// In the "before" branch, three.js was eagerly loaded in layout.tsx:
import EagerThreeInit from "@/components/EagerThreeInit"  // +99 KB every route
`}</code></pre>
        <p className="text-xs text-yellow-700 mt-2">
          Compare branches: <code>git diff perf/before-optimization..HEAD</code>
        </p>
      </div>
    </div>
  )
}
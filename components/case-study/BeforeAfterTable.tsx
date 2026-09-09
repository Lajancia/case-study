interface BeforeAfterEntry {
  label: string
  before: string
  after: string
  change: string
}

interface BeforeAfterTableProps {
  entries: BeforeAfterEntry[]
  caption?: string
}

export function BeforeAfterTable({ entries, caption }: BeforeAfterTableProps) {
  return (
    <figure>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left border border-gray-200 bg-gray-50 px-4 py-2 font-medium text-sm dark:border-gray-800 dark:bg-gray-900">Metric</th>
            <th className="text-left border border-gray-200 bg-gray-50 px-4 py-2 font-medium text-sm dark:border-gray-800 dark:bg-gray-900">Before</th>
            <th className="text-left border border-gray-200 bg-gray-50 px-4 py-2 font-medium text-sm dark:border-gray-800 dark:bg-gray-900">After</th>
            <th className="text-left border border-gray-200 bg-gray-50 px-4 py-2 font-medium text-sm dark:border-gray-800 dark:bg-gray-900">Change</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.label}>
              <td className="border border-gray-200 px-4 py-2 text-sm font-medium dark:border-gray-800">{entry.label}</td>
              <td className="border border-gray-200 px-4 py-2 text-sm text-gray-400 line-through tabular-nums dark:border-gray-800 dark:text-gray-600">{entry.before}</td>
              <td className="border border-gray-200 px-4 py-2 text-sm font-semibold text-green-700 tabular-nums dark:border-gray-800 dark:text-green-400">{entry.after}</td>
              <td className="border border-gray-200 px-4 py-2 text-sm font-medium text-green-600 dark:border-gray-800 dark:text-green-500">{entry.change}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {caption && <figcaption className="text-xs text-gray-500 mt-2 dark:text-gray-500">{caption}</figcaption>}
    </figure>
  )
}
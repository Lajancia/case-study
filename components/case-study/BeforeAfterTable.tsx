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
            <th className="text-left border border-gray-200 bg-gray-50 px-4 py-2 font-medium text-sm">Metric</th>
            <th className="text-left border border-gray-200 bg-gray-50 px-4 py-2 font-medium text-sm">Before</th>
            <th className="text-left border border-gray-200 bg-gray-50 px-4 py-2 font-medium text-sm">After</th>
            <th className="text-left border border-gray-200 bg-gray-50 px-4 py-2 font-medium text-sm">Change</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.label}>
              <td className="border border-gray-200 px-4 py-2 text-sm font-medium">{entry.label}</td>
              <td className="border border-gray-200 px-4 py-2 text-sm text-gray-400 line-through tabular-nums">{entry.before}</td>
              <td className="border border-gray-200 px-4 py-2 text-sm font-semibold text-green-700 tabular-nums">{entry.after}</td>
              <td className="border border-gray-200 px-4 py-2 text-sm font-medium text-green-600">{entry.change}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {caption && <figcaption className="text-xs text-gray-500 mt-2">{caption}</figcaption>}
    </figure>
  )
}
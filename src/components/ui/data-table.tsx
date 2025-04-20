import * as React from "react"
import { motion } from "framer-motion"
import { useTheme } from "../ui/theme-provider"
import { cn } from "../../lib/utils"

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  data: TData[]
  columns: {
    header: string
    accessorKey: keyof TData
    cell?: (value: any) => React.ReactNode
  }[]
}

export function DataTable<TData>({
  data,
  columns,
  className,
  ...props
}: DataTableProps<TData>) {
  const { theme } = useTheme()
  const [sortColumn, setSortColumn] = React.useState<keyof TData | null>(null)
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data
    return [...data].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]
      return sortDirection === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue))
    })
  }, [data, sortColumn, sortDirection])

  return (
    <div
      className={cn("overflow-x-auto rounded-lg border", className)}
      {...props}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-muted/50">
            {columns.map((column) => (
              <th
                key={String(column.accessorKey)}
                className="p-4 text-left font-medium cursor-pointer hover:bg-muted/80"
                onClick={() => {
                  if (sortColumn === column.accessorKey) {
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
                  } else {
                    setSortColumn(column.accessorKey)
                    setSortDirection('asc')
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {sortColumn === column.accessorKey && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, i) => (
            <tr
              key={i}
              className="border-b transition-colors hover:bg-muted/50"
            >
              {columns.map((column) => (
                <td key={String(column.accessorKey)} className="p-4">
                  {column.cell
                    ? column.cell(row[column.accessorKey])
                    : String(row[column.accessorKey])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

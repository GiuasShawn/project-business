'use client'

import type React from 'react'
import { Icon } from './icon'

export interface TableColumn<T> {
  /** Unique key for the column */
  key: string
  /** Column header label */
  header: string
  /** Render function for cell content */
  render?: (row: T, index: number) => React.ReactNode
  /** Text alignment for this column. Default: 'left' */
  align?: 'left' | 'center' | 'right'
  /** Optional className for the column header */
  headerClassName?: string
  /** Optional className for the column cells */
  cellClassName?: string
  /** Optional width for the column (e.g., '200px', '20%') */
  width?: string
}

export interface DataTableProps<T> {
  /** Column definitions */
  columns: TableColumn<T>[]
  /** Row data */
  data: T[]
  /** Unique key extractor for rows */
  keyExtractor: (row: T, index: number) => string
  /** Optional empty state message */
  emptyMessage?: string
  /** Optional loading state */
  isLoading?: boolean
  /** Optional loading message */
  loadingMessage?: string
  /** Optional className for the table container */
  className?: string
  /** Optional callback when a row is clicked */
  onRowClick?: (row: T, index: number) => void
  /** Whether rows are clickable (adds hover cursor) */
  clickable?: boolean
}

/**
 * Loom data table component.
 *
 * A reusable design-system primitive for tabular data display. Supports
 * responsive overflow via horizontal scroll, accessible table semantics,
 * empty and loading states, and configurable column alignment.
 *
 * Design tokens: surface-container-lowest (background), outline-variant (borders),
 * on-surface (text), on-surface-variant (secondary text), tertiary (accent).
 */
export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
  isLoading = false,
  loadingMessage = 'Loading...',
  className = '',
  onRowClick,
  clickable = false,
}: DataTableProps<T>): React.JSX.Element {
  return (
    <div
      className={`overflow-x-auto rounded border border-outline-variant bg-surface-container-lowest ${className}`}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-outline-variant bg-surface-container-high">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={{ width: col.width }}
                className={`px-4 py-3 text-left font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant ${
                  col.align === 'center'
                    ? 'text-center'
                    : col.align === 'right'
                      ? 'text-right'
                      : 'text-left'
                } ${col.headerClassName ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-on-surface-variant"
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-tertiary border-t-transparent" />
                  <span className="font-body-sm text-body-sm">{loadingMessage}</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-on-surface-variant"
              >
                <div className="flex flex-col items-center gap-3">
                  <Icon name="inbox" size={24} className="text-on-surface-variant" />
                  <span className="font-body-sm text-body-sm">{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={keyExtractor(row, rowIndex)}
                onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onRowClick(row, rowIndex)
                        }
                      }
                    : undefined
                }
                tabIndex={clickable ? 0 : undefined}
                className={`border-b border-outline-variant/50 transition-colors last:border-b-0 ${
                  clickable ? 'cursor-pointer hover:bg-surface-container-high' : ''
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-body-sm text-on-surface ${
                      col.align === 'center'
                        ? 'text-center'
                        : col.align === 'right'
                          ? 'text-right'
                          : 'text-left'
                    } ${col.cellClassName ?? ''}`}
                  >
                    {col.render
                      ? col.render(row, rowIndex)
                      : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

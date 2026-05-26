import type { ReactNode } from 'react';
import {
  SegmentedControl,
  type SegmentedControlOption,
} from './SegmentedControl';

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => ReactNode;
}

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPrev: () => void;
  onNext: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isFetching?: boolean;
}

interface SegmentedControlConfig<T extends string | number> {
  options: SegmentedControlOption<T>[];
  selectedValue: T;
  onChange: (value: T) => void;
}

interface DataTableProps<T, S extends string | number> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string | number;
  isLoading?: boolean;
  isFetching?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  search?: SearchProps;
  pagination?: PaginationProps;
  segmentedControl?: SegmentedControlConfig<S>;
}

export function DataTable<T, S extends string | number>({
  data,
  columns,
  keyExtractor,
  isLoading,
  isFetching,
  emptyMessage = 'No se encontraron resultados.',
  loadingMessage = 'Cargando...',
  search,
  pagination,
  segmentedControl,
}: DataTableProps<T, S>) {
  return (
    <div className="flex flex-col gap-6">
      {/* Search and SegmentedControl Header */}
      {(search || segmentedControl) && (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {search ? (
            <div className="relative w-full sm:w-auto">
              <input
                className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-4 py-2.5 text-sm text-gray-200 transition-all outline-none focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20 sm:w-[300px]"
                placeholder={search.placeholder || 'Buscar...'}
                type="text"
                value={search.value}
                onChange={(e) => search.onChange(e.target.value)}
              />
              {search.isFetching && (
                <span className="absolute top-3 left-[315px] animate-pulse text-xs text-gray-400 max-sm:hidden">
                  Buscando...
                </span>
              )}
            </div>
          ) : (
            <div />
          )}

          {segmentedControl && (
            <SegmentedControl
              options={segmentedControl.options}
              selectedValue={segmentedControl.selectedValue}
              onChange={segmentedControl.onChange}
            />
          )}
        </div>
      )}

      {/* Table Container */}
      <div
        className={`overflow-hidden rounded-xl border border-white/10 bg-[#121212] shadow-xl transition-opacity duration-200 ${
          isFetching ? 'opacity-60' : 'opacity-100'
        }`}
      >
        {isLoading && data.length === 0 ? (
          <div className="p-8 text-center text-gray-400">{loadingMessage}</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-gray-400">{emptyMessage}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {columns.map((col, idx) => (
                    <th
                      key={idx}
                      className="px-3 py-4 text-center text-[11px] font-medium tracking-wider whitespace-nowrap text-gray-400 uppercase"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.map((row, idx) => {
                  const isLast = idx === data.length - 1;
                  return (
                    <tr
                      key={keyExtractor(row)}
                      className={`${
                        isLast ? 'border-none' : 'border-b border-white/5'
                      } transition-colors hover:bg-white/[0.02]`}
                    >
                      {columns.map((col, colIdx) => (
                        <td
                          key={colIdx}
                          className="p-4 text-center font-medium text-gray-200"
                        >
                          {col.render
                            ? col.render(row)
                            : col.accessor
                              ? String(row[col.accessor])
                              : null}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination && data.length > 0 && (
          <div className="flex items-center justify-between border-t border-white/10 bg-white/5 px-6 py-4">
            <span className="text-xs text-gray-400">
              Mostrando página{' '}
              <span className="font-medium text-white">{pagination.page}</span>{' '}
              de{' '}
              <span className="font-medium text-white">
                {Math.ceil(pagination.total / pagination.limit) || 1}
              </span>
            </span>

            <div className="flex gap-2">
              <button
                className="cursor-pointer rounded-md border border-white/10 bg-[#1a1a1a] px-4 py-2 text-xs font-semibold text-gray-300 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                disabled={!pagination.hasPrev}
                onClick={pagination.onPrev}
              >
                Anterior
              </button>
              <button
                className="cursor-pointer rounded-md border border-white/10 bg-[#1a1a1a] px-4 py-2 text-xs font-semibold text-gray-300 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                disabled={!pagination.hasNext}
                onClick={pagination.onNext}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

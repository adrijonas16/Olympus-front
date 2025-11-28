import { useState } from 'react';
import estilos from './Table.module.css';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  pageSize?: number;
}

function Table<T extends { id: string | number }>({
  columns,
  data,
  selectable = true,
  onSelectionChange,
  pageSize = 15
}: TableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSelectAll = (checked: boolean) => {
    const newSelected = new Set(selectedRows);
    
    if (checked) {
      paginatedData.forEach(row => newSelected.add(row.id));
    } else {
      paginatedData.forEach(row => newSelected.delete(row.id));
    }
    
    setSelectedRows(newSelected);
    const selectedData = data.filter(r => newSelected.has(r.id));
    onSelectionChange?.(selectedData);
  };

  const handleSelectRow = (row: T, checked: boolean) => {
    const rowId = row.id;
    const newSelected = new Set(selectedRows);
    
    if (checked) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }
    
    setSelectedRows(newSelected);
    const selectedData = data.filter(r => {
      return newSelected.has(r.id);
    });
    onSelectionChange?.(selectedData);
  };

  const handleSort = (key: string) => {
    const column = columns.find(col => (col.key === key || col.key === key) && col.sortable);
    if (!column) return;

    const direction = sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const sortedData = [...data];
  if (sortConfig) {
    sortedData.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];
      
      if (aValue === bValue) return 0;
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const allSelected = paginatedData.length > 0 && paginatedData.every(row => selectedRows.has(row.id));
  const someSelected = paginatedData.some(row => selectedRows.has(row.id)) && !allSelected;

  return (
    <div className={estilos.tableContainer}>
      <table className={estilos.table}>
        <thead>
          <tr className={estilos.headerRow}>
            {selectable && (
              <th className={estilos.headerCell}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className={estilos.checkbox}
                  />
                  <span>Seleccionados</span>
                </div>
              </th>
            )}
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={estilos.headerCell}
                onClick={() => column.sortable && handleSort(String(column.key))}
                style={{ cursor: column.sortable ? 'pointer' : 'default' }}
              >
                {column.label}
                {column.sortable && (
                  <span className={estilos.sortIcon}>
                    {sortConfig?.key === column.key
                      ? sortConfig.direction === 'asc' ? '▲' : '▼'
                      : '▼'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => {
            const rowId = row.id;
            const isSelected = selectedRows.has(rowId);
            const rowClass = isSelected
              ? `${estilos.tableRow} ${estilos.tableRowSelected}`
              : estilos.tableRow;
            
            return (
              <tr
                key={rowId}
                className={rowClass}
              >
                {selectable && (
                  <td className={estilos.tableCell}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectRow(row, e.target.checked)}
                      className={estilos.checkbox}
                    />
                  </td>
                )}
                {columns.map((column) => {
                  const value = row[column.key as keyof T];
                  return (
                    <td key={String(column.key)} className={estilos.tableCell}>
                      {column.render ? column.render(value, row) : String(value ?? '')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className={estilos.pagination}>
          <button
            className={estilos.paginationButton}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          <span className={estilos.paginationInfo}>
            Página {currentPage} de {totalPages}
          </span>
          <button
            className={estilos.paginationButton}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default Table;


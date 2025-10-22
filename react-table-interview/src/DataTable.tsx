import React, { useState, useMemo, useCallback, memo } from 'react';

// Type Definitions
interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
  joinDate: string;
}

type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: keyof Employee | null;
  direction: SortDirection;
}

interface RangeFilter {
  min?: number;
  max?: number;
}

type FilterValue = string | number | RangeFilter;
type Filters = Partial<Record<keyof Employee, FilterValue>>;

// Sample data structure
const generateMockData = (count = 100): Employee[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    department: ['Engineering', 'Sales', 'Marketing', 'HR'][i % 4],
    salary: 50000 + Math.floor(Math.random() * 100000),
    joinDate: new Date(2020 + (i % 5), i % 12, (i % 28) + 1).toISOString().split('T')[0]
  }));
};

// use a spread operator to create a new array instance to avoid mutation
function sortByKey<T extends Record<string, any>>(data: T[], key: keyof T, direction: SortDirection): T[] {
  return data.sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    // double == for null/undefined
    if (aValue == null) {
      return 1
    }

    if (bValue == null) {
      return -1
    }

    let comparison = 0;
    
    // need to ensure that all values in data column are the same type. Should be backend verified
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else {
      // Convert to string for comparison (handles dates)
      comparison = String(aValue).localeCompare(String(bValue));
    }
    
    return direction === 'asc' ? comparison : -comparison;
  })
}

const filterData = <T extends Record<string, any>>(sortedData: T[], filters: Partial<Record<keyof T, FilterValue>>): T[] => {
  return sortedData.filter(row => {
    return Object.entries(filters).every(([key, filterValue]) => {
      const rowValue = row[key as keyof T]

      if (rowValue == null) {
        return false
      }

      if (typeof filterValue === 'string') {
        return String(rowValue)
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      }

      if (typeof filterValue === 'object' && !Array.isArray(filterValue)) {
        if (filterValue.min !== undefined && rowValue < filterValue.min) {
          return false
        }

        if (filterValue.max !== undefined && rowValue > filterValue.max) {
          return false
        }

        return true
      }

      // equality comparison might be an issue here
      return rowValue === filterValue
    })
  })
}

// Custom hook for table data management
function useTableData(rawData: Employee[]) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState<Filters>({});

  // TODO: Implement sorting logic
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return rawData;
    
    return sortByKey([...rawData], sortConfig.key, sortConfig.direction)
  }, [rawData, sortConfig]);

  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) return sortedData;
    
    return filterData(sortedData, filters)
  }, [sortedData, filters]);

  const toggleRow = useCallback((id: number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id);
      }

      return newSet
    });
  }, []);

  // TODO: Implement select all/none
  const toggleAll = useCallback(() => {
    setSelectedRows((prev) => {
      const visibleIds = filteredData
        .map((data) => data.id )

      const allSelected = visibleIds.every((id) => prev.has(id))
      if (allSelected) {
        const res = new Set(prev)
        visibleIds.forEach(id => res.delete(id))
        return res
      } else {
        const res = new Set<number>()
        visibleIds.forEach(id => res.add(id))
        return res
      }

    })
  }, [filteredData]);

  const applySort = useCallback((key: keyof Employee) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const applyFilters = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  return {
    visibleData: filteredData,
    selectedRows,
    toggleRow,
    toggleAll,
    applySort,
    applyFilters,
    sortConfig,
    filters
  };
}

// Custom hook for table pagination
function useTablePagination<T>(data: T[], initialPageSize: number = 10) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / pageSize);
  }, [data.length, pageSize]);

  // Get paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const previousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  // Computed values
  const canGoNext = currentPage < totalPages;
  const canGoPrevious = currentPage > 1;

  const pageInfo = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, data.length);
    return `Showing ${startIndex}-${endIndex} of ${data.length}`;
  }, [currentPage, pageSize, data.length]);

  // Reset to page 1 when data changes (e.g., after filtering)
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  return {
    // Data
    paginatedData,

    // State
    currentPage,
    pageSize,
    totalPages,

    // Navigation
    goToPage,
    nextPage,
    previousPage,
    changePageSize,

    // Computed
    canGoNext,
    canGoPrevious,
    pageInfo
  };
}

// Memoized row component to prevent unnecessary re-renders
interface TableRowProps {
  row: Employee;
  isSelected: boolean;
  onToggle: (id: number) => void;
}

const TableRow = memo<TableRowProps>(({ row, isSelected, onToggle }) => {
  return (
    <tr className={isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}>
      <td className="px-4 py-2 border-b">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(row.id)}
          className="cursor-pointer"
        />
      </td>
      <td className="px-4 py-2 border-b">{row.id}</td>
      <td className="px-4 py-2 border-b">{row.name}</td>
      <td className="px-4 py-2 border-b">{row.email}</td>
      <td className="px-4 py-2 border-b">{row.department}</td>
      <td className="px-4 py-2 border-b">${row.salary.toLocaleString()}</td>
      <td className="px-4 py-2 border-b">{row.joinDate}</td>
    </tr>
  );
});

TableRow.displayName = 'TableRow';

// Main table component
function DataTable() {
  const mockData = useMemo(() => generateMockData(100), []);
  
  const {
    visibleData,
    selectedRows,
    toggleRow,
    toggleAll,
    applySort,
    applyFilters,
    sortConfig
  } = useTableData(mockData);

  const {
    paginatedData,
    currentPage,
    pageSize,
    totalPages,
    nextPage,
    previousPage,
    changePageSize,
    canGoNext,
    canGoPrevious,
    pageInfo
  } = useTablePagination(visibleData)

  const [departmentFilter, setDepartmentFilter] = useState<string>('');

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dept = e.target.value;
    setDepartmentFilter(dept);
    applyFilters(dept ? { department: dept } : {});
  };

  const getSortIndicator = (key: keyof Employee) => {
    if (sortConfig.key !== key) return ' ⇅';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Employee Data Table</h1>
        
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Filter by Department:</label>
            <select 
              value={departmentFilter}
              onChange={handleFilterChange}
              className="border rounded px-3 py-2"
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={selectedRows.size === 0}
            >
              Export Selected ({selectedRows.size})
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          {pageInfo} • {visibleData.length} total after filters
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left border-b">
                <input
                  type="checkbox"
                  onChange={toggleAll}
                  className="cursor-pointer"
                />
              </th>
              <th 
                className="px-4 py-3 text-left border-b cursor-pointer hover:bg-gray-200"
                onClick={() => applySort('id')}
              >
                ID{getSortIndicator('id')}
              </th>
              <th 
                className="px-4 py-3 text-left border-b cursor-pointer hover:bg-gray-200"
                onClick={() => applySort('name')}
              >
                Name{getSortIndicator('name')}
              </th>
              <th className="px-4 py-3 text-left border-b">Email</th>
              <th 
                className="px-4 py-3 text-left border-b cursor-pointer hover:bg-gray-200"
                onClick={() => applySort('department')}
              >
                Department{getSortIndicator('department')}
              </th>
              <th 
                className="px-4 py-3 text-left border-b cursor-pointer hover:bg-gray-200"
                onClick={() => applySort('salary')}
              >
                Salary{getSortIndicator('salary')}
              </th>
              <th 
                className="px-4 py-3 text-left border-b cursor-pointer hover:bg-gray-200"
                onClick={() => applySort('joinDate')}
              >
                Join Date{getSortIndicator('joinDate')}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map(row => (
              <TableRow
                key={row.id}
                row={row}
                isSelected={selectedRows.has(row.id)}
                onToggle={toggleRow}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Rows per page:</label>
          <select
            value={pageSize}
            onChange={(e) => changePageSize(Number(e.target.value))}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              onClick={previousPage}
              disabled={!canGoPrevious}
              className="px-4 py-2 border rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              disabled={!canGoNext}
              className="px-4 py-2 border rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold mb-2">TODO - Improvements Needed:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>Implement sorting logic in useTableData hook</li>
          <li>Implement filtering logic for multiple criteria</li>
          <li>Fix row selection (toggleRow and toggleAll)</li>
          <li>Add virtualization for 10,000+ rows (react-window)</li>
          <li>Add debouncing for filter inputs</li>
          <li>Implement export functionality</li>
          <li>Add loading states and error handling</li>
          <li>Write unit tests for useTableData hook</li>
        </ul>
      </div>
    </div>
  );
}

export default DataTable;

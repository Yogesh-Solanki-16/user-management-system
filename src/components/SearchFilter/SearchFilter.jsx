import { useRef } from 'react'
import './SearchFilter.css'

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'name-asc', label: 'Name A→Z' },
  { value: 'name-desc', label: 'Name Z→A' },
  { value: 'age-asc', label: 'Age Low→High' },
  { value: 'age-desc', label: 'Age High→Low' },
]

const GENDER_OPTIONS = [
  { value: '', label: 'All Genders' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
]

export default function SearchFilter({ filters, onFiltersChange, roles, totalFiltered, totalAll }) {
  const searchRef = useRef(null)

  const handleSearch = (e) => {
    onFiltersChange({ ...filters, search: e.target.value, page: 1 })
  }

  const handleRole = (e) => {
    onFiltersChange({ ...filters, role: e.target.value, page: 1 })
  }

  const handleGender = (e) => {
    onFiltersChange({ ...filters, gender: e.target.value, page: 1 })
  }

  const handleSort = (e) => {
    onFiltersChange({ ...filters, sort: e.target.value, page: 1 })
  }

  const handleClear = () => {
    onFiltersChange({ search: '', role: '', gender: '', sort: '', page: 1 })
    searchRef.current?.focus()
  }

  const hasActiveFilters = filters.search || filters.role || filters.gender || filters.sort
  const isFiltered = totalFiltered < totalAll

  return (
    <div className="search-filter">
      <div className="search-filter-top">
        <div className="search-wrapper">
          <span className="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            ref={searchRef}
            type="text"
            className="search-input"
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={handleSearch}
            aria-label="Search users"
          />
          {filters.search && (
            <button
              className="search-clear-btn"
              onClick={() => onFiltersChange({ ...filters, search: '', page: 1 })}
              aria-label="Clear search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        <div className="filter-controls">
          <select
            className="filter-select"
            value={filters.gender}
            onChange={handleGender}
            aria-label="Filter by gender"
          >
            {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <select
            className="filter-select"
            value={filters.role}
            onChange={handleRole}
            aria-label="Filter by role"
          >
            <option value="">All Roles</option>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <select
            className="filter-select"
            value={filters.sort}
            onChange={handleSort}
            aria-label="Sort users"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {hasActiveFilters && (
            <button className="btn btn-ghost clear-filters-btn" onClick={handleClear}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>

      {isFiltered && (
        <div className="filter-result-info">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Found <strong>{totalFiltered}</strong> of {totalAll} users
        </div>
      )}
    </div>
  )
}

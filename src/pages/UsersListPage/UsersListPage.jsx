import { useState, useEffect, useMemo, useCallback } from 'react'
import { fetchUsers, createUser, updateUser, deleteUser } from '../../utils/api'
import { useToast } from '../../context/ToastContext'
import SearchFilter from '../../components/SearchFilter/SearchFilter'
import UserTable from '../../components/UserTable/UserTable'
import UserModal from '../../components/UserModal/UserModal'
import DeleteConfirmModal from '../../components/DeleteConfirmModal/DeleteConfirmModal'
import Pagination from '../../components/Pagination/Pagination'
import './UsersListPage.css'

const ITEMS_PER_PAGE = 10

const INITIAL_FILTERS = { search: '', role: '', gender: '', sort: '', page: 1 }

function applyFiltersAndSort(users, filters) {
  let result = [...users]
  const q = filters.search.toLowerCase().trim()

  if (q) {
    result = result.filter(u =>
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    )
  }

  if (filters.gender) {
    result = result.filter(u => u.gender?.toLowerCase() === filters.gender)
  }

  if (filters.role) {
    result = result.filter(u => u.role?.toLowerCase() === filters.role.toLowerCase())
  }

  if (filters.sort === 'name-asc') {
    result.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`))
  } else if (filters.sort === 'name-desc') {
    result.sort((a, b) => `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`))
  } else if (filters.sort === 'age-asc') {
    result.sort((a, b) => (a.age || 0) - (b.age || 0))
  } else if (filters.sort === 'age-desc') {
    result.sort((a, b) => (b.age || 0) - (a.age || 0))
  }

  return result
}

export default function UsersListPage() {
  const [allUsers, setAllUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [modalUser, setModalUser] = useState(undefined) // undefined = closed, null = create, obj = edit
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchUsers(100, 0)
      setAllUsers(data.users || [])
    } catch (err) {
      setError(err.message)
      addToast('Failed to load users. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = useMemo(() => applyFiltersAndSort(allUsers, filters), [allUsers, filters])

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)

  const paginatedUsers = useMemo(() => {
    const start = (filters.page - 1) * ITEMS_PER_PAGE
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredUsers, filters.page])

  const roles = useMemo(() => {
    const set = new Set(allUsers.map(u => u.role).filter(Boolean))
    return Array.from(set).sort()
  }, [allUsers])

  const stats = useMemo(() => {
    const maleCount = allUsers.filter(u => u.gender === 'male').length
    const femaleCount = allUsers.filter(u => u.gender === 'female').length
    const avgAge = allUsers.length > 0 
      ? Math.round(allUsers.reduce((sum, u) => sum + (u.age || 0), 0) / allUsers.length)
      : 0
    return { total: allUsers.length, male: maleCount, female: femaleCount, avgAge }
  }, [allUsers])

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  const handlePageChange = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleEdit = useCallback((user) => setModalUser(user), [])

  const handleOpenCreate = useCallback(() => setModalUser(null), [])

  const handleModalClose = useCallback(() => setModalUser(undefined), [])

  const handleModalSubmit = async (formData) => {
    setIsSaving(true)
    try {
      if (modalUser) {
        const updated = await updateUser(modalUser.id, formData)
        setAllUsers(prev => prev.map(u => u.id === modalUser.id ? { ...u, ...updated } : u))
        addToast(`${updated.firstName} ${updated.lastName} updated successfully!`, 'success')
      } else {
        const created = await createUser(formData)
        setAllUsers(prev => [{ ...created, id: created.id || Date.now() }, ...prev])
        addToast(`${created.firstName} ${created.lastName} created successfully!`, 'success')
      }
      setModalUser(undefined)
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteClick = useCallback((user) => setDeleteTarget(user), [])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteUser(deleteTarget.id)
      setAllUsers(prev => prev.filter(u => u.id !== deleteTarget.id))
      addToast(`${deleteTarget.firstName} ${deleteTarget.lastName} deleted.`, 'success')
      setDeleteTarget(null)
      if (paginatedUsers.length === 1 && filters.page > 1) {
        setFilters(prev => ({ ...prev, page: prev.page - 1 }))
      }
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="users-page">
      <div className="container">
        {/* Stats Cards */}
        {!isLoading && !error && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon stat-icon-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Users</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-male">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="10" cy="14" r="7"/><line x1="21" y1="3" x2="15.5" y2="8.5"/><line x1="21" y1="3" x2="15.5" y2="3"/><line x1="21" y1="3" x2="21" y2="8.5"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.male}</div>
                <div className="stat-label">Male</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-female">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="10" r="7"/><path d="M12 17v5"/><path d="M9 20h6"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.female}</div>
                <div className="stat-label">Female</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-age">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.avgAge}</div>
                <div className="stat-label">Avg Age</div>
              </div>
            </div>
          </div>
        )}

        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">Users</h1>
            <span className="users-count-badge">
              {isLoading ? '...' : allUsers.length} total
            </span>
          </div>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add User
          </button>
        </div>

        <div className="users-card">
          <SearchFilter
            filters={filters}
            onFiltersChange={handleFiltersChange}
            roles={roles}
            totalFiltered={filteredUsers.length}
            totalAll={allUsers.length}
          />

          <UserTable
            users={paginatedUsers}
            isLoading={isLoading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />

          {!isLoading && !error && filteredUsers.length > 0 && (
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filteredUsers.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          )}
        </div>
      </div>

      {modalUser !== undefined && (
        <UserModal
          user={modalUser}
          onSubmit={handleModalSubmit}
          onClose={handleModalClose}
          isLoading={isSaving}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          user={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}

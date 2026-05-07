import { useNavigate } from 'react-router-dom'
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader'
import './UserTable.css'

function getRoleBadgeClass(role) {
  const r = (role || '').toLowerCase()
  if (r === 'admin') return 'badge-red'
  if (r === 'moderator') return 'badge-yellow'
  if (r === 'user') return 'badge-blue'
  return 'badge-gray'
}

function ViewIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  )
}

export default function UserTable({ users, isLoading, error, onEdit, onDelete }) {
  const navigate = useNavigate()

  if (error) {
    return (
      <div className="table-state error-state">
        <div className="state-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h3>Something went wrong</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (!isLoading && users.length === 0) {
    return (
      <div className="table-state empty-state">
        <div className="state-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <h3>No users found</h3>
        <p>Try adjusting your search or filter criteria.</p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <SkeletonLoader rows={8} />
          ) : (
            users.map(user => (
              <tr key={user.id} className="user-row">
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-wrapper">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="user-avatar"
                          onError={e => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div
                        className="user-avatar-fallback"
                        style={{ display: user.image ? 'none' : 'flex' }}
                        aria-hidden="true"
                      >
                        {(user.firstName?.[0] || '').toUpperCase()}{(user.lastName?.[0] || '').toUpperCase()}
                      </div>
                    </div>
                    <div className="user-name-group">
                      <span className="user-fullname">{user.firstName} {user.lastName}</span>
                      <span className="user-age">{user.age && `Age ${user.age}`}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="user-email">{user.email}</span>
                </td>
                <td>
                  <span className="user-phone">{user.phone}</span>
                </td>
                <td>
                  <span className="user-company">{user.company?.name || '—'}</span>
                </td>
                <td>
                  <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                    {user.role || '—'}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button
                      className="action-btn action-view"
                      onClick={() => navigate(`/users/${user.id}`)}
                      title="View details"
                      aria-label={`View ${user.firstName} ${user.lastName}`}
                    >
                      <ViewIcon /> View
                    </button>
                    <button
                      className="action-btn action-edit"
                      onClick={() => onEdit(user)}
                      title="Edit user"
                      aria-label={`Edit ${user.firstName} ${user.lastName}`}
                    >
                      <EditIcon /> Edit
                    </button>
                    <button
                      className="action-btn action-delete"
                      onClick={() => onDelete(user)}
                      title="Delete user"
                      aria-label={`Delete ${user.firstName} ${user.lastName}`}
                    >
                      <DeleteIcon /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

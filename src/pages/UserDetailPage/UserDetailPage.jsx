import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchUser } from '../../utils/api'
import './UserDetailPage.css'

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{value || '—'}</span>
    </div>
  )
}

function Section({ title, icon, children }) {
  return (
    <div className="detail-section">
      <div className="section-header">
        <span className="section-icon">{icon}</span>
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="section-body">{children}</div>
    </div>
  )
}

function getRoleBadgeClass(role) {
  const r = (role || '').toLowerCase()
  if (r === 'admin') return 'badge-red'
  if (r === 'moderator') return 'badge-yellow'
  if (r === 'user') return 'badge-blue'
  return 'badge-gray'
}

function formatDate(dateStr) {
  if (!dateStr) return null
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateStr
  }
}

export default function UserDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchUser(id)
        if (!cancelled) setUser(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  if (isLoading) {
    return (
      <div className="detail-page">
        <div className="container">
          <div className="detail-skeleton">
            <div className="skeleton-hero">
              <div className="skeleton skeleton-avatar-lg"></div>
              <div className="skeleton-hero-info">
                <div className="skeleton skeleton-text-xl"></div>
                <div className="skeleton skeleton-text-md"></div>
                <div className="skeleton skeleton-badge"></div>
              </div>
            </div>
            <div className="skeleton-sections">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton-section-card">
                  <div className="skeleton skeleton-text-sm" style={{ width: 120, marginBottom: 16 }}></div>
                  {[1, 2, 3].map(j => (
                    <div key={j} className="skeleton-row-item">
                      <div className="skeleton skeleton-text-sm" style={{ width: 80 }}></div>
                      <div className="skeleton skeleton-text-md"></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="detail-page">
        <div className="container">
          <div className="detail-error">
            <div className="error-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h2>Failed to load user</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Back to Users
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  const fullName = `${user.firstName} ${user.lastName}`
  const fullAddress = [user.address?.address, user.address?.city, user.address?.state, user.address?.country]
    .filter(Boolean).join(', ')

  return (
    <div className="detail-page">
      <div className="container">
        {/* Hero Card */}
        <div className="detail-hero">
          <div className="hero-avatar-wrapper">
            {user.image ? (
              <img
                src={user.image}
                alt={fullName}
                className="hero-avatar"
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div
              className="hero-avatar-fallback"
              style={{ display: user.image ? 'none' : 'flex' }}
              aria-hidden="true"
            >
              {(user.firstName?.[0] || '').toUpperCase()}{(user.lastName?.[0] || '').toUpperCase()}
            </div>
          </div>
          <div className="hero-info">
            <h1 className="hero-name">{fullName}</h1>
            <p className="hero-email">{user.email}</p>
            <div className="hero-badges">
              {user.role && (
                <span className={`badge ${getRoleBadgeClass(user.role)}`}>{user.role}</span>
              )}
              {user.gender && (
                <span className="badge badge-gray">{user.gender}</span>
              )}
              {user.age && (
                <span className="badge badge-gray">Age {user.age}</span>
              )}
            </div>
          </div>
          <button className="hero-back-btn btn btn-secondary" onClick={() => navigate('/')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back
          </button>
        </div>

        {/* Detail Sections Grid */}
        <div className="detail-grid">
          <Section
            title="Basic Information"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            }
          >
            <InfoRow label="Full Name" value={fullName} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Phone" value={user.phone} />
            <InfoRow label="Age" value={user.age} />
            <InfoRow label="Gender" value={user.gender} />
            <InfoRow label="Role" value={user.role} />
          </Section>

          <Section
            title="Address"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            }
          >
            <InfoRow label="Address" value={user.address?.address} />
            <InfoRow label="City" value={user.address?.city} />
            <InfoRow label="State" value={user.address?.state} />
            <InfoRow label="Country" value={user.address?.country} />
            {fullAddress && <InfoRow label="Full Address" value={fullAddress} />}
          </Section>

          <Section
            title="Company"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
              </svg>
            }
          >
            <InfoRow label="Company" value={user.company?.name} />
            <InfoRow label="Department" value={user.company?.department} />
            <InfoRow label="Title" value={user.company?.title} />
          </Section>

          <Section
            title="Additional Information"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            }
          >
            <InfoRow label="Birth Date" value={formatDate(user.birthDate)} />
            <InfoRow label="University" value={user.university} />
            <InfoRow label="Username" value={user.username} />
            <InfoRow label="Blood Group" value={user.bloodGroup} />
          </Section>
        </div>
      </div>
    </div>
  )
}

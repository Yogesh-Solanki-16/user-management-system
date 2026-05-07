import './SkeletonLoader.css'

function SkeletonRow() {
  return (
    <tr className="skeleton-row">
      <td>
        <div className="skeleton-user-cell">
          <div className="skeleton skeleton-avatar"></div>
          <div className="skeleton-user-info">
            <div className="skeleton skeleton-text skeleton-text-md"></div>
            <div className="skeleton skeleton-text skeleton-text-sm"></div>
          </div>
        </div>
      </td>
      <td><div className="skeleton skeleton-text skeleton-text-md"></div></td>
      <td><div className="skeleton skeleton-text skeleton-text-sm"></div></td>
      <td><div className="skeleton skeleton-text skeleton-text-sm"></div></td>
      <td><div className="skeleton skeleton-badge"></div></td>
      <td>
        <div className="skeleton-actions">
          <div className="skeleton skeleton-btn"></div>
          <div className="skeleton skeleton-btn"></div>
          <div className="skeleton skeleton-btn"></div>
        </div>
      </td>
    </tr>
  )
}

export default function SkeletonLoader({ rows = 8 }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <SkeletonRow key={i} />
      ))}
    </>
  )
}

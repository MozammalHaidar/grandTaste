import { Link } from 'react-router-dom'

const EmptyState = ({ icon, title, desc, actionLabel, actionTo }) => (
  <div className="text-center py-20">
    <div className="text-7xl mb-4">{icon}</div>
    <h2 className="text-2xl font-bold text-gray-700 mb-2">{title}</h2>
    <p className="text-gray-400 mb-8">{desc}</p>
    {actionLabel && actionTo && (
      <Link to={actionTo} className="btn-primary px-10 py-3">{actionLabel}</Link>
    )}
  </div>
)

export default EmptyState
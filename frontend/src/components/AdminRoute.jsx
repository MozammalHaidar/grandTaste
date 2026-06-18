import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AdminRoute = ({ children }) => {
  const { user, accessToken } = useSelector((state) => state.auth)
  if (!accessToken) return <Navigate to="/login" replace />
  if (!user?.is_staff) return <Navigate to="/" replace />
  return children
}

export default AdminRoute
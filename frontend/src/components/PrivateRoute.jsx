import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoute = ({ children }) => {
  const { accessToken } = useSelector((state) => state.auth)
  return accessToken ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
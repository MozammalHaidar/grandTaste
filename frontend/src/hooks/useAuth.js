import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/authSlice'
import api from '../api/axios'
import toast from 'react-hot-toast'

const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, accessToken } = useSelector((state) => state.auth)

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem('refreshToken')
      await api.post('/users/logout/', { refresh })
    } catch {}
    dispatch(logout())
    toast.success('Logged out successfully!')
    navigate('/login')
  }

  return { user, accessToken, handleLogout, isAdmin: user?.is_staff }
}

export default useAuth
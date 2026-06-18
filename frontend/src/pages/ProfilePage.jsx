import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import PageHeader from '../components/ui/PageHeader'
import api from '../api/axios'
import { updateUser } from '../store/authSlice'
import { getImageUrl } from '../utils/helpers'
import { SkeletonProfile } from '../components/ui/Skeleton'

// ─── Constants ───────────────────────────────────────────────
const TABS = [
  { id: 'profile',  label: '👤 My Profile' },
  { id: 'password', label: '🔒 Change Password' },
]

// ─── Avatar Section ──────────────────────────────────────────
const AvatarSection = ({ user, avatarLoading, onAvatarChange }) => (
  <div className="card p-6 text-center mb-4">
    <div className="relative inline-block mb-4">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-100 mx-auto flex items-center justify-center">
        {user?.avatar ? (
          <img src={getImageUrl(user.avatar)} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl font-bold text-primary-500">
            {user?.first_name?.[0]?.toUpperCase() || 'U'}
          </span>
        )}
      </div>
      <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors shadow-md">
        <span className="text-white text-xs">📷</span>
        <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
      </label>
    </div>
    {avatarLoading && <p className="text-xs text-gray-400 mb-2">Uploading...</p>}
    <h3 className="font-bold text-gray-800">{user?.first_name} {user?.last_name}</h3>
    <p className="text-sm text-gray-400 truncate">{user?.email}</p>
  </div>
)

// ─── Profile Form ─────────────────────────────────────────────
const ProfileForm = ({ user, profileData, onChange, onSubmit, loading }) => (
  <div className="card p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h2>
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[
          { name: 'first_name', label: 'First Name', placeholder: 'John' },
          { name: 'last_name',  label: 'Last Name',  placeholder: 'Doe' },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
            <input type="text" name={field.name}
              value={profileData[field.name]}
              onChange={onChange}
              className="input-field"
              placeholder={field.placeholder}
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <input type="email" value={user?.email || ''} disabled
          className="input-field bg-gray-50 text-gray-400 cursor-not-allowed" />
        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
        <input type="text" name="phone"
          value={profileData.phone}
          onChange={onChange}
          className="input-field"
          placeholder="+880 1700-000000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
        <textarea name="address" rows={3}
          value={profileData.address}
          onChange={onChange}
          className="input-field resize-none"
          placeholder="Your default delivery address..."
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary px-8">
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  </div>
)

// ─── Password Form ────────────────────────────────────────────
const PasswordForm = ({ passwordData, onChange, onSubmit, loading }) => (
  <div className="card p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-6">Change Password</h2>
    <form onSubmit={onSubmit} className="space-y-5 max-w-md">
      {[
        { name: 'old_password', label: 'Current Password',      placeholder: '••••••••' },
        { name: 'new_password', label: 'New Password',          placeholder: '••••••••' },
        { name: 'new_password2', label: 'Confirm New Password', placeholder: '••••••••' },
      ].map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
          <input type="password" name={field.name} required
            value={passwordData[field.name]}
            onChange={onChange}
            className="input-field"
            placeholder={field.placeholder}
          />
        </div>
      ))}

      <div className="bg-orange-50 rounded-xl p-4">
        <p className="text-sm text-gray-600 font-medium mb-2">Password Requirements:</p>
        <ul className="text-xs text-gray-500 space-y-1">
          {[
            'At least 8 characters long',
            'Must contain letters and numbers',
            'Cannot be too similar to your email',
          ].map((req) => (
            <li key={req}>• {req}</li>
          ))}
        </ul>
      </div>

      <button type="submit" disabled={loading} className="btn-primary px-8">
        {loading ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  </div>
)

// ─── Main Page ────────────────────────────────────────────────
const ProfilePage = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const [pageLoading, setPageLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name:  user?.last_name  || '',
    phone:      user?.phone      || '',
    address:    user?.address    || '',
  })
  const [passwordData, setPasswordData] = useState({
    old_password:  '',
    new_password:  '',
    new_password2: '',
  })
  const [profileLoading,  setProfileLoading]  = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [avatarLoading,   setAvatarLoading]   = useState(false)

  // Simulate page load for skeleton
  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleProfileChange  = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value })
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value })

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    try {
      const { data } = await api.patch('/users/profile/', profileData)
      dispatch(updateUser(data))
      toast.success('Profile updated successfully!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.new_password2) {
      toast.error('New passwords do not match')
      return
    }
    setPasswordLoading(true)
    try {
      await api.put('/users/change-password/', passwordData)
      toast.success('Password changed successfully!')
      setPasswordData({ old_password: '', new_password: '', new_password2: '' })
    } catch (err) {
      const errors = err.response?.data
      if (errors) {
        Object.values(errors).forEach((msg) =>
          toast.error(Array.isArray(msg) ? msg[0] : msg)
        )
      }
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarLoading(true)
    const fd = new FormData()
    fd.append('avatar', file)
    try {
      const { data } = await api.patch('/users/profile/', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      dispatch(updateUser(data))
      toast.success('Avatar updated!')
    } catch {
      toast.error('Failed to update avatar')
    } finally {
      setAvatarLoading(false)
    }
  }

  return (
    <Layout>
      <PageHeader title="My Profile" subtitle="Manage your account settings" />

      <div className="container-custom py-8">
        {pageLoading ? (
          <SkeletonProfile />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <AvatarSection
                user={user}
                avatarLoading={avatarLoading}
                onAvatarChange={handleAvatarChange}
              />
              <div className="card overflow-hidden">
                {TABS.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-5 py-3.5 text-sm font-medium transition-colors border-b border-gray-100 last:border-0 ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-500 border-l-4 border-l-primary-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' ? (
                <ProfileForm
                  user={user}
                  profileData={profileData}
                  onChange={handleProfileChange}
                  onSubmit={handleProfileSubmit}
                  loading={profileLoading}
                />
              ) : (
                <PasswordForm
                  passwordData={passwordData}
                  onChange={handlePasswordChange}
                  onSubmit={handlePasswordSubmit}
                  loading={passwordLoading}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ProfilePage
import { useState } from 'react'
import { Camera } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user'
  })
  const [passwords, setPasswords] = useState({ current: '', next: '' })

  const handleProfileChange = (event) => {
    setProfile((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handlePasswordChange = (event) => {
    setPasswords((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleProfileSubmit = (event) => {
    event.preventDefault()
    updateProfile(profile)
    toast.success('Profile updated.')
  }

  const handlePasswordSubmit = (event) => {
    event.preventDefault()
    toast.success('Password updated successfully.')
    setPasswords({ current: '', next: '' })
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile"
        subtitle="Manage your personal details and security settings."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-600 text-lg font-semibold text-on-brand">
                {profile.name
                  .split(' ')
                  .map((word) => word[0])
                  .join('') || 'TF'}
              </div>
              <button
                type="button"
                className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-bg-card text-ink-600 shadow-soft"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <p className="text-sm text-ink-500">Profile image</p>
              <p className="text-xs text-ink-400">Upload a square JPG/PNG.</p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleProfileSubmit}>
            <Input
              label="Full name"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleProfileChange}
            />
            <Input label="Role" name="role" value={profile.role} disabled />
            <div className="flex justify-end">
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </Card>

        <Card className="space-y-6">
          <h3 className="text-lg font-semibold text-ink-900 dark:text-on-brand">
            Change Password
          </h3>
          <form className="space-y-5" onSubmit={handlePasswordSubmit}>
            <Input
              label="Current password"
              name="current"
              type="password"
              value={passwords.current}
              onChange={handlePasswordChange}
            />
            <Input
              label="New password"
              name="next"
              type="password"
              value={passwords.next}
              onChange={handlePasswordChange}
            />
            <Button type="submit" className="w-full">
              Update password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Profile

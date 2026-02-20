import { useRef, useState } from 'react'
import {
  Camera, User, Mail, Shield, Phone, MapPin, Globe,
  Lock, Eye, EyeOff, Bell, Smartphone, LogOut,
  CheckCircle, Clock, CreditCard, TrendingUp, Wallet,
  AlertTriangle, Download, Trash2
} from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import Input from '../../components/Input'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const recentActivity = [
  { id: 1, action: 'Added transaction: Invoice #2045', time: '2 hours ago', icon: TrendingUp, color: '#80c570' },
  { id: 2, action: 'Updated budget for Operations', time: '1 day ago', icon: Wallet, color: '#60a5fa' },
  { id: 3, action: 'Password changed successfully', time: '3 days ago', icon: Lock, color: '#e8b25e' },
  { id: 4, action: 'New goal created: Emergency Fund', time: '5 days ago', icon: CheckCircle, color: '#a78bfa' },
  { id: 5, action: 'Login from Chrome on Windows', time: '1 week ago', icon: Smartphone, color: '#94a3b8' }
]

const accountStats = [
  { label: 'Transactions', value: '128', icon: CreditCard, color: '#60a5fa' },
  { label: 'Goals Active', value: '4', icon: TrendingUp, color: '#80c570' },
  { label: 'Accounts', value: '4', icon: Wallet, color: '#a78bfa' },
  { label: 'Days Active', value: '89', icon: Clock, color: '#e8b25e' }
]

const Profile = () => {
  const { user, updateProfile, logout } = useAuth()
  const fileRef = useRef(null)

  const [avatarPreview, setAvatarPreview] = useState(null)
  const [activeTab, setActiveTab] = useState('personal')

  const [profile, setProfile] = useState({
    name: user?.name || 'Demo User',
    email: user?.email || 'demo@trackfin.com',
    phone: '',
    location: '',
    website: '',
    bio: '',
    role: user?.role || 'user'
  })

  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    budgetWarnings: true,
    goalReminders: true,
    weeklyReport: false,
    loginAlerts: true,
    marketingEmails: false
  })

  const [isSaving, setIsSaving] = useState(false)

  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'TF'

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result)
    reader.readAsDataURL(file)
    toast.success('Avatar updated!')
  }

  const handleProfileChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    updateProfile(profile)
    toast.success('Profile updated successfully.')
    setIsSaving(false)
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (!passwords.current || !passwords.next) {
      toast.error('Please fill all password fields.')
      return
    }
    if (passwords.next !== passwords.confirm) {
      toast.error('New passwords do not match.')
      return
    }
    if (passwords.next.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }
    toast.success('Password updated successfully.')
    setPasswords({ current: '', next: '', confirm: '' })
  }

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
    toast.success('Notification preference saved.')
  }

  const passwordStrength = (pwd) => {
    if (!pwd) return null
    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    const levels = [
      { label: 'Weak', color: '#e77a8c', width: 25 },
      { label: 'Fair', color: '#e8b25e', width: 50 },
      { label: 'Good', color: '#60a5fa', width: 75 },
      { label: 'Strong', color: '#80c570', width: 100 }
    ]
    return levels[score - 1] || levels[0]
  }

  const strength = passwordStrength(passwords.next)

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'activity', label: 'Activity', icon: Clock }
  ]

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information, security, and preferences."
      />

      {/* Profile Hero Card */}
      <Card className="profile-hero-card">
        <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-4">
          {/* Avatar */}
          <div className="position-relative flex-shrink-0">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center overflow-hidden"
              style={{ width: 88, height: 88, background: avatarPreview ? 'transparent' : 'linear-gradient(135deg, #80c570, #60a5fa)', cursor: 'pointer' }}
              onClick={() => fileRef.current?.click()}
            >
              {avatarPreview
                ? <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span className="fw-bold text-white" style={{ fontSize: '1.6rem' }}>{initials}</span>
              }
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center rounded-circle border-2 text-white"
              style={{ width: 28, height: 28, background: '#0f172a', border: '2px solid var(--bg-card)', cursor: 'pointer' }}
              title="Upload photo"
            >
              <Camera size={12} />
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="d-none" onChange={handleAvatarChange} />
          </div>

          {/* Info */}
          <div className="flex-grow-1">
            <div className="d-flex align-items-start justify-content-between flex-wrap gap-2">
              <div>
                <h2 className="h4 fw-bold text-app-primary mb-1">{profile.name}</h2>
                <p className="text-app-secondary mb-1 small">{profile.email}</p>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <Badge variant={profile.role === 'admin' ? 'danger' : 'success'}>
                    <Shield size={11} /> {profile.role === 'admin' ? 'Administrator' : 'User'}
                  </Badge>
                  <Badge variant="secondary">
                    <CheckCircle size={11} /> Verified
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" className="p-2 text-danger d-flex align-items-center gap-2 small" onClick={logout}>
                <LogOut size={14} /> Sign Out
              </Button>
            </div>
          </div>

          {/* Account Stats */}
          <div className="d-flex gap-2 flex-wrap ms-sm-auto">
            {accountStats.map((stat) => (
              <div key={stat.label} className="text-center px-3 py-2 rounded-3 bg-body-tertiary" style={{ minWidth: 72 }}>
                <stat.icon size={16} style={{ color: stat.color }} className="mb-1" />
                <p className="fw-bold text-app-primary mb-0 small">{stat.value}</p>
                <p className="x-small text-app-muted mb-0">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="d-flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`btn btn-sm d-flex align-items-center gap-2 rounded-pill px-3 ${activeTab === tab.id ? 'btn-primary' : 'btn-outline-secondary'}`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Personal Info ─────────────────── */}
      {activeTab === 'personal' && (
        <div className="row g-3 g-lg-4">
          <div className="col-lg-8">
            <Card>
              <h3 className="h5 fw-semibold text-app-primary mb-4">Personal Information</h3>
              <form className="row g-3" onSubmit={handleProfileSubmit}>
                <div className="col-sm-6">
                  <label className="form-label small text-app-secondary mb-1">
                    <User size={13} className="me-1" /> Full Name
                  </label>
                  <input
                    className="form-control rounded-3"
                    name="name"
                    placeholder="Your full name"
                    value={profile.name}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label small text-app-secondary mb-1">
                    <Mail size={13} className="me-1" /> Email Address
                  </label>
                  <input
                    className="form-control rounded-3"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={profile.email}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label small text-app-secondary mb-1">
                    <Phone size={13} className="me-1" /> Phone Number
                  </label>
                  <input
                    className="form-control rounded-3"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={profile.phone}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label small text-app-secondary mb-1">
                    <MapPin size={13} className="me-1" /> Location
                  </label>
                  <input
                    className="form-control rounded-3"
                    name="location"
                    placeholder="City, Country"
                    value={profile.location}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small text-app-secondary mb-1">
                    <Globe size={13} className="me-1" /> Website / Portfolio
                  </label>
                  <input
                    className="form-control rounded-3"
                    name="website"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={profile.website}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small text-app-secondary mb-1">Bio</label>
                  <textarea
                    className="form-control rounded-3"
                    name="bio"
                    rows={3}
                    placeholder="Tell us a bit about yourself..."
                    value={profile.bio}
                    onChange={handleProfileChange}
                    style={{ resize: 'none' }}
                  />
                  <p className="x-small text-app-muted mt-1 mb-0">{profile.bio.length}/200 characters</p>
                </div>
                <div className="col-12 d-flex justify-content-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Right side — role + danger zone */}
          <div className="col-lg-4 d-flex flex-column gap-3">
            <Card>
              <h3 className="h6 fw-semibold text-app-primary mb-3">Account Role</h3>
              <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-body-tertiary">
                <div className="rounded-3 p-2 bg-success-subtle">
                  <Shield size={20} className="text-success" />
                </div>
                <div>
                  <p className="fw-semibold text-app-primary mb-0 small text-capitalize">{profile.role}</p>
                  <p className="x-small text-app-muted mb-0">Role is assigned by admin</p>
                </div>
              </div>
              <div className="mt-3 d-flex flex-column gap-2">
                <div className="d-flex justify-content-between small py-1 border-bottom">
                  <span className="text-app-muted">Account ID</span>
                  <span className="fw-medium text-app-primary">USR-1001</span>
                </div>
                <div className="d-flex justify-content-between small py-1 border-bottom">
                  <span className="text-app-muted">Member since</span>
                  <span className="fw-medium text-app-primary">Nov 2, 2024</span>
                </div>
                <div className="d-flex justify-content-between small py-1">
                  <span className="text-app-muted">Plan</span>
                  <Badge variant="success">Enterprise</Badge>
                </div>
              </div>
            </Card>

            <Card className="border-danger-subtle">
              <h3 className="h6 fw-semibold text-danger mb-1">Danger Zone</h3>
              <p className="x-small text-app-muted mb-3">These actions are permanent and cannot be undone.</p>
              <div className="d-flex flex-column gap-2">
                <Button variant="outline" className="w-100 border-danger text-danger d-flex align-items-center gap-2 justify-content-center btn-sm">
                  <Download size={14} /> Export My Data
                </Button>
                <Button variant="outline" className="w-100 border-danger text-danger d-flex align-items-center gap-2 justify-content-center btn-sm">
                  <Trash2 size={14} /> Delete Account
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── Tab: Security ──────────────────────── */}
      {activeTab === 'security' && (
        <div className="row g-3 g-lg-4">
          <div className="col-lg-7">
            <Card>
              <h3 className="h5 fw-semibold text-app-primary mb-4">Change Password</h3>
              <form className="d-flex flex-column gap-3" onSubmit={handlePasswordSubmit}>
                {/* Current password */}
                <div>
                  <label className="form-label small text-app-secondary mb-1">
                    <Lock size={13} className="me-1" /> Current Password
                  </label>
                  <div className="position-relative">
                    <input
                      className="form-control rounded-3 pe-5"
                      name="current"
                      type={showCurrent ? 'text' : 'password'}
                      placeholder="Enter current password"
                      value={passwords.current}
                      onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                    />
                    <button type="button" className="btn position-absolute end-0 top-50 translate-middle-y p-2 text-muted" onClick={() => setShowCurrent((v) => !v)}>
                      {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div>
                  <label className="form-label small text-app-secondary mb-1">
                    <Lock size={13} className="me-1" /> New Password
                  </label>
                  <div className="position-relative">
                    <input
                      className="form-control rounded-3 pe-5"
                      name="next"
                      type={showNew ? 'text' : 'password'}
                      placeholder="At least 8 characters"
                      value={passwords.next}
                      onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                    />
                    <button type="button" className="btn position-absolute end-0 top-50 translate-middle-y p-2 text-muted" onClick={() => setShowNew((v) => !v)}>
                      {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {strength && (
                    <div className="mt-2">
                      <div className="progress" style={{ height: 6 }}>
                        <div className="progress-bar" style={{ width: `${strength.width}%`, background: strength.color, transition: 'all 0.4s' }} />
                      </div>
                      <p className="x-small mt-1 mb-0 fw-medium" style={{ color: strength.color }}>{strength.label}</p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="form-label small text-app-secondary mb-1">Confirm New Password</label>
                  <div className="position-relative">
                    <input
                      className={`form-control rounded-3 pe-5 ${passwords.confirm && passwords.next !== passwords.confirm ? 'is-invalid' : passwords.confirm && passwords.next === passwords.confirm ? 'is-valid' : ''}`}
                      name="confirm"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Re-enter new password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                    />
                    <button type="button" className="btn position-absolute end-0 top-50 translate-middle-y p-2 text-muted" onClick={() => setShowConfirm((v) => !v)}>
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    {passwords.confirm && passwords.next !== passwords.confirm && (
                      <div className="invalid-feedback">Passwords do not match.</div>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-100 mt-1">Update Password</Button>
              </form>
            </Card>
          </div>

          <div className="col-lg-5 d-flex flex-column gap-3">
            {/* Security tips */}
            <Card>
              <h3 className="h6 fw-semibold text-app-primary mb-3">Security Tips</h3>
              <div className="d-flex flex-column gap-3">
                {[
                  { text: 'Use a unique password not used on other sites.', ok: true },
                  { text: 'Include uppercase, numbers & symbols.', ok: !!strength && strength.width >= 75 },
                  { text: 'Minimum 8 characters recommended.', ok: passwords.next.length >= 8 },
                  { text: 'Enable login alerts in notifications.', ok: false }
                ].map((tip, i) => (
                  <div key={i} className="d-flex align-items-start gap-2">
                    {tip.ok
                      ? <CheckCircle size={14} className="text-success flex-shrink-0 mt-1" />
                      : <AlertTriangle size={14} className="text-warning flex-shrink-0 mt-1" />
                    }
                    <p className="x-small text-app-secondary mb-0">{tip.text}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Active Sessions */}
            <Card>
              <h3 className="h6 fw-semibold text-app-primary mb-3">Active Sessions</h3>
              <div className="d-flex flex-column gap-3">
                {[
                  { device: 'Chrome on Windows', location: 'Mumbai, IN', current: true, time: 'Now' },
                  { device: 'Safari on iPhone', location: 'Delhi, IN', current: false, time: '3 days ago' }
                ].map((session, i) => (
                  <div key={i} className="d-flex align-items-center justify-content-between gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className={`rounded-3 p-2 ${session.current ? 'bg-success-subtle' : 'bg-body-tertiary'}`}>
                        <Smartphone size={14} className={session.current ? 'text-success' : 'text-app-muted'} />
                      </div>
                      <div>
                        <p className="small fw-medium text-app-primary mb-0">{session.device}</p>
                        <p className="x-small text-app-muted mb-0">{session.location} · {session.time}</p>
                      </div>
                    </div>
                    {session.current
                      ? <Badge variant="success">Current</Badge>
                      : <Button variant="ghost" className="p-1 text-danger x-small"><LogOut size={13} /></Button>
                    }
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── Tab: Notifications ─────────────────── */}
      {activeTab === 'notifications' && (
        <div className="row g-3 g-lg-4">
          <div className="col-lg-8">
            <Card>
              <h3 className="h5 fw-semibold text-app-primary mb-4">Notification Preferences</h3>
              <div className="d-flex flex-column gap-0">
                {[
                  { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive important account alerts via email', icon: Mail },
                  { key: 'budgetWarnings', label: 'Budget Warnings', desc: 'Get notified when budget exceeds 80% threshold', icon: AlertTriangle },
                  { key: 'goalReminders', label: 'Goal Reminders', desc: 'Weekly reminders to top up your savings goals', icon: TrendingUp },
                  { key: 'weeklyReport', label: 'Weekly Report', desc: 'Summary of your financial activity each week', icon: CreditCard },
                  { key: 'loginAlerts', label: 'Login Alerts', desc: 'Notify on new device logins for security', icon: Smartphone },
                  { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Updates about new TrackFin features and offers', icon: Bell }
                ].map((item, i, arr) => (
                  <div
                    key={item.key}
                    className={`d-flex align-items-center justify-content-between py-3 gap-3 ${i < arr.length - 1 ? 'border-bottom' : ''}`}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-3 p-2 bg-body-tertiary flex-shrink-0">
                        <item.icon size={15} className="text-app-secondary" />
                      </div>
                      <div>
                        <p className="small fw-medium text-app-primary mb-0">{item.label}</p>
                        <p className="x-small text-app-muted mb-0">{item.desc}</p>
                      </div>
                    </div>
                    <div className="form-check form-switch mb-0 flex-shrink-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={notifications[item.key]}
                        onChange={() => toggleNotification(item.key)}
                        style={{ width: '2.5rem', height: '1.3rem', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="col-lg-4">
            <Card>
              <h3 className="h6 fw-semibold text-app-primary mb-3">Quick Summary</h3>
              <div className="d-flex flex-column gap-2">
                <div className="rounded-3 p-3 bg-success-subtle">
                  <p className="small fw-semibold text-success mb-1">
                    {Object.values(notifications).filter(Boolean).length} alerts active
                  </p>
                  <p className="x-small text-app-secondary mb-0">You'll be notified for important events</p>
                </div>
                <div className="rounded-3 p-3 bg-body-tertiary">
                  <p className="x-small text-app-muted mb-0">
                    Notification delivery is via the email <strong>{profile.email}</strong>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── Tab: Activity ──────────────────────── */}
      {activeTab === 'activity' && (
        <Card>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h3 className="h5 fw-semibold text-app-primary mb-0">Recent Activity</h3>
              <p className="small text-app-secondary mb-0">Your last 5 actions on TrackFin</p>
            </div>
            <Button variant="outline" className="btn-sm d-flex align-items-center gap-2">
              <Download size={14} /> Export Log
            </Button>
          </div>
          <div className="d-flex flex-column">
            {recentActivity.map((item, i) => (
              <div key={item.id} className={`d-flex align-items-start gap-3 py-3 ${i < recentActivity.length - 1 ? 'border-bottom' : ''}`}>
                <div className="position-relative flex-shrink-0">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 38, height: 38, background: item.color + '22' }}
                  >
                    <item.icon size={15} style={{ color: item.color }} />
                  </div>
                  {i < recentActivity.length - 1 && (
                    <div
                      className="position-absolute start-50 translate-middle-x"
                      style={{ top: 38, width: 1, height: '100%', background: 'var(--border-subtle)' }}
                    />
                  )}
                </div>
                <div className="flex-grow-1">
                  <p className="small fw-medium text-app-primary mb-0">{item.action}</p>
                  <p className="x-small text-app-muted mb-0 d-flex align-items-center gap-1">
                    <Clock size={11} /> {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export default Profile

import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useAuth } from '../../context/AuthContext'

const DEMO_AUTH_ENABLED = import.meta.env.VITE_ENABLE_DEMO_AUTH === 'true'

const AuthPage = () => {
  const { login, register, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'signin'
  const [activeTab, setActiveTab] = useState(initialTab)

  const [loginValues, setLoginValues] = useState({ email: '', password: '' })
  const [registerValues, setRegisterValues] = useState({
    name: '',
    email: '',
    company: '',
    password: ''
  })

  const [loginErrors, setLoginErrors] = useState({})
  const [registerErrors, setRegisterErrors] = useState({})

  const fromRoute = useMemo(() => location.state?.from, [location.state])

  const handleLoginChange = (event) => {
    const { name, value } = event.target
    setLoginValues((prev) => ({ ...prev, [name]: value }))
    if (loginErrors[name]) {
      setLoginErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleRegisterChange = (event) => {
    const { name, value } = event.target
    setRegisterValues((prev) => ({ ...prev, [name]: value }))
    if (registerErrors[name]) {
      setRegisterErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validateLogin = () => {
    const errors = {}
    if (!loginValues.email) errors.email = 'Email is required'
    if (!loginValues.password) errors.password = 'Password is required'
    setLoginErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateRegister = () => {
    const errors = {}
    if (!registerValues.name) errors.name = 'Name is required'
    if (!registerValues.email) errors.email = 'Email is required'
    if (!registerValues.password) errors.password = 'Password is required'
    setRegisterErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    if (!validateLogin()) return
    await login(loginValues.email, loginValues.password)
  }

  const handleRegisterSubmit = async (event) => {
    event.preventDefault()
    if (!validateRegister()) return
    await register(registerValues)
  }

  const switchTab = (tab) => {
    setActiveTab(tab)
    navigate(`/auth?tab=${tab === 'signup' ? 'signup' : 'signin'}`, { replace: true })
  }

  return (
    <AuthLayout
      title="Welcome to TrackFin"
      subtitle="Mobile-ready finance workflows with secure access control."
      footer={
        <span>
          Need help? <Link className="text-success fw-semibold text-decoration-none" to="/forgot-password">Reset password</Link>
        </span>
      }
    >
      <div className="glass-card rounded-4 p-2 auth-tab-nav mb-3">
        <div className="d-flex gap-2">
          <button type="button" className={`auth-tab-btn ${activeTab === 'signin' ? 'active' : ''}`} onClick={() => switchTab('signin')}>
            Sign In
          </button>
          <button type="button" className={`auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => switchTab('signup')}>
            Sign Up
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm glass-card">
        <div className="card-body p-3 p-sm-4 card-body-mobile">
          {fromRoute && activeTab === 'signin' && (
            <div className="alert alert-info py-2 small mb-3">Please sign in to continue.</div>
          )}

          {activeTab === 'signin' ? (
            <form className="d-flex flex-column gap-2" onSubmit={handleLoginSubmit}>
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={loginValues.email}
                onChange={handleLoginChange}
                error={loginErrors.email}
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={loginValues.password}
                onChange={handleLoginChange}
                error={loginErrors.password}
              />
              <div className="d-flex align-items-center justify-content-between small flex-wrap gap-2">
                <div className="form-check m-0">
                  <input type="checkbox" className="form-check-input" id="rememberMe" />
                  <label className="form-check-label text-app-secondary" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
                <Link className="fw-semibold text-decoration-none text-success" to="/forgot-password">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-100 mt-2" variant="success" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          ) : (
            <form className="d-flex flex-column gap-2" onSubmit={handleRegisterSubmit}>
              <Input
                label="Full name"
                name="name"
                placeholder="Alex Carter"
                value={registerValues.name}
                onChange={handleRegisterChange}
                error={registerErrors.name}
              />
              <Input
                label="Work email"
                name="email"
                type="email"
                placeholder="alex@company.com"
                value={registerValues.email}
                onChange={handleRegisterChange}
                error={registerErrors.email}
              />
              <Input
                label="Company name"
                name="company"
                placeholder="Fintech Labs"
                value={registerValues.company}
                onChange={handleRegisterChange}
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={registerValues.password}
                onChange={handleRegisterChange}
                error={registerErrors.password}
              />
              <Button type="submit" className="w-100 mt-2" variant="success" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
              <p className="small text-app-secondary mb-0">
                By creating an account, you agree to our Terms and Privacy Policy.
              </p>
            </form>
          )}
        </div>
      </div>

      {DEMO_AUTH_ENABLED ? (
        <div className="auth-tip rounded-3 p-3 small mt-3">
          <p className="text-app-secondary text-center mb-2 fw-semibold">🚀 Demo Credentials</p>
          <div className="d-flex flex-column gap-1">
            <div className="d-flex align-items-center justify-content-between px-2 py-1 rounded-2" style={{ background: 'rgba(var(--brand-primary-rgb, 99,102,241),0.08)' }}>
              <span className="text-app-secondary">Admin Dashboard</span>
              <code className="small fw-semibold text-success">admin@demo.com</code>
            </div>
            <div className="d-flex align-items-center justify-content-between px-2 py-1 rounded-2" style={{ background: 'rgba(var(--brand-primary-rgb, 99,102,241),0.05)' }}>
              <span className="text-app-secondary">User Dashboard</span>
              <code className="small fw-semibold" style={{ color: 'var(--brand-primary)' }}>user@demo.com</code>
            </div>
          </div>
          <p className="text-app-muted text-center mt-2 mb-0" style={{ fontSize: '0.72rem' }}>Any password works in demo mode</p>
        </div>
      ) : (
        <div className="auth-tip rounded-3 p-3 small text-app-secondary text-center mt-3">
          Use registered account credentials to sign in. Admin access depends on assigned role.
        </div>
      )}
    </AuthLayout>
  )
}

export default AuthPage

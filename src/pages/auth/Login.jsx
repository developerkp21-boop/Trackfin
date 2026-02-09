import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Card from '../../components/Card'
import { useAuth } from '../../context/AuthContext'

const Login = () => {
  const { login, loading } = useAuth()
  const location = useLocation()
  const [formValues, setFormValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    setFormValues((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!formValues.email) nextErrors.email = 'Email is required'
    if (!formValues.password) nextErrors.password = 'Password is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    await login(formValues.email, formValues.password)
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Access your ledger workspace securely."
      footer={
        <p>
          New to TrackFin?{' '}
          <Link className="font-semibold text-brand-600 hover:text-brand-700" to="/register">
            Create an account
          </Link>
        </p>
      }
    >
      <Card className="space-y-6">
        {location.state?.from && (
          <div className="rounded-xl border border-border-subtle bg-bg-secondary px-4 py-3 text-xs text-text-secondary">
            Please sign in to continue.
          </div>
        )}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@company.com"
            value={formValues.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formValues.password}
            onChange={handleChange}
            error={errors.password}
          />
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-text-secondary">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border-subtle bg-bg-card text-brand-600 focus:ring-2 focus:ring-brand-100/60"
              />
              Remember me
            </label>
            <Link className="font-semibold text-brand-600 hover:text-brand-700" to="/forgot-password">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <div className="rounded-xl border border-dashed border-border-subtle bg-bg-secondary px-4 py-3 text-xs text-text-muted dark:border-border-strong">
          Demo access: use any email. Add "admin" in the email to preview admin dashboards in development.
        </div>
      </Card>
    </AuthLayout>
  )
}

export default Login

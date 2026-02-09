import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Card from '../../components/Card'
import { useAuth } from '../../context/AuthContext'

const Register = () => {
  const { register, loading } = useAuth()
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    company: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    setFormValues((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!formValues.name) nextErrors.name = 'Name is required'
    if (!formValues.email) nextErrors.email = 'Email is required'
    if (!formValues.password) nextErrors.password = 'Password is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    await register(formValues)
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Launch your accounting workspace in minutes."
      footer={
        <p>
          Already have an account?{' '}
          <Link className="font-semibold text-brand-600 hover:text-brand-700" to="/login">
            Sign in
          </Link>
        </p>
      }
    >
      <Card className="space-y-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Full name"
            name="name"
            placeholder="Alex Carter"
            value={formValues.name}
            onChange={handleChange}
            error={errors.name}
          />
          <Input
            label="Work email"
            name="email"
            type="email"
            placeholder="alex@company.com"
            value={formValues.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            label="Company name"
            name="company"
            placeholder="Fintech Labs"
            value={formValues.company}
            onChange={handleChange}
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
        <p className="text-xs text-text-secondary">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </Card>
    </AuthLayout>
  )
}

export default Register

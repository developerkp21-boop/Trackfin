import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Card from '../../components/Card'
import toast from 'react-hot-toast'

const ResetPassword = () => {
  const [formValues, setFormValues] = useState({ password: '', confirm: '' })
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setFormValues((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!formValues.password || !formValues.confirm) {
      setError('Please fill out both fields.')
      return
    }
    if (formValues.password !== formValues.confirm) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    toast.success('Password updated successfully.')
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a strong password to secure your account."
      footer={
        <p>
          <Link className="font-semibold text-brand-600 hover:text-brand-700" to="/login">
            Back to sign in
          </Link>
        </p>
      }
    >
      <Card className="space-y-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="New password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formValues.password}
            onChange={handleChange}
          />
          <Input
            label="Confirm password"
            name="confirm"
            type="password"
            placeholder="••••••••"
            value={formValues.confirm}
            onChange={handleChange}
            error={error}
          />
          <Button type="submit" className="w-full">
            Update password
          </Button>
        </form>
      </Card>
    </AuthLayout>
  )
}

export default ResetPassword

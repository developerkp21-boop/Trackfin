import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Card from '../../components/Card'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email) return
    toast.success('Password reset link sent. Check your inbox.')
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We will send you a secure reset link."
      footer={
        <p className="mb-0">
          Remembered your password?{' '}
          <Link className="fw-semibold text-success text-decoration-none" to="/auth?tab=signin">
            Back to sign in
          </Link>
        </p>
      }
    >
      <Card>
        <form className="d-flex flex-column gap-2" onSubmit={handleSubmit}>
          <Input
            label="Email address"
            name="email"
            type="email"
            placeholder="finance@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit" className="w-100 mt-2">
            Send reset link
          </Button>
        </form>
        <div className="small text-app-secondary mt-3">For demo purposes, use any email to simulate a reset flow.</div>
      </Card>
    </AuthLayout>
  )
}

export default ForgotPassword

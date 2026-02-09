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
        <p>
          Remembered your password?{' '}
          <Link className="font-semibold text-brand-600 hover:text-brand-700" to="/login">
            Back to sign in
          </Link>
        </p>
      }
    >
      <Card className="space-y-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Email address"
            name="email"
            type="email"
            placeholder="finance@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
        <div className="text-xs text-text-secondary">
          For demo purposes, use any email to simulate a reset flow.
        </div>
      </Card>
    </AuthLayout>
  )
}

export default ForgotPassword

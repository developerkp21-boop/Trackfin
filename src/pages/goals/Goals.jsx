import { useState, useMemo } from 'react'
import { Plus, Trophy, Target, Plus as PlusIcon, Pencil } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import Input from '../../components/Input'
import { goalsData } from '../../data/mockData'

const initialForm = { name: '', targetAmount: '', savedAmount: '', deadline: '', description: '' }

const Goals = () => {
  const [goals, setGoals] = useState(goalsData)
  const [form, setForm] = useState(initialForm)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [addSavings, setAddSavings] = useState({})

  const totalSaved = useMemo(() => goals.reduce((s, g) => s + g.savedAmount, 0), [goals])
  const totalTarget = useMemo(() => goals.reduce((s, g) => s + g.targetAmount, 0), [goals])

  const getDaysLeft = (deadline) => {
    const today = new Date('2026-02-20')
    const due = new Date(deadline)
    return Math.max(0, Math.ceil((due - today) / (1000 * 60 * 60 * 24)))
  }

  const getStatus = (goal) => {
    const pct = goal.targetAmount ? Math.round((goal.savedAmount / goal.targetAmount) * 100) : 0
    const days = getDaysLeft(goal.deadline)
    if (pct >= 100) return { label: 'Completed', variant: 'success' }
    if (days <= 30 && pct < 80) return { label: 'At Risk', variant: 'danger' }
    if (days <= 60) return { label: 'Urgent', variant: 'warning' }
    return { label: 'On Track', variant: 'info' }
  }

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.targetAmount) return
    const entry = {
      id: editingId || `GOAL-${goals.length + 10}`,
      name: form.name,
      targetAmount: Number(form.targetAmount),
      savedAmount: editingId ? (goals.find((g) => g.id === editingId)?.savedAmount || 0) : Number(form.savedAmount || 0),
      deadline: form.deadline,
      description: form.description,
      color: '#60a5fa',
      icon: 'Target'
    }
    if (editingId) {
      setGoals((prev) => prev.map((g) => g.id === editingId ? entry : g))
    } else {
      setGoals((prev) => [...prev, entry])
    }
    setForm(initialForm)
    setEditingId(null)
    setShowForm(false)
  }

  const handleAddSavings = (goalId) => {
    const amount = Number(addSavings[goalId] || 0)
    if (!amount) return
    setGoals((prev) => prev.map((g) =>
      g.id === goalId ? { ...g, savedAmount: Math.min(g.targetAmount, g.savedAmount + amount) } : g
    ))
    setAddSavings((prev) => ({ ...prev, [goalId]: '' }))
  }

  return (
    <div className="d-flex flex-column gap-4">
      <PageHeader
        title="Financial Goals"
        subtitle="Set savings goals, track progress, and stay on schedule."
        actions={
          <Button onClick={() => { setShowForm(true); setEditingId(null); setForm(initialForm) }}>
            <Plus size={16} /> New Goal
          </Button>
        }
      />

      {/* Summary */}
      <div className="row g-3">
        <div className="col-6 col-md-3">
          <Card className="h-100 text-center">
            <p className="x-small text-app-muted text-uppercase fw-semibold mb-1">Goals</p>
            <h3 className="h4 fw-bold text-app-primary mb-0">{goals.length}</h3>
          </Card>
        </div>
        <div className="col-6 col-md-3">
          <Card className="h-100 text-center">
            <p className="x-small text-app-muted text-uppercase fw-semibold mb-1">Completed</p>
            <h3 className="h4 fw-bold text-success mb-0">{goals.filter((g) => g.savedAmount >= g.targetAmount).length}</h3>
          </Card>
        </div>
        <div className="col-6 col-md-3">
          <Card className="h-100 text-center">
            <p className="x-small text-app-muted text-uppercase fw-semibold mb-1">Total Saved</p>
            <h3 className="h5 fw-bold text-app-primary mb-0">${totalSaved.toLocaleString()}</h3>
          </Card>
        </div>
        <div className="col-6 col-md-3">
          <Card className="h-100 text-center">
            <p className="x-small text-app-muted text-uppercase fw-semibold mb-1">Target</p>
            <h3 className="h5 fw-bold text-app-primary mb-0">${totalTarget.toLocaleString()}</h3>
          </Card>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <h3 className="h5 text-app-primary mb-3">{editingId ? 'Edit Goal' : 'Create New Goal'}</h3>
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <Input label="Goal Name" name="name" placeholder="e.g. Emergency Fund" value={form.name} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <Input label="Target Amount ($)" name="targetAmount" type="number" placeholder="50000" value={form.targetAmount} onChange={handleChange} />
            </div>
            {!editingId && (
              <div className="col-md-3">
                <Input label="Already Saved ($)" name="savedAmount" type="number" placeholder="0" value={form.savedAmount} onChange={handleChange} />
              </div>
            )}
            <div className="col-md-4">
              <Input label="Deadline" name="deadline" type="date" value={form.deadline} onChange={handleChange} />
            </div>
            <div className="col-md-8">
              <Input label="Description" name="description" placeholder="Brief goal description" value={form.description} onChange={handleChange} />
            </div>
            <div className="col-12 d-flex justify-content-end gap-2">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setForm(initialForm); setEditingId(null) }}>Cancel</Button>
              <Button type="submit">{editingId ? 'Update Goal' : 'Create Goal'}</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Goals Grid */}
      <div className="row g-3 g-lg-4">
        {goals.map((goal) => {
          const pct = goal.targetAmount ? Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100)) : 0
          const days = getDaysLeft(goal.deadline)
          const status = getStatus(goal)
          const remaining = goal.targetAmount - goal.savedAmount

          return (
            <div key={goal.id} className="col-md-6 col-xl-6">
              <Card className="h-100">
                <div className="d-flex align-items-start justify-content-between mb-3 gap-2">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 44, height: 44, background: goal.color + '22' }}>
                      <Trophy size={20} style={{ color: goal.color }} />
                    </div>
                    <div>
                      <p className="fw-semibold text-app-primary mb-0">{goal.name}</p>
                      {goal.description && <p className="x-small text-app-muted mb-0">{goal.description}</p>}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 flex-shrink-0">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <Button variant="ghost" className="p-1 text-muted" onClick={() => {
                      setEditingId(goal.id)
                      setForm({ name: goal.name, targetAmount: goal.targetAmount, savedAmount: goal.savedAmount, deadline: goal.deadline, description: goal.description || '' })
                      setShowForm(true)
                    }}>
                      <Pencil size={14} />
                    </Button>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="text-app-secondary">${goal.savedAmount.toLocaleString()} saved</span>
                    <span className="fw-semibold text-app-primary">{pct}%</span>
                  </div>
                  <div className="progress" style={{ height: 10 }}>
                    <div
                      className="progress-bar"
                      style={{ width: `${pct}%`, background: pct >= 100 ? '#80c570' : goal.color, borderRadius: 6 }}
                    />
                  </div>
                  <div className="d-flex justify-content-between small mt-1">
                    <span className="text-app-muted">Remaining: ${remaining > 0 ? remaining.toLocaleString() : 0}</span>
                    <span className="text-app-muted">Target: ${goal.targetAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Deadline Countdown */}
                <div className="d-flex align-items-center gap-2 mb-3 p-2 rounded-3 bg-body-tertiary">
                  <Target size={14} className="text-app-muted" />
                  <p className="small text-app-secondary mb-0">
                    Deadline: <span className="fw-medium text-app-primary">{goal.deadline}</span>
                    <span className={`ms-2 fw-semibold ${days <= 30 ? 'text-danger' : days <= 60 ? 'text-warning' : 'text-success'}`}>
                      ({days} days left)
                    </span>
                  </p>
                </div>

                {/* Add Savings */}
                {pct < 100 && (
                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      className="form-control form-control-sm rounded-3"
                      placeholder="Add savings..."
                      value={addSavings[goal.id] || ''}
                      onChange={(e) => setAddSavings((prev) => ({ ...prev, [goal.id]: e.target.value }))}
                    />
                    <Button variant="success" className="btn-sm flex-shrink-0 d-flex align-items-center gap-1" onClick={() => handleAddSavings(goal.id)}>
                      <PlusIcon size={14} /> Add
                    </Button>
                  </div>
                )}

                {pct >= 100 && (
                  <div className="text-center rounded-3 p-2 bg-success-subtle">
                    <p className="small fw-semibold text-success mb-0">🎉 Goal Achieved!</p>
                  </div>
                )}
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Goals

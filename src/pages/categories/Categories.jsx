import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, Tag, TrendingUp, TrendingDown } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import Input from '../../components/Input'
import Select from '../../components/Select'
import { categoriesData } from '../../data/mockData'

const initialForm = { name: '', type: 'expense', color: '#e77a8c', budget: '' }

const Categories = () => {
  const [categories, setCategories] = useState(categoriesData)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const filtered = useMemo(() =>
    filter === 'all' ? categories : categories.filter((c) => c.type === filter),
    [categories, filter]
  )

  const incomeCount = categories.filter((c) => c.type === 'income').length
  const expenseCount = categories.filter((c) => c.type === 'expense').length

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name) return

    if (editingId) {
      setCategories((prev) => prev.map((c) => c.id === editingId ? { ...c, ...form, budget: Number(form.budget) } : c))
    } else {
      setCategories((prev) => [...prev, {
        id: `CAT-${prev.length + 10}`,
        ...form,
        budget: Number(form.budget),
        icon: form.type === 'income' ? 'TrendingUp' : 'Tag'
      }])
    }

    setForm(initialForm)
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (cat) => {
    setForm({ name: cat.name, type: cat.type, color: cat.color, budget: cat.budget || '' })
    setEditingId(cat.id)
    setShowForm(true)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <>
      <div className="d-flex flex-column gap-4">
        <PageHeader
          title="Categories"
          subtitle="Manage income and expense categories for your transactions."
          actions={
            <Button onClick={() => { setShowForm(true); setEditingId(null); setForm(initialForm) }}>
              <Plus size={16} /> Add Category
            </Button>
          }
        />

        {/* Stats */}
        <div className="row g-3">
          <div className="col-6 col-md-3">
            <Card className="h-100 text-center">
              <p className="x-small text-app-muted text-uppercase fw-semibold mb-1">Total</p>
              <h3 className="h4 fw-bold text-app-primary mb-0">{categories.length}</h3>
            </Card>
          </div>
          <div className="col-6 col-md-3">
            <Card className="h-100 text-center">
              <p className="x-small text-app-muted text-uppercase fw-semibold mb-1">Income</p>
              <h3 className="h4 fw-bold text-success mb-0">{incomeCount}</h3>
            </Card>
          </div>
          <div className="col-6 col-md-3">
            <Card className="h-100 text-center">
              <p className="x-small text-app-muted text-uppercase fw-semibold mb-1">Expense</p>
              <h3 className="h4 fw-bold text-danger mb-0">{expenseCount}</h3>
            </Card>
          </div>
          <div className="col-6 col-md-3">
            <Card className="h-100 text-center">
              <p className="x-small text-app-muted text-uppercase fw-semibold mb-1">With Budget</p>
              <h3 className="h4 fw-bold text-app-primary mb-0">{categories.filter((c) => c.budget).length}</h3>
            </Card>
          </div>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <Card>
            <h3 className="h5 text-app-primary mb-3">{editingId ? 'Edit Category' : 'Add Category'}</h3>
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-4">
                <Input label="Category Name" name="name" placeholder="e.g. Marketing" value={form.name} onChange={handleChange} />
              </div>
              <div className="col-md-3">
                <Select label="Type" name="type" value={form.type} onChange={handleChange}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </Select>
              </div>
              <div className="col-md-2">
                <label className="form-label small text-app-secondary mb-1">Color</label>
                <input type="color" className="form-control form-control-color w-100" name="color" value={form.color} onChange={handleChange} style={{ height: '2.6rem' }} />
              </div>
              <div className="col-md-3">
                <Input label="Monthly Budget ($)" name="budget" type="number" placeholder="0" value={form.budget} onChange={handleChange} />
              </div>
              <div className="col-12 d-flex gap-2 justify-content-end">
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); setForm(initialForm) }}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? 'Update' : 'Add Category'}</Button>
              </div>
            </form>
          </Card>
        )}

        {/* Filter */}
        <div className="d-flex gap-2 flex-wrap">
          {['all', 'income', 'expense'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`btn btn-sm rounded-pill px-3 ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Category Grid */}
        <div className="row g-3">
          {filtered.map((cat) => (
            <div key={cat.id} className="col-sm-6 col-xl-4">
              <Card className="h-100">
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 44, height: 44, background: cat.color + '22' }}>
                    <Tag size={18} style={{ color: cat.color }} />
                  </div>
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                      <p className="fw-semibold text-app-primary mb-0 text-truncate">{cat.name}</p>
                      <Badge variant={cat.type === 'income' ? 'success' : 'danger'} className="flex-shrink-0">
                        {cat.type === 'income' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {' '}{cat.type}
                      </Badge>
                    </div>
                    {cat.budget ? (
                      <p className="small text-app-muted mb-2">Budget: <span className="fw-medium text-app-secondary">${cat.budget.toLocaleString()}/mo</span></p>
                    ) : (
                      <p className="small text-app-muted mb-2">No budget set</p>
                    )}
                    <div className="d-flex gap-2 mt-2">
                      <Button variant="ghost" className="p-1 text-muted" onClick={() => handleEdit(cat)}>
                        <Pencil size={14} />
                      </Button>
                      <Button variant="ghost" className="p-1 text-danger" onClick={() => setDeleteTarget(cat)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {deleteTarget && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ background: 'rgba(15,23,42,0.45)', zIndex: 1050 }}>
          <Card className="w-100" style={{ maxWidth: '24rem' }}>
            <h5 className="mb-2 text-app-primary">Delete Category</h5>
            <p className="text-app-secondary mb-4 small">
              Delete <strong>{deleteTarget.name}</strong>? This won't remove existing transactions.
            </p>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button variant="danger" onClick={confirmDelete}>Delete</Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

export default Categories

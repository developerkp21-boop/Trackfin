import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown, Scale } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import Input from '../../components/Input'
import Select from '../../components/Select'
import { assetsData, liabilitiesData, netWorthHistory } from '../../data/mockData'

const NetWorth = () => {
  const [assets, setAssets] = useState(assetsData)
  const [liabilities, setLiabilities] = useState(liabilitiesData)
  const [activeTab, setActiveTab] = useState('assets')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'liquid', value: '' })
  const [editingId, setEditingId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const totalAssets = useMemo(() => assets.reduce((s, a) => s + a.value, 0), [assets])
  const totalLiabilities = useMemo(() => liabilities.reduce((s, l) => s + l.value, 0), [liabilities])
  const netWorth = totalAssets - totalLiabilities

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.value) return
    const entry = { id: editingId || `${activeTab === 'assets' ? 'ASS' : 'LIA'}-${Date.now()}`, name: form.name, category: form.category, value: Number(form.value) }
    if (activeTab === 'assets') {
      setAssets((prev) => editingId ? prev.map((a) => a.id === editingId ? entry : a) : [...prev, entry])
    } else {
      setLiabilities((prev) => editingId ? prev.map((l) => l.id === editingId ? entry : l) : [...prev, entry])
    }
    setForm({ name: '', category: 'liquid', value: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const startEdit = (item) => {
    setForm({ name: item.name, category: item.category, value: item.value })
    setEditingId(item.id)
    setShowForm(true)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    if (activeTab === 'assets') setAssets((prev) => prev.filter((a) => a.id !== deleteTarget.id))
    else setLiabilities((prev) => prev.filter((l) => l.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const currentList = activeTab === 'assets' ? assets : liabilities
  const assetCategories = ['liquid', 'fixed', 'investment']
  const liabilityCategories = ['credit', 'loan', 'other']
  const categories = activeTab === 'assets' ? assetCategories : liabilityCategories

  const categoryColors = { liquid: '#80c570', fixed: '#60a5fa', investment: '#a78bfa', credit: '#e77a8c', loan: '#f97316', other: '#94a3b8' }

  return (
    <>
      <div className="d-flex flex-column gap-4">
        <PageHeader
          title="Net Worth"
          subtitle="Track your assets, liabilities, and total wealth over time."
          actions={
            <Button onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', category: activeTab === 'assets' ? 'liquid' : 'credit', value: '' }) }}>
              <Plus size={16} /> Add {activeTab === 'assets' ? 'Asset' : 'Liability'}
            </Button>
          }
        />

        {/* Summary Cards */}
        <div className="row g-3">
          <div className="col-6 col-md-4">
            <Card className="h-100">
              <div className="d-flex align-items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-success" />
                <p className="small text-app-secondary mb-0">Total Assets</p>
              </div>
              <h3 className="h4 fw-bold text-success mb-0">${totalAssets.toLocaleString()}</h3>
            </Card>
          </div>
          <div className="col-6 col-md-4">
            <Card className="h-100">
              <div className="d-flex align-items-center gap-2 mb-2">
                <TrendingDown size={16} className="text-danger" />
                <p className="small text-app-secondary mb-0">Total Liabilities</p>
              </div>
              <h3 className="h4 fw-bold text-danger mb-0">${totalLiabilities.toLocaleString()}</h3>
            </Card>
          </div>
          <div className="col-12 col-md-4">
            <Card className="h-100 border-2" style={{ borderColor: netWorth > 0 ? '#80c570' : '#e77a8c' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Scale size={16} className={netWorth > 0 ? 'text-success' : 'text-danger'} />
                <p className="small text-app-secondary mb-0">Net Worth</p>
              </div>
              <h3 className={`h4 fw-bold mb-0 ${netWorth > 0 ? 'text-success' : 'text-danger'}`}>
                {netWorth < 0 ? '-' : '+'}${Math.abs(netWorth).toLocaleString()}
              </h3>
              <p className="x-small text-app-muted mt-1 mb-0">Assets − Liabilities</p>
            </Card>
          </div>
        </div>

        {/* Net Worth Growth Chart */}
        <Card>
          <p className="fw-semibold text-app-primary mb-1">Net Worth Growth</p>
          <p className="small text-app-secondary mb-3">Historical net worth trend over 7 months</p>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={netWorthHistory} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#80c570" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#80c570" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, 'Net Worth']} />
                <Area type="monotone" dataKey="netWorth" stroke="#80c570" strokeWidth={2.5} fill="url(#nwGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Tabs */}
        <Card>
          <div className="d-flex gap-2 mb-4 flex-wrap">
            {['assets', 'liabilities'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => { setActiveTab(tab); setShowForm(false); setEditingId(null) }}
                className={`btn btn-sm rounded-pill px-4 ${activeTab === tab ? (tab === 'assets' ? 'btn-success' : 'btn-danger') : 'btn-outline-secondary'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Add / Edit Form */}
          {showForm && (
            <div className="mb-4 p-3 rounded-4 border border-app-subtle">
              <h6 className="text-app-primary mb-3">{editingId ? `Edit ${activeTab === 'assets' ? 'Asset' : 'Liability'}` : `Add ${activeTab === 'assets' ? 'Asset' : 'Liability'}`}</h6>
              <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-5">
                  <Input label="Name" name="name" placeholder="e.g. Main Bank Account" value={form.name} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <Select label="Category" name="category" value={form.category} onChange={handleChange}>
                    {categories.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </Select>
                </div>
                <div className="col-md-3">
                  <Input label="Value ($)" name="value" type="number" placeholder="0" value={form.value} onChange={handleChange} />
                </div>
                <div className="col-12 d-flex gap-2 justify-content-end">
                  <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null) }}>Cancel</Button>
                  <Button type="submit">{editingId ? 'Update' : 'Add'}</Button>
                </div>
              </form>
            </div>
          )}

          {/* List */}
          <div className="d-flex flex-column gap-2">
            {currentList.map((item) => (
              <div key={item.id} className="d-flex align-items-center gap-3 rounded-3 p-2 p-sm-3 bg-body-tertiary">
                <div className="rounded-3 flex-shrink-0" style={{ width: 10, height: 32, background: categoryColors[item.category] || '#94a3b8', borderRadius: 4 }} />
                <div className="flex-grow-1 min-w-0">
                  <p className="fw-medium text-app-primary mb-0 text-truncate">{item.name}</p>
                  <p className="x-small text-app-muted mb-0">{item.category}</p>
                </div>
                <span className={`fw-semibold small flex-shrink-0 ${activeTab === 'assets' ? 'text-success' : 'text-danger'}`}>
                  ${item.value.toLocaleString()}
                </span>
                <div className="d-flex gap-1 flex-shrink-0">
                  <Button variant="ghost" className="p-1 text-muted" onClick={() => startEdit(item)}><Pencil size={14} /></Button>
                  <Button variant="ghost" className="p-1 text-danger" onClick={() => setDeleteTarget(item)}><Trash2 size={14} /></Button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
            <p className="fw-semibold text-app-primary mb-0">Total {activeTab === 'assets' ? 'Assets' : 'Liabilities'}</p>
            <p className={`fw-bold mb-0 ${activeTab === 'assets' ? 'text-success' : 'text-danger'}`}>
              ${(activeTab === 'assets' ? totalAssets : totalLiabilities).toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      {deleteTarget && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ background: 'rgba(15,23,42,0.45)', zIndex: 1050 }}>
          <Card className="w-100" style={{ maxWidth: '24rem' }}>
            <h5 className="mb-2 text-app-primary">Delete Entry</h5>
            <p className="text-app-secondary mb-4 small">Remove <strong>{deleteTarget.name}</strong> from your {activeTab}?</p>
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

export default NetWorth

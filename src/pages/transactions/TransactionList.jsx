import { useMemo, useState } from 'react'
import { Search, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Input from '../../components/Input'
import Select from '../../components/Select'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import { transactionsData } from '../../data/mockData'

const initialForm = {
  date: '',
  amount: '',
  category: 'Sales',
  paymentMethod: 'Bank',
  account: 'Main Bank',
  description: ''
}

const TransactionList = () => {
  const [type, setType] = useState('credit')
  const [transactions, setTransactions] = useState(
    transactionsData.map((item) => ({
      ...item,
      paymentMethod: item.paymentMethod || 'Bank',
      account: item.account || 'Main Bank'
    }))
  )
  const [formValues, setFormValues] = useState(initialForm)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [accountFilter, setAccountFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date_desc')
  const [editingId, setEditingId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(() => {
    const list = transactions.filter((item) => {
      const query = search.toLowerCase()
      const bySearch =
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      const byType = typeFilter === 'all' ? true : item.type === typeFilter
      const byAccount = accountFilter === 'all' ? true : item.account === accountFilter
      return bySearch && byType && byAccount
    })

    return list.sort((a, b) => {
      if (sortBy === 'amount_desc') return b.amount - a.amount
      if (sortBy === 'amount_asc') return a.amount - b.amount
      if (sortBy === 'date_asc') return a.date.localeCompare(b.date)
      return b.date.localeCompare(a.date)
    })
  }, [transactions, search, typeFilter, accountFilter, sortBy])

  const accounts = [...new Set(transactions.map((item) => item.account))]

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormValues(initialForm)
    setEditingId(null)
    setType('credit')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!formValues.date || !formValues.amount || !formValues.description) return

    if (editingId) {
      setTransactions((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...formValues,
                amount: Number(formValues.amount),
                type
              }
            : item
        )
      )
      resetForm()
      return
    }

    const nextId = `TXN-${Math.floor(2000 + Math.random() * 7000)}`
    setTransactions((prev) => [
      {
        id: nextId,
        ...formValues,
        amount: Number(formValues.amount),
        type
      },
      ...prev
    ])

    resetForm()
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setType(item.type)
    setFormValues({
      date: item.date,
      amount: item.amount,
      category: item.category,
      paymentMethod: item.paymentMethod,
      account: item.account,
      description: item.description
    })
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    setTransactions((prev) => prev.filter((item) => item.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <>
      <div className="d-flex flex-column gap-4">
        <PageHeader
          title="Transaction Management"
          subtitle="Ledger-style transaction capture, filtering, sorting, and controls."
        />

        <Card>
          <h3 className="h5 text-app-primary mb-3">{editingId ? 'Edit Transaction' : 'Add Transaction'}</h3>

          <div className="d-flex flex-column flex-sm-row gap-2 mb-3">
            <button
              type="button"
              onClick={() => setType('credit')}
              className={`btn w-100 ${type === 'credit' ? 'btn-success text-white' : 'btn-outline-secondary'}`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setType('debit')}
              className={`btn w-100 ${type === 'debit' ? 'btn-danger text-white' : 'btn-outline-secondary'}`}
            >
              Expense
            </button>
          </div>

          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-3">
              <Input label="Date" name="date" type="date" value={formValues.date} onChange={handleFormChange} />
            </div>
            <div className="col-md-3">
              <Input label="Amount" name="amount" type="number" value={formValues.amount} onChange={handleFormChange} />
            </div>
            <div className="col-md-3">
              <Select label="Category" name="category" value={formValues.category} onChange={handleFormChange}>
                {['Sales', 'Operations', 'Payroll', 'Marketing', 'Compliance', 'Facilities', 'Services'].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </div>
            <div className="col-md-3">
              <Select label="Payment Method" name="paymentMethod" value={formValues.paymentMethod} onChange={handleFormChange}>
                {['Cash', 'Bank', 'Card', 'UPI'].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </div>
            <div className="col-md-4">
              <Input label="Account" name="account" value={formValues.account} onChange={handleFormChange} />
            </div>
            <div className="col-md-8">
              <Input label="Description" name="description" value={formValues.description} onChange={handleFormChange} />
            </div>
            <div className="col-12 d-flex flex-column flex-sm-row justify-content-sm-end gap-2">
              {editingId && (
                <Button type="button" variant="outline" className="w-100 w-sm-auto" onClick={resetForm}>
                  Cancel Edit
                </Button>
              )}
              <Button type="submit" className="w-100 w-sm-auto">
                {editingId ? 'Update Transaction' : 'Add Transaction'}
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <div className="row g-3 align-items-end mb-3">
            <div className="col-12 col-md-4">
              <label className="form-label small text-app-secondary mb-1">Search</label>
              <div className="position-relative">
                <Search className="position-absolute top-50 start-0 ms-3 text-muted" size={16} style={{ transform: 'translateY(-50%)' }} />
                <input
                  className="form-control rounded-3 ps-5"
                  placeholder="Search by description/category"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>
            <div className="col-6 col-md-2">
              <Select label="Type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
                <option value="all">All</option>
                <option value="credit">Income</option>
                <option value="debit">Expense</option>
              </Select>
            </div>
            <div className="col-6 col-md-3">
              <Select label="Account" value={accountFilter} onChange={(event) => setAccountFilter(event.target.value)}>
                <option value="all">All Accounts</option>
                {accounts.map((account) => (
                  <option key={account} value={account}>
                    {account}
                  </option>
                ))}
              </Select>
            </div>
            <div className="col-12 col-md-3">
              <Select label="Sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="date_desc">Latest Date</option>
                <option value="date_asc">Oldest Date</option>
                <option value="amount_desc">Highest Amount</option>
                <option value="amount_asc">Lowest Amount</option>
              </Select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th className="small text-app-muted text-uppercase">Date</th>
                  <th className="small text-app-muted text-uppercase">Category</th>
                  <th className="small text-app-muted text-uppercase">Amount</th>
                  <th className="small text-app-muted text-uppercase">Type</th>
                  <th className="small text-app-muted text-uppercase">Account</th>
                  <th className="small text-app-muted text-uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <p className="mb-0">{item.date}</p>
                      <p className="small text-app-muted mb-0">{item.id}</p>
                    </td>
                    <td>{item.category}</td>
                    <td className={item.type === 'credit' ? 'text-success fw-semibold' : 'text-danger fw-semibold'}>
                      {item.type === 'credit' ? '+' : '-'}${item.amount.toLocaleString()}
                    </td>
                    <td>
                      <Badge variant={item.type === 'credit' ? 'success' : 'danger'}>
                        {item.type === 'credit' ? 'Income' : 'Expense'}
                      </Badge>
                    </td>
                    <td>{item.account}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button variant="ghost" className="p-2 text-muted" onClick={() => handleEdit(item)}>
                          <Pencil size={16} />
                        </Button>
                        <Button variant="ghost" className="p-2 text-danger" onClick={() => setDeleteTarget(item)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {deleteTarget && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ background: 'rgba(15, 23, 42, 0.45)', zIndex: 1050 }}>
          <Card className="w-100" style={{ maxWidth: '26rem' }}>
            <h5 className="mb-2 text-app-primary">Delete Transaction</h5>
            <p className="text-app-secondary mb-4 small">
              Are you sure you want to delete transaction <strong>{deleteTarget.id}</strong>?
            </p>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

export default TransactionList

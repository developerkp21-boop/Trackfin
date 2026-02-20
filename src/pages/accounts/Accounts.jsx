import { useMemo, useState } from 'react'
import { Pencil, Trash2, Plus, ArrowLeftRight, CreditCard, Banknote, Wallet, PiggyBank } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Input from '../../components/Input'
import Select from '../../components/Select'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import { accountsData } from '../../data/mockData'

const accountTypes = ['Cash', 'Bank', 'Card', 'Savings']

const accountIcons = {
  Bank: Banknote,
  Cash: Wallet,
  Card: CreditCard,
  Savings: PiggyBank
}

const accountColors = {
  Bank: '#60a5fa',
  Cash: '#80c570',
  Card: '#e77a8c',
  Savings: '#e8b25e'
}

const initialForm = { name: '', type: 'Bank', balance: '' }

const Accounts = () => {
  const [accounts, setAccounts] = useState(accountsData)
  const [newAccount, setNewAccount] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [transfer, setTransfer] = useState({ from: '', to: '', amount: '' })
  const [showTransfer, setShowTransfer] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const totalBalance = useMemo(
    () => accounts.reduce((sum, a) => sum + Number(a.balance || 0), 0),
    [accounts]
  )

  const handleAddAccount = (e) => {
    e.preventDefault()
    if (!newAccount.name || !newAccount.balance) return
    if (editingId) {
      setAccounts((prev) => prev.map((a) => a.id === editingId ? { ...a, ...newAccount, balance: Number(newAccount.balance) } : a))
      setEditingId(null)
    } else {
      setAccounts((prev) => [...prev, {
        id: `ACC-${Date.now()}`,
        name: newAccount.name,
        type: newAccount.type,
        balance: Number(newAccount.balance),
        color: accountColors[newAccount.type]
      }])
    }
    setNewAccount(initialForm)
  }

  const startEdit = (account) => {
    setNewAccount({ name: account.name, type: account.type, balance: account.balance })
    setEditingId(account.id)
  }

  const handleTransfer = (e) => {
    e.preventDefault()
    const amount = Number(transfer.amount)
    if (!transfer.from || !transfer.to || !amount || transfer.from === transfer.to) return
    setAccounts((prev) => prev.map((a) => {
      if (a.id === transfer.from) return { ...a, balance: a.balance - amount }
      if (a.id === transfer.to) return { ...a, balance: a.balance + amount }
      return a
    }))
    setTransfer({ from: '', to: '', amount: '' })
    setShowTransfer(false)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    setAccounts((prev) => prev.filter((a) => a.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <>
      <div className="d-flex flex-column gap-4">
        <PageHeader
          title="Account Management"
          subtitle="Manage cash, bank, card, and savings ledgers in one place."
          actions={
            <div className="d-flex gap-2">
              <Button variant="outline" onClick={() => setShowTransfer(!showTransfer)}>
                <ArrowLeftRight size={16} /> Transfer
              </Button>
              <Button onClick={() => { setNewAccount(initialForm); setEditingId(null) }}>
                <Plus size={16} /> Add Account
              </Button>
            </div>
          }
        />

        {/* Account Cards */}
        <div className="row g-3 g-lg-4">
          {accounts.map((account) => {
            const Icon = accountIcons[account.type] || Wallet
            const color = account.color || accountColors[account.type] || '#94a3b8'
            return (
              <div key={account.id} className="col-6 col-xl-3">
                <Card className="h-100 position-relative overflow-hidden">
                  <div className="position-absolute top-0 end-0 w-50 h-100 opacity-10 rounded-3" style={{ background: color }} />
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, background: color + '22' }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div className="d-flex gap-1">
                      <Button variant="ghost" className="p-1 text-muted" onClick={() => startEdit(account)}><Pencil size={13} /></Button>
                      <Button variant="ghost" className="p-1 text-danger" onClick={() => setDeleteTarget(account)}><Trash2 size={13} /></Button>
                    </div>
                  </div>
                  <Badge variant="secondary" className="mb-2">{account.type}</Badge>
                  <p className="fw-medium text-app-primary mb-1 small text-truncate">{account.name}</p>
                  <h3 className="h5 fw-bold mb-0" style={{ color }}>${account.balance.toLocaleString()}</h3>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Total Balance */}
        <Card>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <p className="small text-app-secondary mb-0">Total Balance Across All Accounts</p>
              <h3 className="h4 fw-bold text-app-primary mb-0">${totalBalance.toLocaleString()}</h3>
            </div>
            <div className="rounded-3 bg-success-subtle p-3">
              <Wallet size={24} className="text-success" />
            </div>
          </div>
        </Card>

        <div className="row g-3 g-lg-4">
          {/* Add / Edit Form */}
          <div className="col-lg-6">
            <Card className="h-100">
              <h3 className="h5 text-app-primary mb-3">{editingId ? 'Edit Account' : 'Add Account'}</h3>
              <form className="d-flex flex-column gap-2" onSubmit={handleAddAccount}>
                <Input
                  label="Account Name"
                  placeholder="e.g. Primary Business Account"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount((prev) => ({ ...prev, name: e.target.value }))}
                />
                <Select
                  label="Account Type"
                  value={newAccount.type}
                  onChange={(e) => setNewAccount((prev) => ({ ...prev, type: e.target.value }))}
                >
                  {accountTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </Select>
                <Input
                  label="Balance ($)"
                  type="number"
                  placeholder="0"
                  value={newAccount.balance}
                  onChange={(e) => setNewAccount((prev) => ({ ...prev, balance: e.target.value }))}
                />
                <div className="d-flex gap-2 mt-1">
                  {editingId && (
                    <Button type="button" variant="outline" onClick={() => { setNewAccount(initialForm); setEditingId(null) }}>
                      Cancel
                    </Button>
                  )}
                  <Button type="submit" className="flex-grow-1">
                    {editingId ? 'Save Changes' : 'Add Account'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Transfer */}
          <div className="col-lg-6">
            <Card className="h-100">
              <div className="d-flex align-items-center gap-2 mb-3">
                <ArrowLeftRight size={18} className="text-app-secondary" />
                <h3 className="h5 text-app-primary mb-0">Transfer Between Accounts</h3>
              </div>
              <form className="d-flex flex-column gap-2" onSubmit={handleTransfer}>
                <Select
                  label="From Account"
                  value={transfer.from}
                  onChange={(e) => setTransfer((prev) => ({ ...prev, from: e.target.value }))}
                >
                  <option value="">Select account</option>
                  {accounts.map((a) => <option key={a.id} value={a.id}>{a.name} (${a.balance.toLocaleString()})</option>)}
                </Select>
                <Select
                  label="To Account"
                  value={transfer.to}
                  onChange={(e) => setTransfer((prev) => ({ ...prev, to: e.target.value }))}
                >
                  <option value="">Select account</option>
                  {accounts.filter((a) => a.id !== transfer.from).map((a) => (
                    <option key={a.id} value={a.id}>{a.name} (${a.balance.toLocaleString()})</option>
                  ))}
                </Select>
                <Input
                  label="Amount ($)"
                  type="number"
                  placeholder="0"
                  value={transfer.amount}
                  onChange={(e) => setTransfer((prev) => ({ ...prev, amount: e.target.value }))}
                />
                <Button type="submit" variant="outline" className="mt-1 w-100">
                  <ArrowLeftRight size={16} /> Execute Transfer
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>

      {deleteTarget && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ background: 'rgba(15,23,42,0.45)', zIndex: 1050 }}>
          <Card className="w-100" style={{ maxWidth: '24rem' }}>
            <h5 className="mb-2 text-app-primary">Delete Account</h5>
            <p className="text-app-secondary mb-4 small">Remove <strong>{deleteTarget.name}</strong>? Transactions will not be deleted.</p>
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

export default Accounts

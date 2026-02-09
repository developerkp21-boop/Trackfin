import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Pencil, Trash2, Filter } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Input from '../../components/Input'
import Select from '../../components/Select'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import Pagination from '../../components/Pagination'
import EmptyState from '../../components/EmptyState'
import { transactionsData } from '../../data/mockData'

const TransactionList = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 5

  const filtered = useMemo(() => {
    return transactionsData.filter((item) => {
      const matchesSearch = item.description.toLowerCase().includes(search.toLowerCase())
      const matchesType = type === 'all' ? true : item.type === type
      const matchesStart = startDate ? item.date >= startDate : true
      const matchesEnd = endDate ? item.date <= endDate : true
      return matchesSearch && matchesType && matchesStart && matchesEnd
    })
  }, [search, type, startDate, endDate])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-8">
      <PageHeader
        title="Transactions"
        subtitle="Search, filter, and manage ledger activity."
        actions={
          <Button variant="secondary">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </Button>
        }
      />

      <Card className="space-y-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-text-muted" />
                <input
                  className="input-field pl-10"
                  placeholder="Search transactions"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(1)
                  }}
                />
              </div>
              <Select value={type} onChange={(event) => setType(event.target.value)}>
                <option value="all">All Types</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </Select>
            </div>
            <div className="text-sm text-ink-500">{filtered.length} results</div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Input
              label="Start date"
              type="date"
              value={startDate}
              onChange={(event) => {
                setStartDate(event.target.value)
                setPage(1)
              }}
            />
            <Input
              label="End date"
              type="date"
              value={endDate}
              onChange={(event) => {
                setEndDate(event.target.value)
                setPage(1)
              }}
            />
          </div>
        </div>

        {paginated.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description="Try adjusting your filters or add a new transaction."
            actionLabel="Add Transaction"
            onAction={() => navigate('/transactions/add')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-text-muted">
                <tr>
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle dark:divide-border-strong">
                {paginated.map((item) => (
                  <tr
                    key={item.id}
                    className="text-text-secondary transition hover:bg-bg-secondary/60 dark:text-text-secondary dark:hover:bg-bg-secondary/40"
                  >
                    <td className="py-4 font-medium text-text-primary">
                      {item.id}
                    </td>
                    <td className="py-4">{item.description}</td>
                    <td className="py-4">{item.category}</td>
                    <td className="py-4">
                      <Badge variant={item.type === 'credit' ? 'success' : 'danger'}>
                        {item.type}
                      </Badge>
                    </td>
                    <td className="py-4">
                      {item.type === 'credit' ? '+' : '-'}${item.amount.toLocaleString()}
                    </td>
                    <td className="py-4">{item.date}</td>
                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="rounded-lg border border-border-subtle p-2 text-text-muted transition hover:border-brand-300 hover:text-brand-600 dark:border-border-strong"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg border border-blush-200 p-2 text-blush-500 transition hover:border-blush-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
    </div>
  )
}

export default TransactionList

import { useState } from 'react'
import { Search } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import { transactionsData } from '../../data/mockData'

const AdminTransactions = () => {
  const [search, setSearch] = useState('')
  const filtered = transactionsData.filter((item) =>
    item.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <PageHeader
        title="All Transactions"
        subtitle="Review every transaction across the platform."
      />

      <Card className="space-y-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-text-muted" />
          <input
            className="input-field pl-10"
            placeholder="Search by description"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-text-muted">
              <tr>
                <th className="pb-3">Transaction</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle dark:divide-border-strong">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="text-text-secondary transition hover:bg-bg-secondary/60 dark:text-text-secondary dark:hover:bg-bg-secondary/40"
                >
                  <td className="py-4">
                    <p className="font-semibold text-text-primary">{item.description}</p>
                    <p className="text-xs text-text-muted">{item.id}</p>
                  </td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default AdminTransactions

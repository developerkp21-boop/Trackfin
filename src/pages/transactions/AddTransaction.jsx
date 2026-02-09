import { useState } from 'react'
import toast from 'react-hot-toast'
import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Input from '../../components/Input'
import Select from '../../components/Select'
import TextArea from '../../components/TextArea'
import Button from '../../components/Button'

const categories = ['Sales', 'Operations', 'Payroll', 'Marketing', 'Compliance', 'Facilities']

const AddTransaction = () => {
  const [type, setType] = useState('credit')
  const [formValues, setFormValues] = useState({
    amount: '',
    category: categories[0],
    date: '',
    description: ''
  })

  const handleChange = (event) => {
    setFormValues((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    toast.success('Transaction saved successfully.')
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Add Transaction"
        subtitle="Log a new credit or debit activity into your ledger."
      />

      <Card className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setType('credit')}
            className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              type === 'credit'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                : 'border-ink-200 text-ink-500 dark:border-ink-700 dark:text-ink-300'
            }`}
          >
            Credit
          </button>
          <button
            type="button"
            onClick={() => setType('debit')}
            className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              type === 'debit'
                ? 'border-blush-500 bg-blush-50 text-blush-600'
                : 'border-ink-200 text-ink-500 dark:border-ink-700 dark:text-ink-300'
            }`}
          >
            Debit
          </button>
        </div>

        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <Input
            label="Amount"
            name="amount"
            type="number"
            placeholder="0.00"
            value={formValues.amount}
            onChange={handleChange}
          />
          <Select label="Category" name="category" value={formValues.category} onChange={handleChange}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <Input
            label="Date"
            name="date"
            type="date"
            value={formValues.date}
            onChange={handleChange}
          />
          <Input label="Reference" name="reference" placeholder="Invoice or memo" />
          <div className="md:col-span-2">
            <TextArea
              label="Description"
              name="description"
              placeholder="Describe the transaction context"
              value={formValues.description}
              onChange={handleChange}
            />
          </div>
          <div className="md:col-span-2 flex items-center justify-end gap-3">
            <Button variant="ghost" type="button">
              Cancel
            </Button>
            <Button type="submit">Save Transaction</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default AddTransaction

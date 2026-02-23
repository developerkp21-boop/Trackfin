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
    <div className="d-flex flex-column gap-4">
      <PageHeader title="Add Transaction" subtitle="Log a new credit or debit activity into your ledger." />

      <Card>
        <div className="d-flex flex-column flex-sm-row gap-2 mb-4">
          <button
            type="button"
            onClick={() => setType('credit')}
            className={`btn rounded-3 py-2 ${
              type === 'credit' ? 'btn-success text-white' : 'btn-outline-secondary'
            } w-100`}
          >
            Credit
          </button>
          <button
            type="button"
            onClick={() => setType('debit')}
            className={`btn rounded-3 py-2 ${
              type === 'debit' ? 'btn-danger text-white' : 'btn-outline-secondary'
            } w-100`}
          >
            Debit
          </button>
        </div>

        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <Input
              label="Amount"
              name="amount"
              type="number"
              placeholder="0.00"
              value={formValues.amount}
              onChange={handleChange}
              wrapperClassName="mb-0"
            />
          </div>
          <div className="col-md-6">
            <Select label="Category" name="category" value={formValues.category} onChange={handleChange} wrapperClassName="mb-0" isSearchable>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>
          <div className="col-md-6">
            <Input label="Date" name="date" type="date" value={formValues.date} onChange={handleChange} wrapperClassName="mb-0" />
          </div>
          <div className="col-md-6">
            <Input label="Reference" name="reference" placeholder="Invoice or memo" wrapperClassName="mb-0" />
          </div>
          <div className="col-12">
            <TextArea
              label="Description"
              name="description"
              placeholder="Describe the transaction context"
              value={formValues.description}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 d-flex flex-column flex-sm-row justify-content-sm-end gap-2">
            <Button variant="ghost" type="button" className="btn-mobile-block">
              Cancel
            </Button>
            <Button type="submit" className="btn-mobile-block">
              Save Transaction
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default AddTransaction

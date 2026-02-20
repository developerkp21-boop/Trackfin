import Card from './Card'

const accentMap = {
  brand: 'bg-success-subtle text-success',
  emerald: 'bg-success-subtle text-success',
  amber: 'bg-warning-subtle text-warning-emphasis',
  red: 'bg-danger-subtle text-danger',
  slate: 'bg-secondary-subtle text-secondary'
}

const StatCard = ({ title, value, change, icon: Icon, accent = 'brand' }) => (
  <Card className="h-100">
    <div className="d-flex align-items-start justify-content-between gap-3">
      <div>
        <p className="small text-app-secondary mb-1">{title}</p>
        <h3 className="h4 fw-semibold text-app-primary mb-0">{value}</h3>
      </div>
      <div className={`d-inline-flex align-items-center justify-content-center rounded-3 p-3 ${accentMap[accent]}`}>
        {Icon && <Icon size={18} />}
      </div>
    </div>
    {change && <p className="small fw-semibold text-success mt-3 mb-0">{change} vs last month</p>}
  </Card>
)

export default StatCard

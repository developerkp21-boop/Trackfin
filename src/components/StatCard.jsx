import Card from './Card'

const accentMap = {
  brand: 'bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
  red: 'bg-blush-100 text-blush-600 dark:bg-blush-500/20 dark:text-blush-300',
  slate: 'bg-ink-100 text-ink-600 dark:bg-ink-700/50 dark:text-ink-200'
}

const StatCard = ({ title, value, change, icon: Icon, accent = 'brand' }) => (
  <Card className="relative flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-ink-500 dark:text-ink-400">{title}</p>
        <h3 className="mt-1 text-2xl font-semibold text-ink-900 dark:text-on-brand">
          {value}
        </h3>
      </div>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentMap[accent]}`}
      >
        {Icon && <Icon className="h-5 w-5" />}
      </div>
    </div>
    {change && (
      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        {change} vs last month
      </p>
    )}
  </Card>
)

export default StatCard

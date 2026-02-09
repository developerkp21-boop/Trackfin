import { Landmark } from 'lucide-react'

const BrandLogo = ({ size = 'md', label = true }) => {
  const sizeClasses =
    size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-sm' : 'text-base'

  return (
    <div className="flex items-center gap-2 text-text-primary">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-on-brand shadow-soft">
        <Landmark className="h-5 w-5" />
      </span>
      {label && (
        <div className="leading-tight">
          <p className={`font-display font-semibold tracking-tight ${sizeClasses}`}>
            TrackFin
          </p>
          <p className="text-xs text-text-muted">Ledger Intelligence</p>
        </div>
      )}
    </div>
  )
}

export default BrandLogo

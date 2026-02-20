import { Landmark } from 'lucide-react'

const BrandLogo = ({ size = 'md', label = true }) => {
  const textSize = size === 'lg' ? 'h5' : size === 'sm' ? 'small' : 'h6'

  return (
    <div className="d-flex align-items-center gap-2 text-app-primary">
      <span className="d-flex align-items-center justify-content-center rounded-3 bg-success text-white shadow-sm fw-bold btn-icon">
        <Landmark size={18} />
      </span>
      {label && (
        <div className="lh-sm">
          <p className={`font-display fw-bold mb-0 ${textSize} letter-space-tight`}>TrackFin</p>
          <p className="text-app-secondary mb-0" style={{ fontSize: '0.72rem' }}>
            Ledger Intelligence
          </p>
        </div>
      )}
    </div>
  )
}

export default BrandLogo

import BrandLogo from '../components/BrandLogo'

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen bg-bg-primary">
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-bg-secondary px-16 py-14 text-text-primary lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-100/60 via-bg-secondary to-bg-secondary" />
        <div className="absolute inset-0 opacity-40 [background:rgb(168,223,142)]" />
        <div className="absolute right-6 top-10 h-44 w-44 rounded-full bg-brand-100/50 blur-3xl" />
        <div className="absolute bottom-10 left-8 h-64 w-64 rounded-full bg-accent-primary/30 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-emerald-200/25 blur-[90px]" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <BrandLogo size="lg" />
            <span className="rounded-full border border-border-subtle bg-bg-card/70 px-3 py-1 text-xs font-semibold text-text-secondary">
              Secure finance ops
            </span>
          </div>
          <p className="mt-10 max-w-md text-4xl font-semibold leading-tight text-text-primary">
            Build confident, automated accounting workflows with TrackFin.
          </p>
          <p className="mt-4 max-w-sm text-sm text-text-secondary">
            Smart ledgers, real-time dashboards, and audit-ready compliance
            reporting in a single workspace.
          </p>
          <div className="mt-8 grid max-w-md grid-cols-3 gap-4 text-xs text-text-secondary">
            <div className="rounded-xl border border-border-subtle bg-bg-card/70 px-4 py-3">
              <p className="text-lg font-semibold text-text-primary">2.4x</p>
              <p className="mt-1">Faster close</p>
            </div>
            <div className="rounded-xl border border-border-subtle bg-bg-card/70 px-4 py-3">
              <p className="text-lg font-semibold text-text-primary">98%</p>
              <p className="mt-1">Audit readiness</p>
            </div>
            <div className="rounded-xl border border-border-subtle bg-bg-card/70 px-4 py-3">
              <p className="text-lg font-semibold text-text-primary">24/7</p>
              <p className="mt-1">Live alerts</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 space-y-4">
          <div className="rounded-2xl border border-border-subtle bg-bg-card/80 p-6 shadow-soft">
            <p className="text-sm font-medium text-text-primary">
              Trusted by 1,200+ finance teams
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-text-secondary">
              <span>Audit-ready exports</span>
              <span>Real-time alerts</span>
              <span>Role-based access</span>
              <span>Automated reconciliations</span>
            </div>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-bg-card/80 p-6 text-xs text-text-secondary">
            <p className="text-sm font-semibold text-text-primary">“We closed in 5 days.”</p>
            <p className="mt-2">
              TrackFin brought visibility across subsidiaries without the spreadsheet chaos.
            </p>
            <p className="mt-4 font-medium text-text-primary">Kavita Rao, Controller</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-6 rounded-2xl border border-border-subtle bg-bg-card/70 px-6 py-6 shadow-soft">
            <BrandLogo />
            <h1 className="mt-6 text-2xl font-semibold text-text-primary">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>
            )}
          </div>
          {children}
          {footer && <div className="mt-8 text-sm text-text-muted">{footer}</div>}
        </div>
      </div>
    </div>
  </div>
)

export default AuthLayout

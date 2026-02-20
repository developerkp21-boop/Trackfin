import BrandLogo from '../components/BrandLogo'

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="min-vh-100 d-flex flex-column bg-body">
    <div className="row g-0 flex-grow-1">
      <div className="d-none d-lg-flex col-lg-7 auth-hero p-5 align-items-stretch">
        <div className="d-flex flex-column justify-content-between w-100">
          <div className="d-flex align-items-center justify-content-between">
            <BrandLogo size="lg" />
            <span className="badge rounded-pill bg-white text-secondary border border-secondary-subtle px-3 py-2">
              Secure Finance Ops
            </span>
          </div>

          <div className="py-4">
            <h1 className="display-5 fw-bold text-dark letter-space-tight mb-4">
              Build confident, automated <br />
              <span className="text-success">accounting workflows.</span>
            </h1>
            <p className="lead text-secondary mb-4" style={{ maxWidth: '34rem' }}>
              Consolidate ledgers, dashboards, and compliance reporting in one app-ready workspace.
            </p>
            <div className="row g-3" style={{ maxWidth: '30rem' }}>
              <div className="col-4">
                <div className="glass-card rounded-4 p-3 text-center">
                  <p className="h4 fw-bold text-dark mb-1">2.4x</p>
                  <p className="small text-secondary mb-0">Faster close</p>
                </div>
              </div>
              <div className="col-4">
                <div className="glass-card rounded-4 p-3 text-center">
                  <p className="h4 fw-bold text-dark mb-1">98%</p>
                  <p className="small text-secondary mb-0">Audit ready</p>
                </div>
              </div>
              <div className="col-4">
                <div className="glass-card rounded-4 p-3 text-center">
                  <p className="h4 fw-bold text-dark mb-1">24/7</p>
                  <p className="small text-secondary mb-0">Live alerts</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="d-inline-flex align-items-center gap-2 rounded-4 border border-secondary-subtle bg-white p-3 shadow-sm">
              <span className="d-inline-block rounded-circle bg-secondary-subtle" style={{ width: '0.75rem', height: '0.75rem' }} />
              <p className="mb-0 fw-semibold small text-dark">Trusted by 1,200+ finance teams</p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-5 d-flex align-items-center justify-content-center p-3 p-md-4 p-lg-5">
        <div className="auth-shell w-100">
          <div className="mb-4 text-center text-lg-start">
            <div className="d-lg-none mb-3 d-inline-block">
              <BrandLogo />
            </div>
            <h2 className="h2 fw-bold text-app-primary mb-2">{title}</h2>
            {subtitle && <p className="text-app-secondary mb-0">{subtitle}</p>}
          </div>

          {children}

          {footer && <div className="mt-4 text-center small text-app-muted">{footer}</div>}
        </div>
      </div>
    </div>
  </div>
)

export default AuthLayout

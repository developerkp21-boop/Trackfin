const PageHeader = ({ title, subtitle, actions }) => (
  <div className="page-header d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-3">
    <div className="page-header-copy min-w-0">
      <h1 className="h3 fw-semibold text-app-primary mb-1">{title}</h1>
      {subtitle && <p className="text-app-secondary mb-0">{subtitle}</p>}
    </div>
    {actions && (
      <div className="page-header-actions d-flex align-items-center gap-2 flex-wrap">
        {actions}
      </div>
    )}
  </div>
)

export default PageHeader

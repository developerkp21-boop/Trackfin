import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Input from '../../components/Input'
import Button from '../../components/Button'

const SystemSettings = () => (
  <div className="d-flex flex-column gap-4">
    <PageHeader title="System Settings" subtitle="Control platform security, billing, and integrations." />

    <div className="row g-4">
      <div className="col-lg-7">
        <Card className="h-100">
          <h3 className="h5 fw-semibold text-app-primary mb-3">Platform Settings</h3>
          <Input label="Support email" placeholder="support@trackfin.com" />
          <Input label="Default currency" placeholder="USD" />
          <Input label="Billing cycle" placeholder="Monthly" />
          <div className="d-flex align-items-center justify-content-between rounded-3 border border-app-subtle bg-body-tertiary px-3 py-3 small mb-3">
            <div>
              <p className="fw-medium text-app-primary mb-1">Enable audit logging</p>
              <p className="mb-0 text-app-muted">Track all user activity for compliance.</p>
            </div>
            <input type="checkbox" className="form-check-input mt-0" defaultChecked />
          </div>
          <div className="d-flex justify-content-end">
            <Button>Save changes</Button>
          </div>
        </Card>
      </div>

      <div className="col-lg-5">
        <Card className="h-100">
          <h3 className="h5 fw-semibold text-app-primary mb-3">Security</h3>
          <div className="d-flex flex-column gap-2 mb-3">
            <div className="d-flex align-items-center justify-content-between rounded-3 border border-app-subtle px-3 py-3 small">
              <div>
                <p className="fw-medium mb-1 text-app-primary">Require MFA</p>
                <p className="mb-0 text-app-muted">Enforce multi-factor authentication.</p>
              </div>
              <input type="checkbox" className="form-check-input mt-0" />
            </div>
            <div className="d-flex align-items-center justify-content-between rounded-3 border border-app-subtle px-3 py-3 small">
              <div>
                <p className="fw-medium mb-1 text-app-primary">IP allowlist</p>
                <p className="mb-0 text-app-muted">Restrict access to trusted IP ranges.</p>
              </div>
              <input type="checkbox" className="form-check-input mt-0" />
            </div>
          </div>
          <Button variant="secondary" className="w-100">
            Update Security Policy
          </Button>
        </Card>
      </div>
    </div>
  </div>
)

export default SystemSettings

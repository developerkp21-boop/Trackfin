import PageHeader from '../../components/PageHeader'
import Card from '../../components/Card'
import Input from '../../components/Input'
import Button from '../../components/Button'

const SystemSettings = () => (
  <div className="space-y-8">
    <PageHeader
      title="System Settings"
      subtitle="Control platform security, billing, and integrations."
    />

    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <Card className="space-y-5">
        <h3 className="text-lg font-semibold text-text-primary">Platform Settings</h3>
        <Input label="Support email" placeholder="support@trackfin.com" />
        <Input label="Default currency" placeholder="USD" />
        <Input label="Billing cycle" placeholder="Monthly" />
        <div className="flex items-center justify-between rounded-xl border border-border-subtle bg-bg-secondary px-4 py-3 text-sm dark:border-border-strong dark:bg-bg-card">
          <div>
            <p className="font-medium text-text-primary">Enable audit logging</p>
            <p className="text-xs text-text-muted">Track all user activity for compliance.</p>
          </div>
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-border-subtle bg-bg-card text-brand-600 focus:ring-2 focus:ring-brand-100/60"
            defaultChecked
          />
        </div>
        <div className="flex justify-end">
          <Button>Save changes</Button>
        </div>
      </Card>

      <Card className="space-y-5">
        <h3 className="text-lg font-semibold text-text-primary">Security</h3>
        <div className="space-y-3 text-sm text-text-secondary">
          <div className="flex items-center justify-between rounded-xl border border-border-subtle px-4 py-3 dark:border-border-strong">
            <div>
              <p className="font-medium">Require MFA</p>
              <p className="text-xs text-text-muted">Enforce multi-factor authentication.</p>
            </div>
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-border-subtle bg-bg-card text-brand-600 focus:ring-2 focus:ring-brand-100/60"
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border-subtle px-4 py-3 dark:border-border-strong">
            <div>
              <p className="font-medium">IP allowlist</p>
              <p className="text-xs text-text-muted">Restrict access to trusted IP ranges.</p>
            </div>
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-border-subtle bg-bg-card text-brand-600 focus:ring-2 focus:ring-brand-100/60"
            />
          </div>
        </div>
        <Button variant="secondary">Update Security Policy</Button>
      </Card>
    </div>
  </div>
)

export default SystemSettings

import AdminShell from '../components/admin-shell'

export default function AdminDashboardHome(): React.JSX.Element {
  return (
    <AdminShell>
      <div className="flex flex-col gap-6">
        {/* Welcome section */}
        <div>
          <h2 className="font-display text-headline-md font-bold text-on-surface">
            Platform Overview
          </h2>
          <p className="mt-1 font-body text-body-sm text-on-surface-variant">
            Administrative controls for the Loom platform.
          </p>
        </div>

        {/* Stats grid — placeholder cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Active Sellers', value: '0', icon: 'people' },
            { label: 'Total Orders', value: '0', icon: 'receipt_long' },
            { label: 'Platform Revenue', value: '₹0', icon: 'payments' },
            { label: 'Active Products', value: '0', icon: 'category' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded border border-outline-variant bg-surface-container-low p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded bg-tertiary-container">
                <span
                  aria-hidden
                  className="material-symbols-outlined select-none text-tertiary"
                  style={{ fontSize: 20 }}
                >
                  {stat.icon}
                </span>
              </div>
              <div>
                <p className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">
                  {stat.label}
                </p>
                <p className="font-data-mono text-lg font-semibold text-on-surface">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Platform status */}
        <div className="rounded border border-outline-variant bg-surface-container-low p-6">
          <h3 className="font-display text-base font-bold text-on-surface">Platform Status</h3>
          <p className="mt-2 font-body text-body-sm text-on-surface-variant">
            The admin dashboard shell is active. Domain modules (sellers, products, orders,
            inventory, payments, analytics) will be implemented in their respective phases.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded bg-tertiary-container/40 px-3 py-2 font-label-caps text-[10px] uppercase tracking-widest text-tertiary">
              <span
                aria-hidden
                className="material-symbols-outlined select-none"
                style={{ fontSize: 14 }}
              >
                check_circle
              </span>
              Shell Active
            </span>
            <span className="inline-flex items-center gap-2 rounded bg-surface-container-high px-3 py-2 font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">
              <span
                aria-hidden
                className="material-symbols-outlined select-none"
                style={{ fontSize: 14 }}
              >
                schedule
              </span>
              Domain Modules Pending
            </span>
          </div>
        </div>

        {/* System health placeholder */}
        <div className="rounded border border-outline-variant bg-surface-container-low p-6">
          <h3 className="font-display text-base font-bold text-on-surface">System Health</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { name: 'API Server', status: 'Operational' },
              { name: 'Database', status: 'Pending' },
              { name: 'Search Engine', status: 'Pending' },
            ].map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between rounded bg-surface-container-high px-4 py-3"
              >
                <span className="font-body text-sm text-on-surface">{service.name}</span>
                <span
                  className={`font-label-caps text-[10px] uppercase tracking-wider ${
                    service.status === 'Operational'
                      ? 'text-tertiary'
                      : 'text-on-surface-variant/50'
                  }`}
                >
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

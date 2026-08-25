import SellerShell from '../components/seller-shell'

export default function SellerDashboardHome(): React.JSX.Element {
  return (
    <SellerShell>
      <div className="flex flex-col gap-6">
        {/* Welcome section */}
        <div>
          <h2 className="font-display text-headline-md font-bold text-on-surface">Welcome back</h2>
          <p className="mt-1 font-body text-body-sm text-on-surface-variant">
            Here is what is happening with your store today.
          </p>
        </div>

        {/* Stats grid — placeholder cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Total Sales', value: '₹0', icon: 'payments' },
            { label: 'Orders', value: '0', icon: 'receipt_long' },
            { label: 'Products', value: '0', icon: 'inventory_2' },
            { label: 'Commission Earned', value: '₹0', icon: 'monetization_on' },
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

        {/* Quick actions */}
        <div className="rounded border border-outline-variant bg-surface-container-low p-6">
          <h3 className="font-display text-base font-bold text-on-surface">Quick Start</h3>
          <p className="mt-2 font-body text-body-sm text-on-surface-variant">
            Your seller dashboard is ready. Products, orders, analytics, and earnings modules will
            be available in future updates.
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
              Dashboard Active
            </span>
            <span className="inline-flex items-center gap-2 rounded bg-surface-container-high px-3 py-2 font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">
              <span
                aria-hidden
                className="material-symbols-outlined select-none"
                style={{ fontSize: 14 }}
              >
                schedule
              </span>
              Products Coming Soon
            </span>
          </div>
        </div>

        {/* Recent activity placeholder */}
        <div className="rounded border border-outline-variant bg-surface-container-low p-6">
          <h3 className="font-display text-base font-bold text-on-surface">Recent Activity</h3>
          <div className="mt-4 flex flex-col items-center gap-3 py-8 text-center">
            <span
              aria-hidden
              className="material-symbols-outlined select-none text-on-surface-variant/30"
              style={{ fontSize: 48 }}
            >
              inbox
            </span>
            <p className="font-body text-body-sm text-on-surface-variant">
              No activity yet. Once you start selling, your recent activity will appear here.
            </p>
          </div>
        </div>
      </div>
    </SellerShell>
  )
}

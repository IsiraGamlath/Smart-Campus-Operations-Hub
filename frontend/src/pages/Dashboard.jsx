import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserNavbar from '../components/UserNavbar';

function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen" style={{ background: '#fafafa' }}>
      <UserNavbar />

      {/* ===== MAIN CONTENT ===== */}
      <main className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
        {/* ===== WELCOME SECTION ===== */}
        <section className="mb-12">
          <div className="rounded-lg border bg-white p-8" style={{ borderColor: '#e2e8f0' }}>
            <p className="text-xs tracking-widest uppercase" style={{ color: '#64748b' }}>Authenticated Workspace</p>
            <h1 className="mt-3 text-3xl font-bold" style={{ color: '#111827' }}>
              Welcome, {user?.name || 'User'}
            </h1>
            <p className="mt-4 max-w-3xl text-lg" style={{ color: '#475569' }}>
              Manage your resources, bookings, incident tickets, and notifications from one secure workspace.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                to="/bookings"
                className="inline-flex items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                My Bookings
              </Link>
              <Link
                to="/resources"
                className="inline-flex items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Resources
              </Link>
              <Link
                to="/tickets"
                className="inline-flex items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                My Tickets
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin-dashboard"
                  className="inline-flex items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase"
                style={{ background: '#f1f5f9', color: '#64748b' }}
              >
                Role: {user?.role || '-'}
              </span>
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase"
                style={{ background: '#dcfce7', color: '#166534' }}
              >
                Session Active
              </span>
            </div>
          </div>
        </section>

        {/* ===== USER INFO CARDS ===== */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-bold" style={{ color: '#111827' }}>Account Details</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border bg-white p-6" style={{ borderColor: '#e2e8f0' }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>Name</p>
              <p className="mt-3 break-words text-base font-medium" style={{ color: '#111827' }}>
                {user?.name || '-'}
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6" style={{ borderColor: '#e2e8f0' }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>Email</p>
              <p className="mt-3 break-words text-base font-medium" style={{ color: '#111827' }}>
                {user?.email || '-'}
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6" style={{ borderColor: '#e2e8f0' }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>Role</p>
              <p className="mt-3 break-words text-base font-medium" style={{ color: '#111827' }}>
                {user?.role || '-'}
              </p>
            </div>
          </div>
        </section>

        {/* ===== FEATURES SECTION ===== */}
        <section>
          <h2 className="mb-6 text-xl font-bold" style={{ color: '#111827' }}>Platform Features</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-lg border bg-white p-6 transition hover:shadow-sm" style={{ borderColor: '#e2e8f0' }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6366f1' }}>Bookings</p>
              <h3 className="mt-3 text-base font-semibold" style={{ color: '#111827' }}>Workflow Enabled</h3>
              <p className="mt-3 text-sm" style={{ color: '#64748b' }}>
                PENDING → APPROVED / REJECTED with automatic conflict detection and cancellation support.
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6 transition hover:shadow-sm" style={{ borderColor: '#e2e8f0' }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#0891b2' }}>Tickets</p>
              <h3 className="mt-3 text-base font-semibold" style={{ color: '#111827' }}>Lifecycle Tracking</h3>
              <p className="mt-3 text-sm" style={{ color: '#64748b' }}>
                OPEN → IN_PROGRESS → RESOLVED → CLOSED with technician assignments and threaded comments.
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6 transition hover:shadow-sm" style={{ borderColor: '#e2e8f0' }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#16a34a' }}>Notifications</p>
              <h3 className="mt-3 text-base font-semibold" style={{ color: '#111827' }}>Real-Time Updates</h3>
              <p className="mt-3 text-sm" style={{ color: '#64748b' }}>
                Instant alerts for booking outcomes, ticket status changes, and new comment activity.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

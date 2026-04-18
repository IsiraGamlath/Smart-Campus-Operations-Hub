import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const initialFormState = {
  userId: '',
  role: 'USER',
};

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [formState, setFormState] = useState(initialFormState);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/tickets" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore
    } finally {
      setUser(null);
      navigate('/login', { replace: true });
    }
  };

  const handleRoleUpdate = async (event) => {
    event.preventDefault();
    setMessage('');
    setErrorMessage('');

    if (!formState.userId.trim()) {
      setErrorMessage('User ID is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:8080/api/auth/${formState.userId.trim()}/role`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: formState.role }),
      });

      const responseBody = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(responseBody.message || 'Unable to update user role.');
      }

      setMessage(`User role updated to ${formState.role}.`);
      setFormState(initialFormState);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to update user role.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Admin Workspace</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Smart Campus Admin Dashboard</h1>
              <p className="mt-2 text-sm text-slate-600">
                Manage users, review bookings, and keep campus operations under control.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/tickets"
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Ticket Page
              </Link>
              <Link
                to="/bookings"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Booking Queue
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current Admin</p>
            <p className="mt-2 break-words text-sm font-medium text-slate-900">{user.name || '-'}</p>
            <p className="mt-1 break-words text-sm text-slate-600">{user.email || '-'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Role</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{user.role}</p>
            <p className="mt-1 text-sm text-slate-600">Admin privileges are enabled.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Quick Links</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700" to="/resources">
                Resources
              </Link>
              <Link className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700" to="/bookings">
                Bookings
              </Link>
              <Link className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700" to="/tickets">
                Ticket Page
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Update User Role</h2>
            <p className="mt-1 text-sm text-slate-600">
              Promote or demote a user by entering their user ID and selecting a new role.
            </p>

            {message && (
              <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>
            )}
            {errorMessage && (
              <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</p>
            )}

            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleRoleUpdate}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="userId">
                  User ID
                </label>
                <input
                  id="userId"
                  name="userId"
                  value={formState.userId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                  placeholder="Enter Mongo user ID"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="role">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formState.role}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="TECHNICIAN">TECHNICIAN</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Updating...' : 'Update Role'}
                </button>
              </div>
            </form>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Admin Notes</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• Admin access is assigned from MongoDB first, then managed here.</li>
              <li>• Approved booking conflicts are rejected automatically.</li>
              <li>• Use the booking queue to review pending requests.</li>
            </ul>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;
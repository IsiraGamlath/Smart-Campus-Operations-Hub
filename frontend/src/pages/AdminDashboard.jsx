import { Bell } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState('');
  const [notifications, setNotifications] = useState([]);

  const handleUnauthorized = useCallback(() => {
    setUser(null);
    navigate('/', { replace: true });
  }, [navigate, setUser]);

  const isNotificationRead = (notification) => {
    if (!notification || typeof notification !== 'object') {
      return false;
    }

    if (typeof notification.read === 'boolean') {
      return notification.read;
    }

    if (typeof notification.isRead === 'boolean') {
      return notification.isRead;
    }

    return false;
  };

  const unreadCount = notifications.reduce(
    (count, notification) => (isNotificationRead(notification) ? count : count + 1),
    0
  );

  const formatNotificationDate = (value) => {
    if (!value) {
      return '';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return '';
    }

    return parsed.toLocaleString();
  };

  const loadNotifications = useCallback(async () => {
    setNotificationsLoading(true);
    setNotificationsError('');

    try {
      const response = await fetch('http://localhost:8080/api/notifications', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error('Unable to load notifications.');
      }

      const data = await response.json();
      const list = Array.isArray(data) ? data : [];

      list.sort((a, b) => {
        const aTime = Date.parse(a?.createdAt ?? a?.created_at ?? '');
        const bTime = Date.parse(b?.createdAt ?? b?.created_at ?? '');

        if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
          return 0;
        }

        return bTime - aTime;
      });

      setNotifications(list);
    } catch (error) {
      setNotificationsError(error.message || 'Unable to load notifications.');
    } finally {
      setNotificationsLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      return undefined;
    }

    loadNotifications();

    const intervalId = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [loadNotifications, user]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleNotifications = () => {
    const nextOpen = !notificationsOpen;
    setNotificationsOpen(nextOpen);

    if (nextOpen) {
      loadNotifications();
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error('Unable to mark notification as read.');
      }

      const updated = await response.json().catch(() => null);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                ...(updated && typeof updated === 'object' ? updated : {}),
                read: true,
                isRead: true,
              }
            : notification
        )
      );
    } catch {
      // Ignore transient failures and keep UI responsive.
    }
  };

  const handleDismiss = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/notifications/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error('Unable to delete notification.');
      }

      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    } catch {
      // Ignore transient failures and keep UI responsive.
    }
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
      navigate('/', { replace: true });
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

            <div className="relative flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleToggleNotifications}
                className="relative inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-slate-700 transition hover:bg-slate-50"
                aria-expanded={notificationsOpen}
                aria-label="Open notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-600 px-1 text-xs font-semibold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
              >
                Logout
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-3 w-96 max-w-[90vw] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Notifications</p>
                      <p className="text-xs text-slate-500">
                        {unreadCount === 0 ? 'All caught up' : `${unreadCount} unread`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={loadNotifications}
                      className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:bg-slate-50"
                    >
                      Refresh
                    </button>
                  </div>

                  <div className="max-h-[22rem] overflow-y-auto p-4">
                    {notificationsLoading ? (
                      <p className="text-sm text-slate-600">Loading notifications...</p>
                    ) : notificationsError ? (
                      <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                        {notificationsError}
                      </div>
                    ) : notifications.length === 0 ? (
                      <p className="text-sm text-slate-600">No notifications yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {notifications.map((notification) => {
                          const isRead = isNotificationRead(notification);
                          const createdAtLabel = formatNotificationDate(
                            notification.createdAt || notification.created_at
                          );

                          return (
                            <div
                              key={notification.id}
                              className={`rounded-lg border px-3 py-3 ${
                                isRead ? 'border-slate-200 bg-white' : 'border-amber-200 bg-amber-50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-medium text-slate-900">
                                    {notification.message || 'Notification'}
                                  </p>
                                  {createdAtLabel && (
                                    <p className="mt-1 text-xs text-slate-500">{createdAtLabel}</p>
                                  )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  {!isRead && (
                                    <button
                                      type="button"
                                      onClick={() => handleMarkAsRead(notification.id)}
                                      className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                                    >
                                      Mark read
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleDismiss(notification.id)}
                                    className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                                  >
                                    Dismiss
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                Tickets
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
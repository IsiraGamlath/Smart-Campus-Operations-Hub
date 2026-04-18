import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Resources', to: '/resources' },
  { label: 'Bookings', to: '/bookings' },
];

function UserNavbar() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState('');
  const [notifications, setNotifications] = useState([]);

  if (!user || user.role === 'ADMIN') {
    return null;
  }

  const handleUnauthorized = () => {
    setUser(null);
    navigate('/', { replace: true });
  };

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

  const loadNotifications = async () => {
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
        throw new Error('Unable to update notification.');
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
      // Ignore errors to keep UI responsive.
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
      // Ignore errors to keep UI responsive.
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await fetch('http://localhost:8080/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Ignore network errors here and still clear local auth state.
    } finally {
      setUser(null);
      navigate('/', { replace: true });
    }
  };

  return (
    <nav
      className="sticky top-0 z-40 border-b"
      style={{ borderColor: '#e2e8f0', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)' }}
    >
      <div className="mx-auto max-w-6xl px-6 py-4 sm:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
              SC
            </div>
            <span className="text-sm font-semibold" style={{ color: '#111827' }}>Smart Campus</span>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium transition"
                style={{ color: '#64748b' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="relative flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleNotifications}
              className="relative rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              aria-expanded={notificationsOpen}
              aria-label="Open notifications"
            >
              Notifications
              {unreadCount > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-600 px-1 text-xs font-semibold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-80"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
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
      </div>
    </nav>
  );
}

export default UserNavbar;

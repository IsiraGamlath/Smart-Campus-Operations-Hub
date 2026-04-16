import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
      navigate('/login', { replace: true });
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe_0%,_#f8fafc_45%,_#f1f5f9_100%)] px-6 py-10 text-slate-800">
      <section className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur">
        <header className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">Smart Campus</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome, {user?.name || 'Student'}
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </header>

        <div className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Name</p>
            <p className="mt-2 break-words text-base font-semibold text-slate-900">{user?.name || '-'}</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Email</p>
            <p className="mt-2 break-words text-base font-semibold text-slate-900">{user?.email || '-'}</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Role</p>
            <p className="mt-2 break-words text-base font-semibold text-slate-900">{user?.role || '-'}</p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;

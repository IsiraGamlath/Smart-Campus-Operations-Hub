import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GOOGLE_OAUTH_URL = 'http://localhost:8080/oauth2/authorization/google';

function getDashboardPath(user) {
  if (!user || !user.role) {
     return '/dashboard';
  }

  return String(user.role).toUpperCase() === 'ADMIN'
    ? '/admin-dashboard'
    : '/dashboard';
}

function Login() {
  const { user, loading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGoogleSignIn = () => {
    if (isRedirecting) return;

    setIsRedirecting(true);
    window.location.href = GOOGLE_OAUTH_URL;
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-6">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
          Checking session...
        </div>
      </main>
    );
  }

  if (user) {
    return <Navigate to={getDashboardPath(user)} replace />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-6 text-slate-800">

      {/* Top subtle brand */}
      <header className="mb-10 flex flex-col items-center text-center">
        <div className="mb-3 text-xs tracking-[0.3em] text-slate-400">
          SMART CAMPUS
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Welcome back
        </h1>

        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Sign in using your university Google account to continue.
        </p>
      </header>

      {/* Login card */}
      <section className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        {/* Title */}
        <div className="mb-6 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            Smart Campus Login
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Secure access to your workspace
          </p>
        </div>

        {/* Google button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isRedirecting}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.99]"
        >
          {isRedirecting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
              Redirecting...
            </>
          ) : (
            <>
              <span className="text-base">G</span>
              Continue with Google
            </>
          )}
        </button>

        {/* footer hint */}
        <p className="mt-5 text-center text-xs text-slate-400">
          By continuing, you agree to campus authentication policies
        </p>
      </section>

      {/* Bottom navigation */}
      <footer className="mt-10 text-xs text-slate-400">
        © Smart Campus System
      </footer>
    </main>
  );
}

export default Login;
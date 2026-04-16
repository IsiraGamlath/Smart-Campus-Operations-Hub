import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GOOGLE_OAUTH_URL = 'http://localhost:8080/oauth2/authorization/google';

function Login() {
  const { user, loading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGoogleSignIn = () => {
    if (isRedirecting) {
      return;
    }

    setIsRedirecting(true);
    window.location.href = GOOGLE_OAUTH_URL;
  };

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 px-6">
        <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-lg shadow-slate-200/70">
          <span
            className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700"
            aria-hidden="true"
          />
          <span>Checking your session...</span>
        </div>
      </main>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 px-6 py-10 font-sans text-slate-800">
      <section
        className="mx-auto grid w-full max-w-md gap-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_24px_48px_rgba(15,23,42,0.12)]"
        aria-label="Smart Campus authentication"
      >
        <div className="grid justify-items-center gap-3">
          <div
            className="grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br from-sky-600 to-blue-400 text-sm font-bold tracking-[0.2em] text-white"
            aria-hidden="true"
          >
            SC
          </div>
          <h1 className="m-0 text-[1.75rem] font-bold leading-tight text-slate-900">Smart Campus Login</h1>
        </div>

        <p className="mx-auto max-w-sm text-sm leading-relaxed text-slate-600">
          Login using your university Google account
        </p>

        <button
          className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-800 transition hover:bg-slate-50 hover:shadow-[0_10px_20px_rgba(15,23,42,0.1)] active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-80"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isRedirecting}
          aria-busy={isRedirecting}
        >
          {isRedirecting ? (
            <>
              <span
                className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-slate-300 border-t-slate-800"
                aria-hidden="true"
              />
              <span>Redirecting...</span>
            </>
          ) : (
            <>
              <span
                className="grid h-6 w-6 place-items-center rounded-full border border-slate-300 text-sm font-bold text-blue-500"
                aria-hidden="true"
              >
                G
              </span>
              <span>Sign in with Google</span>
            </>
          )}
        </button>
      </section>
    </main>
  );
}

export default Login;

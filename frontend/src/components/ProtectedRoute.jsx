import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

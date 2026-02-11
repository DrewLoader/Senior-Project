import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MealMateLogo } from '../components/MealMateLogo';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowDown } from 'lucide-react';

export function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, continueAsGuest } = useAuth();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    navigate('/personalize');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50/40 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <MealMateLogo linkTo="/" />
        <Link to="/signin" className="text-primary-600 font-semibold">
          Log In
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-primary-100/50" />
          <div className="absolute bottom-32 left-16 w-24 h-24 rounded-full bg-primary-200/30" />
        </div>
        <div className="relative w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <p className="text-center text-gray-600 mb-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-600 font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>
              )}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <p className="text-center text-gray-500 text-sm mt-4 flex items-center justify-center gap-1">
              Don't have an account? Sign Up <ArrowDown className="w-4 h-4" />
            </p>
            <button
              type="button"
              onClick={handleGuest}
              className="w-full mt-4 py-3 border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

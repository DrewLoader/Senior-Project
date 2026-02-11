import { Link } from 'react-router-dom';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { useAuth } from '../context/AuthContext';
import { User, Mail, LogOut, ArrowLeft } from 'lucide-react';

export function AccountPage() {
  const { user, isGuest, isAuthenticated, signOut } = useAuth();

  const displayName = user && 'name' in user ? user.name : 'Guest';
  const email = user && 'email' in user ? user.email : null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="max-w-xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Account</h1>
          <p className="text-gray-600 mb-8">Your profile and account details.</p>

          <div className="card space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="w-7 h-7 text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{displayName}</p>
                {email && (
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    {email}
                  </p>
                )}
                {isGuest && (
                  <p className="text-sm text-amber-600 mt-1">Guest account — sign in to save your data.</p>
                )}
              </div>
            </div>

            {isAuthenticated && (
              <p className="text-sm text-gray-500">
                Your meal plans are saved to your account. Sign out and back in on any device to see them.
              </p>
            )}

            <hr className="border-gray-100" />

            <div className="flex flex-col sm:flex-row gap-3">
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="btn-secondary inline-flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              )}
              {isGuest && (
                <Link
                  to="/signin"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  Sign in to save your plans
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

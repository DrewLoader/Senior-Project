import { Link, useLocation } from 'react-router-dom';
import { MealMateLogo } from '../MealMateLogo';
import { useAuth } from '../../context/AuthContext';
import { Home, Settings, ClipboardList, User, LogOut } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/dashboard/grocery', icon: ClipboardList, label: 'Grocery List' },
  { to: '/dashboard/account', icon: User, label: 'Account' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function DashboardSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <aside className="w-20 flex flex-col items-center py-6 bg-primary-600 text-white">
      <div className="mb-8 flex justify-center">
        <div className="bg-white/20 p-2 rounded-lg text-white">
          <MealMateLogo showText={false} linkTo="/dashboard" />
        </div>
      </div>
      <nav className="flex flex-col gap-4 flex-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              title={label}
              className={`p-3 rounded-lg transition-colors ${
                isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <Icon className="w-6 h-6" />
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={() => signOut()}
        title="Log out"
        className="p-3 rounded-lg text-white/80 hover:bg-white/10 transition-colors mt-auto"
      >
        <LogOut className="w-6 h-6" />
      </button>
    </aside>
  );
}

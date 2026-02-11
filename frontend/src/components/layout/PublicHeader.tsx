import { Link } from 'react-router-dom';
import { MealMateLogo } from '../MealMateLogo';
import { Leaf } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: "Weekly's" },
  { to: '/resources', label: 'Resources' },
  { to: '/blog', label: 'Blog' },
];

export function PublicHeader() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <MealMateLogo linkTo="/" />
          <nav className="flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
              >
                {label}
              </Link>
            ))}
            <Leaf className="w-5 h-5 text-primary-500" />
            <Link
              to="/signin"
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2 rounded-full transition-colors"
            >
              Log In
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

import { UtensilsCrossed } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 p-2 rounded-lg">
            <UtensilsCrossed className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meal Prep Planner</h1>
            <p className="text-sm text-gray-600">AI-Powered Weekly Meal Planning</p>
          </div>
        </div>
      </div>
    </header>
  );
}

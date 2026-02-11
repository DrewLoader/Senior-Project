import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { ArrowLeft, Save } from 'lucide-react';

export function SettingsPage() {
  const [defaultCalories, setDefaultCalories] = useState(() => {
    const s = localStorage.getItem('mealmate_default_calories');
    return s ? parseInt(s, 10) : 2000;
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('mealmate_default_calories', String(defaultCalories));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600 mb-8">Preferences for your meal plans.</p>

          <div className="card space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default daily calorie target
              </label>
              <p className="text-sm text-gray-500 mb-2">
                This value will be pre-filled when you create or regenerate a meal plan.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1200}
                  max={4000}
                  step={100}
                  value={defaultCalories}
                  onChange={(e) => setDefaultCalories(Number(e.target.value))}
                  className="input-field w-32"
                />
                <span className="text-gray-600">calories</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save preferences'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

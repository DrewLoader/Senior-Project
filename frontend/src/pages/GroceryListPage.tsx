import { Link } from 'react-router-dom';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { useMealPlan } from '../context/MealPlanContext';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

export function GroceryListPage() {
  const { mealPlan } = useMealPlan();

  if (!mealPlan) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <p className="text-gray-600">No meal plan. Generate one from the dashboard.</p>
          <Link to="/personalize" className="text-primary-600 font-medium mt-2 inline-block">
            Create meal plan
          </Link>
        </main>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <ShoppingCart className="w-7 h-7 text-primary-600" />
          Grocery List
        </h1>
        <p className="text-gray-600 mb-8">For the week of {new Date(mealPlan.weekStartDate).toLocaleDateString('en-US')}</p>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {mealPlan.shoppingList.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 text-gray-700">
              <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

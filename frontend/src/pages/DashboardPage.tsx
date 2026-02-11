import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { useAuth } from '../context/AuthContext';
import { useMealPlan } from '../context/MealPlanContext';
import { api } from '../api/client';
import { ShoppingCart, Bell, Search, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import type { Meal, DayMeals } from '../types';

function MealCard({ meal, mealType }: { meal: Meal; mealType: string }) {
  const imgPlaceholder = `https://placehold.co/300x200/e8f5e9/1b5e20?text=${encodeURIComponent(meal.name)}`;
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-[3/2] bg-gray-100">
        <img
          src={imgPlaceholder}
          alt={meal.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-gray-900">{meal.name}</h4>
        <p className="text-sm text-gray-500 capitalize">{mealType}</p>
        <p className="text-primary-600 font-semibold mt-1">{meal.calories} kcal</p>
        <p className="text-xs text-gray-500 mt-1">
          Protein {meal.protein}g · Carbs {meal.carbs}g · Fats {meal.fats}g
        </p>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const { mealPlan, setMealPlan } = useMealPlan();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [loadingPlan, setLoadingPlan] = useState(false);

  // Load saved plan from server when logged in and no plan in state
  useEffect(() => {
    if (!isAuthenticated || mealPlan) return;
    setLoadingPlan(true);
    api
      .get<{ success: boolean; mealPlan: import('../types').MealPlan }>('/meal-plan/me')
      .then((res) => {
        if (res.data.success && res.data.mealPlan) {
          setMealPlan(res.data.mealPlan, null);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingPlan(false));
  }, [isAuthenticated]);

  if (!mealPlan && !loadingPlan) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              Welcome, {user?.name ?? 'Guest'}
            </h1>
          </header>
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              {loadingPlan ? (
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto" />
              ) : (
                <>
                  <p className="text-gray-600 mb-4">You don't have a meal plan yet.</p>
                  <Link
                    to="/personalize"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    Create Your Meal Plan
                  </Link>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  const days = mealPlan.days;
  const selectedDay: DayMeals = days[selectedDayIndex];
  const weekStart = new Date(mealPlan.weekStartDate);
  weekStart.setDate(weekStart.getDate() + weekOffset * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const dateRange = `${weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${weekEnd.getDate()}`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Welcome, {user?.name ?? 'Guest'}
            </h1>
            <p className="text-sm text-gray-500">Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button type="button" className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <Bell className="w-5 h-5" />
            </button>
            <button type="button" className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Weekly Meal Plan</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWeekOffset((o) => o - 1)}
                className="p-2 rounded-lg hover:bg-gray-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-gray-600 font-medium min-w-[180px] text-center">
                {dateRange}
              </span>
              <button
                type="button"
                onClick={() => setWeekOffset((o) => o + 1)}
                className="p-2 rounded-lg hover:bg-gray-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Day selector */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {days.map((day, idx) => (
              <button
                key={day.day}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedDayIndex === idx
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {day.day.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Meals for selected day */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MealCard meal={selectedDay.breakfast} mealType="Breakfast" />
            <MealCard meal={selectedDay.lunch} mealType="Lunch" />
            <MealCard meal={selectedDay.dinner} mealType="Dinner" />
            {selectedDay.snacks?.[0] && (
              <MealCard meal={selectedDay.snacks[0]} mealType="Snack" />
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/personalize"
              className="btn-primary inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate Plan
            </Link>
            <Link
              to="/dashboard/grocery"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Grocery List
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

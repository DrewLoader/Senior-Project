import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicHeader } from '../components/layout/PublicHeader';
import { api } from '../api/client';
import type { MealPlan, MealPlanRequest } from '../types';
import { useMealPlan } from '../context/MealPlanContext';

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
];

const MEAL_PREF_OPTIONS = [
  'High Protein',
  'Low Carb',
  'Quick Meals',
  'Budget-Friendly',
];

export function PersonalizePage() {
  const navigate = useNavigate();
  const { setMealPlan } = useMealPlan();
  const [fitnessGoal, setFitnessGoal] = useState<'weight_loss' | 'muscle_growth'>('weight_loss');
  const [dailyCalories, setDailyCalories] = useState(() => {
    const s = localStorage.getItem('mealmate_default_calories');
    return s ? parseInt(s, 10) : 2000;
  });
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [mealPreferences, setMealPreferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (arr: string[], setArr: (a: string[]) => void, item: string) => {
    if (arr.includes(item)) setArr(arr.filter((i) => i !== item));
    else setArr([...arr, item]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await api.post<{
        success: boolean;
        sessionId: string;
        mealPlan: MealPlan;
      }>('/meal-plan/generate', {
        dailyCalories,
        fitnessGoal,
        dietaryRestrictions: dietaryRestrictions.length ? dietaryRestrictions : undefined,
        mealPreferences: mealPreferences.length ? mealPreferences : undefined,
      } as MealPlanRequest);

      if (response.data.success) {
        setMealPlan(response.data.mealPlan, response.data.sessionId);
        navigate('/dashboard');
      } else {
        setError('Failed to generate meal plan. Please try again.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          'Failed to generate meal plan. Check your API key and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50/30">
      <PublicHeader />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Personalize Your Meal Plan
        </h1>
        <p className="text-gray-600 mb-8">
          Select your meal plans based on your goals, calories, and preferences.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Fitness Goal */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Your Fitness Goal</h3>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="goal"
                  checked={fitnessGoal === 'weight_loss'}
                  onChange={() => setFitnessGoal('weight_loss')}
                  className="w-4 h-4 text-primary-600"
                />
                <span>Lose Weight</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="goal"
                  checked={fitnessGoal === 'muscle_growth'}
                  onChange={() => setFitnessGoal('muscle_growth')}
                  className="w-4 h-4 text-primary-600"
                />
                <span>Gain Muscle</span>
              </label>
            </div>
          </div>

          {/* Daily Calorie Limit */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">Daily Calorie Limit</h3>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1200}
                max={4000}
                step={100}
                value={dailyCalories}
                onChange={(e) => setDailyCalories(Number(e.target.value))}
                className="input-field w-28"
              />
              <span className="text-gray-600">Cal</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Choose a target that matches your goal and activity level.
            </p>
          </div>

          {/* Dietary Restrictions */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Dietary Restrictions</h3>
            <div className="grid grid-cols-2 gap-3">
              {DIETARY_OPTIONS.map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dietaryRestrictions.includes(opt)}
                    onChange={() => toggle(dietaryRestrictions, setDietaryRestrictions, opt)}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600"
                  />
                  <span className="text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Meal Preferences */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Meal Preferences</h3>
            <div className="flex flex-wrap gap-4">
              {MEAL_PREF_OPTIONS.map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mealPreferences.includes(opt)}
                    onChange={() => toggle(mealPreferences, setMealPreferences, opt)}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600"
                  />
                  <span className="text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-lg rounded-full"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Generating...
              </span>
            ) : (
              'Generate My Meal Plan'
            )}
          </button>
        </form>
      </main>
    </div>
  );
}

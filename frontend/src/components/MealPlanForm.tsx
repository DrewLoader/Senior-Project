import { useState, FormEvent } from 'react';
import { Sparkles, Target, Apple, ChefHat } from 'lucide-react';
import axios from 'axios';
import type { MealPlan, MealPlanRequest } from '../types';

interface MealPlanFormProps {
  onMealPlanGenerated: (plan: MealPlan, sessionId: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const FITNESS_GOALS = [
  { value: 'weight_loss', label: 'Weight Loss', icon: Target },
  { value: 'muscle_growth', label: 'Muscle Growth', icon: Apple },
  { value: 'maintenance', label: 'Maintenance', icon: ChefHat },
  { value: 'endurance', label: 'Endurance', icon: Target },
] as const;

const COMMON_DIETARY_RESTRICTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Keto',
  'Paleo',
  'Low-Carb',
  'Low-Fat',
  'Halal',
  'Kosher',
];

const COMMON_MEAL_PREFERENCES = [
  'High Protein',
  'Quick Prep (< 30 min)',
  'Batch Cooking',
  'One-Pot Meals',
  'Meal Prep Friendly',
  'Budget-Friendly',
  'Gourmet',
  'Comfort Food',
  'International Cuisine',
];

export function MealPlanForm({ onMealPlanGenerated, loading, setLoading }: MealPlanFormProps) {
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [fitnessGoal, setFitnessGoal] = useState<MealPlanRequest['fitnessGoal']>('maintenance');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [mealPreferences, setMealPreferences] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const toggleArrayItem = (array: string[], setArray: (arr: string[]) => void, item: string) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post<{
        success: boolean;
        sessionId: string;
        mealPlan: MealPlan;
      }>('/api/meal-plan/generate', {
        dailyCalories,
        fitnessGoal,
        dietaryRestrictions: dietaryRestrictions.length > 0 ? dietaryRestrictions : undefined,
        mealPreferences: mealPreferences.length > 0 ? mealPreferences : undefined,
      });

      if (response.data.success) {
        onMealPlanGenerated(response.data.mealPlan, response.data.sessionId);
      } else {
        setError('Failed to generate meal plan. Please try again.');
      }
    } catch (err: any) {
      console.error('Error generating meal plan:', err);
      setError(
        err.response?.data?.error || 
        'Failed to generate meal plan. Please check your API key and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Create Your Personalized Meal Plan
        </h2>
        <p className="text-gray-600">
          Tell us about your goals and preferences, and we'll generate a custom weekly meal prep plan
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-8">
        {/* Daily Calories */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Daily Calorie Target
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1200"
              max="4000"
              step="100"
              value={dailyCalories}
              onChange={(e) => setDailyCalories(Number(e.target.value))}
              className="flex-1"
            />
            <div className="w-24 text-center">
              <span className="text-2xl font-bold text-primary-600">{dailyCalories}</span>
              <span className="text-sm text-gray-500 block">calories</span>
            </div>
          </div>
        </div>

        {/* Fitness Goal */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Fitness Goal
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FITNESS_GOALS.map((goal) => {
              const Icon = goal.icon;
              const isSelected = fitnessGoal === goal.value;
              return (
                <button
                  key={goal.value}
                  type="button"
                  onClick={() => setFitnessGoal(goal.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">{goal.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Dietary Restrictions (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_DIETARY_RESTRICTIONS.map((restriction) => (
              <button
                key={restriction}
                type="button"
                onClick={() => toggleArrayItem(dietaryRestrictions, setDietaryRestrictions, restriction)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  dietaryRestrictions.includes(restriction)
                    ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {restriction}
              </button>
            ))}
          </div>
        </div>

        {/* Meal Preferences */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Meal Preferences (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_MEAL_PREFERENCES.map((preference) => (
              <button
                key={preference}
                type="button"
                onClick={() => toggleArrayItem(mealPreferences, setMealPreferences, preference)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  mealPreferences.includes(preference)
                    ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {preference}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 text-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generating Your Meal Plan...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Meal Plan
            </>
          )}
        </button>
      </form>
    </div>
  );
}

import { useState } from 'react';
import { ArrowLeft, ShoppingCart, Lightbulb, Calendar, Utensils } from 'lucide-react';
import type { MealPlan, Meal } from '../types';

interface MealPlanDisplayProps {
  mealPlan: MealPlan;
  onReset: () => void;
}

export function MealPlanDisplay({ mealPlan, onReset }: MealPlanDisplayProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showPrepTips, setShowPrepTips] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const MealCard = ({ meal, mealType }: { meal: Meal; mealType: string }) => (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-lg text-gray-900">{meal.name}</h4>
          <p className="text-sm text-gray-500 capitalize">{mealType}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">{meal.calories}</div>
          <div className="text-xs text-gray-500">calories</div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
        <div className="bg-blue-50 p-2 rounded">
          <div className="text-blue-600 font-semibold">{meal.protein}g</div>
          <div className="text-blue-500 text-xs">Protein</div>
        </div>
        <div className="bg-green-50 p-2 rounded">
          <div className="text-green-600 font-semibold">{meal.carbs}g</div>
          <div className="text-green-500 text-xs">Carbs</div>
        </div>
        <div className="bg-orange-50 p-2 rounded">
          <div className="text-orange-600 font-semibold">{meal.fats}g</div>
          <div className="text-orange-500 text-xs">Fats</div>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Ingredients:</p>
        <p className="text-sm text-gray-600">{meal.ingredients.join(', ')}</p>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <Utensils className="w-3 h-3" />
          {meal.prepTime} min prep
        </span>
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer text-primary-600 font-medium hover:text-primary-700">
          View Instructions
        </summary>
        <ol className="mt-2 space-y-1 list-decimal list-inside text-gray-600">
          {meal.instructions.map((instruction, idx) => (
            <li key={idx}>{instruction}</li>
          ))}
        </ol>
      </details>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Your Weekly Meal Plan</h2>
          <p className="text-gray-600">
            Week of {formatDate(mealPlan.weekStartDate)}
          </p>
        </div>
        <button
          onClick={onReset}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Create New Plan
        </button>
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {Math.round(mealPlan.weeklyTotals.totalCalories / 7)}
          </div>
          <div className="text-sm text-gray-600">Avg Daily Calories</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(mealPlan.weeklyTotals.totalProtein / 7)}g
          </div>
          <div className="text-sm text-gray-600">Avg Daily Protein</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.round(mealPlan.weeklyTotals.totalCarbs / 7)}g
          </div>
          <div className="text-sm text-gray-600">Avg Daily Carbs</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange-600">
            {Math.round(mealPlan.weeklyTotals.totalFats / 7)}g
          </div>
          <div className="text-sm text-gray-600">Avg Daily Fats</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => {
            setShowShoppingList(!showShoppingList);
            setShowPrepTips(false);
          }}
          className="btn-secondary flex items-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          {showShoppingList ? 'Hide' : 'Show'} Shopping List
        </button>
        <button
          onClick={() => {
            setShowPrepTips(!showPrepTips);
            setShowShoppingList(false);
          }}
          className="btn-secondary flex items-center gap-2"
        >
          <Lightbulb className="w-4 h-4" />
          {showPrepTips ? 'Hide' : 'Show'} Prep Tips
        </button>
      </div>

      {/* Shopping List */}
      {showShoppingList && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary-600" />
            Shopping List
          </h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {mealPlan.shoppingList.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Prep Tips */}
      {showPrepTips && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary-600" />
            Meal Prep Tips
          </h3>
          <ul className="space-y-2">
            {mealPlan.prepTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-700">
                <span className="text-primary-500 mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Daily Meal Plans */}
      <div className="space-y-6">
        {mealPlan.days.map((day) => (
          <div key={day.day} className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary-600" />
                  {day.day}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Total: {day.totalCalories} cal | P: {day.totalProtein}g | C: {day.totalCarbs}g | F: {day.totalFats}g
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <MealCard meal={day.breakfast} mealType="Breakfast" />
              <MealCard meal={day.lunch} mealType="Lunch" />
              <MealCard meal={day.dinner} mealType="Dinner" />
            </div>

            {day.snacks && day.snacks.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Snacks</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {day.snacks.map((snack, idx) => (
                    <MealCard key={idx} meal={snack} mealType="Snack" />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

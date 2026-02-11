export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  prepTime: number;
  instructions: string[];
}

export interface DayMeals {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks?: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

export interface MealPlan {
  weekStartDate: string;
  days: DayMeals[];
  weeklyTotals: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFats: number;
  };
  shoppingList: string[];
  prepTips: string[];
}

export interface MealPlanRequest {
  dailyCalories: number;
  fitnessGoal: 'weight_loss' | 'muscle_growth' | 'maintenance' | 'endurance';
  dietaryRestrictions?: string[];
  mealPreferences?: string[];
  sessionId?: string;
}

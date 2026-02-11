import OpenAI from 'openai';
import { z } from 'zod';

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    throw new Error('OPENAI_API_KEY is not set. Add your OpenAI API key to backend/.env');
  }
  return new OpenAI({ apiKey });
}

interface MealPlanRequest {
  dailyCalories: number;
  fitnessGoal: 'weight_loss' | 'muscle_growth' | 'maintenance' | 'endurance';
  dietaryRestrictions?: string[];
  mealPreferences?: string[];
}

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  prepTime: number;
  instructions: string[];
}

interface DayMeals {
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

interface MealPlan {
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

export async function generateMealPlan(request: MealPlanRequest): Promise<MealPlan> {
  const systemPrompt = `You are a professional nutritionist and meal prep expert. Generate detailed, practical weekly meal prep plans that are:
- Nutritionally balanced and aligned with fitness goals
- Realistic for meal prep (can be prepared in advance)
- Include specific recipes with ingredients and instructions
- Provide accurate macronutrient information
- Include shopping lists and prep tips

Return your response as a valid JSON object matching this structure:
{
  "weekStartDate": "YYYY-MM-DD",
  "days": [
    {
      "day": "Monday",
      "breakfast": {
        "name": "Meal name",
        "calories": number,
        "protein": number (grams),
        "carbs": number (grams),
        "fats": number (grams),
        "ingredients": ["ingredient1", "ingredient2"],
        "prepTime": number (minutes),
        "instructions": ["step1", "step2"]
      },
      "lunch": { ... },
      "dinner": { ... },
      "snacks": [{ ... }] (optional),
      "totalCalories": number,
      "totalProtein": number,
      "totalCarbs": number,
      "totalFats": number
    }
  ],
  "weeklyTotals": {
    "totalCalories": number,
    "totalProtein": number,
    "totalCarbs": number,
    "totalFats": number
  },
  "shoppingList": ["item1", "item2"],
  "prepTips": ["tip1", "tip2"]
}`;

  const userPrompt = `Generate a weekly meal prep plan with the following requirements:
- Daily calorie target: ${request.dailyCalories} calories
- Fitness goal: ${request.fitnessGoal}
${request.dietaryRestrictions && request.dietaryRestrictions.length > 0 
  ? `- Dietary restrictions: ${request.dietaryRestrictions.join(', ')}`
  : '- No specific dietary restrictions'}
${request.mealPreferences && request.mealPreferences.length > 0
  ? `- Meal preferences: ${request.mealPreferences.join(', ')}`
  : '- No specific meal preferences'}

Make sure the daily totals are close to the calorie target (within 100 calories). Include variety throughout the week.`;

  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const mealPlan = JSON.parse(content) as MealPlan;
    
    // Validate the structure
    validateMealPlan(mealPlan);
    
    return mealPlan;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw new Error('Failed to generate meal plan with AI');
  }
}

function validateMealPlan(plan: any): asserts plan is MealPlan {
  if (!plan.days || !Array.isArray(plan.days)) {
    throw new Error('Invalid meal plan structure: missing days array');
  }
  if (plan.days.length !== 7) {
    throw new Error('Invalid meal plan: must have 7 days');
  }
}

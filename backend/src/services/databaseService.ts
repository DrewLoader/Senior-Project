import { ObjectId } from 'mongodb';
import {
  getMealPlansCollection,
  getMealPreferencesCollection,
} from '../database';

interface MealPreferences {
  dailyCalories: number;
  fitnessGoal: string;
  dietaryRestrictions?: string[];
  mealPreferences?: string[];
}

export async function saveMealPreferences(
  sessionId: string,
  preferences: MealPreferences,
  userId?: string
) {
  const col = getMealPreferencesCollection();
  await col.insertOne({
    session_id: sessionId,
    user_id: userId ? new ObjectId(userId) : undefined,
    daily_calories: preferences.dailyCalories,
    fitness_goal: preferences.fitnessGoal,
    dietary_restrictions: preferences.dietaryRestrictions || [],
    meal_preferences: preferences.mealPreferences || [],
    created_at: new Date(),
  });
}

export async function saveMealPlan(
  sessionId: string,
  mealPlan: Record<string, unknown> | object,
  userId?: string
) {
  const col = getMealPlansCollection();
  const plan = mealPlan as Record<string, unknown>;
  const weekStartDate =
    (plan.weekStartDate as string) ||
    new Date().toISOString().split('T')[0];

  await col.insertOne({
    session_id: sessionId,
    user_id: userId ? new ObjectId(userId) : undefined,
    week_start_date: weekStartDate,
    plan_data: plan,
    created_at: new Date(),
  });
}

export async function getMealPlanBySession(sessionId: string) {
  const col = getMealPlansCollection();
  const doc = await col.findOne(
    { session_id: sessionId },
    { sort: { created_at: -1 } }
  );
  return doc?.plan_data ?? null;
}

export async function getMealPlanByUserId(userId: string) {
  const col = getMealPlansCollection();
  const doc = await col.findOne(
    { user_id: new ObjectId(userId) },
    { sort: { created_at: -1 } }
  );
  return doc?.plan_data ?? null;
}

export async function getMealPlan(sessionId: string, userId?: string) {
  if (userId) {
    const byUser = await getMealPlanByUserId(userId);
    if (byUser) return byUser;
  }
  return getMealPlanBySession(sessionId);
}

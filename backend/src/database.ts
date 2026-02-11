import { MongoClient, Db, Collection } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'mealmate';

let client: MongoClient;
let db: Db;

export interface UserDoc {
  _id?: import('mongodb').ObjectId;
  email: string;
  password_hash: string;
  name: string;
  created_at: Date;
}

export interface MealPreferencesDoc {
  session_id?: string;
  user_id?: import('mongodb').ObjectId;
  daily_calories: number;
  fitness_goal: string;
  dietary_restrictions: string[];
  meal_preferences: string[];
  created_at: Date;
}

export interface MealPlanDoc {
  session_id?: string;
  user_id?: import('mongodb').ObjectId;
  week_start_date: string;
  plan_data: import('mongodb').Document;
  created_at: Date;
}

export async function connectDatabase(): Promise<Db> {
  if (db) return db;
  client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NAME);

  // Indexes
  const users = db.collection<UserDoc>('users');
  await users.createIndex({ email: 1 }, { unique: true });

  const mealPlans = db.collection<MealPlanDoc>('meal_plans');
  await mealPlans.createIndex({ user_id: 1, created_at: -1 });
  await mealPlans.createIndex({ session_id: 1, created_at: -1 });

  const mealPreferences = db.collection<MealPreferencesDoc>('meal_preferences');
  await mealPreferences.createIndex({ user_id: 1, created_at: -1 });
  await mealPreferences.createIndex({ session_id: 1, created_at: -1 });

  console.log('✅ MongoDB connected');
  return db;
}

export function getDb(): Db {
  if (!db) throw new Error('Database not connected. Call connectDatabase() first.');
  return db;
}

export function getUsersCollection(): Collection<UserDoc> {
  return getDb().collection<UserDoc>('users');
}

export function getMealPlansCollection(): Collection<MealPlanDoc> {
  return getDb().collection<MealPlanDoc>('meal_plans');
}

export function getMealPreferencesCollection(): Collection<MealPreferencesDoc> {
  return getDb().collection<MealPreferencesDoc>('meal_preferences');
}

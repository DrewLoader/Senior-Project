import { createContext, useContext, useState, ReactNode } from 'react';
import type { MealPlan } from '../types';

interface MealPlanContextType {
  mealPlan: MealPlan | null;
  sessionId: string | null;
  setMealPlan: (plan: MealPlan | null, sessionId: string | null) => void;
}

const MealPlanContext = createContext<MealPlanContextType | null>(null);

const STORAGE_KEY = 'mealmate_plan';
const SESSION_KEY = 'mealmate_session';

export function MealPlanProvider({ children }: { children: ReactNode }) {
  const [mealPlan, setMealPlanState] = useState<MealPlan | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [sessionId, setSessionId] = useState<string | null>(() => localStorage.getItem(SESSION_KEY));

  const setMealPlan = (plan: MealPlan | null, sid: string | null) => {
    setMealPlanState(plan);
    setSessionId(sid);
    if (plan) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    if (sid) localStorage.setItem(SESSION_KEY, sid);
    else localStorage.removeItem(SESSION_KEY);
  };

  return (
    <MealPlanContext.Provider value={{ mealPlan, sessionId, setMealPlan }}>
      {children}
    </MealPlanContext.Provider>
  );
}

export function useMealPlan() {
  const ctx = useContext(MealPlanContext);
  if (!ctx) throw new Error('useMealPlan must be used within MealPlanProvider');
  return ctx;
}

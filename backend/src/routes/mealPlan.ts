import { Router, Response } from 'express';
import { generateMealPlan } from '../services/aiService';
import { saveMealPreferences, saveMealPlan, getMealPlan } from '../services/databaseService';
import { RequestWithUser } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const mealPlanRequestSchema = z.object({
  dailyCalories: z.number().min(1000).max(5000),
  fitnessGoal: z.enum(['weight_loss', 'muscle_growth', 'maintenance', 'endurance']),
  dietaryRestrictions: z.array(z.string()).optional(),
  mealPreferences: z.array(z.string()).optional(),
  sessionId: z.string().optional(),
});

router.post('/generate', async (req, res) => {
  try {
    const validatedData = mealPlanRequestSchema.parse(req.body);
    const reqWithUser = req as RequestWithUser;
    const userId = reqWithUser.user?.userId;

    const sessionId = validatedData.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await saveMealPreferences(sessionId, validatedData, userId);

    const mealPlan = await generateMealPlan(validatedData);
    await saveMealPlan(sessionId, mealPlan as unknown as Record<string, unknown>, userId);

    res.json({
      success: true,
      sessionId,
      mealPlan,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      });
    }

    console.error('Error generating meal plan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate meal plan',
    });
  }
});

// Latest plan for current user (when logged in) or by sessionId
router.get('/me', async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const mealPlan = await getMealPlan('', req.user.userId);
    if (!mealPlan) {
      return res.status(404).json({ success: false, error: 'Meal plan not found' });
    }
    res.json({ success: true, mealPlan });
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch meal plan' });
  }
});

router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const reqWithUser = req as RequestWithUser;
    const mealPlan = await getMealPlan(sessionId, reqWithUser.user?.userId);

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        error: 'Meal plan not found',
      });
    }

    res.json({
      success: true,
      mealPlan,
    });
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch meal plan',
    });
  }
});

export { router as mealPlanRouter };

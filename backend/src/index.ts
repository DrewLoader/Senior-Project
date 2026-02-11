import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { mealPlanRouter } from './routes/mealPlan';
import { authRouter } from './routes/auth';
import { authMiddleware } from './middleware/auth';
import { connectDatabase } from './database';

// Load .env from backend directory (so it works when run from project root via npm run dev)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/meal-plan', mealPlanRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Meal Prep Planner API is running' });
});

async function start() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

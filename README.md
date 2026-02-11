# Meal Prep Planner 🍽️

An AI-powered web application that generates personalized weekly meal prep plans based on user preferences, calorie targets, and fitness goals.

## Features

- **Personalized Meal Planning**: Generate custom weekly meal plans tailored to your specific needs
- **AI-Powered Recommendations**: Uses OpenAI to create nutritionally balanced meal plans
- **Flexible Preferences**: 
  - Custom daily calorie targets
  - Multiple fitness goals (weight loss, muscle growth, maintenance, endurance)
  - Dietary restrictions support
  - Meal preference customization
- **Comprehensive Meal Details**: 
  - Full nutritional information (calories, protein, carbs, fats)
  - Ingredient lists
  - Step-by-step cooking instructions
  - Prep time estimates
- **Shopping Lists**: Automatically generated shopping lists for the entire week
- **Meal Prep Tips**: Helpful tips for efficient meal preparation
- **Modern UI**: Beautiful, responsive design built with React and Tailwind CSS

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API calls

### Backend
- **Node.js** with **Express**
- **TypeScript** for type safety
- **OpenAI API** for AI-powered meal plan generation
- **MongoDB** for data storage (users, meal plans, preferences)
- **Zod** for request validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- **MongoDB** (local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Senior-Project
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:

Create a `.env` file in the `backend` directory:
```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=mealmate
JWT_SECRET=your_jwt_secret_change_in_production
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```
(Use your MongoDB connection string if not local, e.g. MongoDB Atlas.)

4. Start the development servers:

From the root directory:
```bash
npm run dev
```

This will start both:
- Backend server on `http://localhost:3001`
- Frontend development server on `http://localhost:3000`

Or start them separately:
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
Senior-Project/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server setup
│   │   ├── database.ts            # Database initialization
│   │   ├── routes/
│   │   │   └── mealPlan.ts       # API routes
│   │   └── services/
│   │       ├── aiService.ts      # OpenAI integration
│   │       └── databaseService.ts # Database operations
│   ├── data/                      # SQLite database (created automatically)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── MealPlanForm.tsx  # User input form
│   │   │   └── MealPlanDisplay.tsx # Meal plan visualization
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── types.ts
│   │   └── index.css
│   └── package.json
└── package.json                   # Root workspace config
```

## Usage

1. **Set Your Preferences**:
   - Adjust your daily calorie target using the slider
   - Select your fitness goal
   - Choose any dietary restrictions (optional)
   - Add meal preferences (optional)

2. **Generate Meal Plan**:
   - Click "Generate Meal Plan"
   - Wait for the AI to create your personalized weekly plan

3. **View Your Plan**:
   - Browse meals for each day of the week
   - View detailed nutritional information
   - Check ingredients and cooking instructions
   - Access the shopping list and prep tips

4. **Create New Plan**:
   - Click "Create New Plan" to start over with different preferences

## API Endpoints

### POST `/api/meal-plan/generate`
Generate a new meal plan based on user preferences.

**Request Body:**
```json
{
  "dailyCalories": 2000,
  "fitnessGoal": "weight_loss",
  "dietaryRestrictions": ["Vegetarian", "Gluten-Free"],
  "mealPreferences": ["High Protein", "Quick Prep"]
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "session_1234567890_abc123",
  "mealPlan": { ... }
}
```

### GET `/api/meal-plan/:sessionId`
Retrieve a previously generated meal plan.

## Future Enhancements

- User authentication and account management
- Save and favorite meal plans
- Recipe scaling and serving size adjustments
- Integration with grocery delivery services
- Meal plan sharing and community features
- Nutrition tracking and progress monitoring
- Mobile app version
- Export meal plans to PDF
- Integration with fitness tracking apps

## Contributing

This is a senior project for full-stack web development practice. Feel free to extend and improve upon it!

## License

This project is for educational purposes.

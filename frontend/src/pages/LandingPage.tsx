import { Link } from 'react-router-dom';
import { PublicHeader } from '../components/layout/PublicHeader';
import { Heart, UtensilsCrossed, Sparkles } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50/30">
      <PublicHeader />
      <main>
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 text-primary-200/60">
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                  <path d="M50 10 Q70 40 50 70 Q30 40 50 10 M50 30 Q60 50 50 70 Q40 50 50 30" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                AI-Powered Weekly Meal Prep Made Simple
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Personalized meal plans based on your calories, goals, and preferences.
              </p>
              <Link
                to="/personalize"
                className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-semibold text-lg px-8 py-4 rounded-full transition-colors shadow-lg shadow-primary-200"
              >
                Get Started
              </Link>
            </div>
            <div className="relative flex justify-center items-center">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-72 transform rotate-[-2deg]">
                  <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg flex items-center justify-center text-primary-600 font-medium text-sm">
                    Weekly calendar & meals
                  </div>
                  <p className="text-center text-gray-500 text-xs mt-2">Laptop view</p>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg border border-gray-100 p-3 w-40 transform rotate-[4deg]">
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary-50 to-green-50 rounded-lg flex items-center justify-center text-primary-600 text-xs font-medium">
                    Meal list
                  </div>
                </div>
              </div>
              <div className="absolute -left-4 top-1/2 w-16 h-16 text-primary-300/70 -translate-y-1/2">
                <svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 5 Q90 50 50 95 Q10 50 50 5" /></svg>
              </div>
            </div>
          </div>
        </section>

        {/* Feature highlights */}
        <section className="border-t border-gray-100 bg-white/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary-100 p-4 rounded-full mb-4">
                  <Heart className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Personalized Calorie Goals</h3>
                <p className="text-gray-600 text-sm">Set your daily target and we'll build plans that fit.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary-100 p-4 rounded-full mb-4">
                  <UtensilsCrossed className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Dietary Restrictions Supported</h3>
                <p className="text-gray-600 text-sm">Vegetarian, gluten-free, and more—we've got you.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary-100 p-4 rounded-full mb-4">
                  <Sparkles className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Generated Weekly Plans</h3>
                <p className="text-gray-600 text-sm">One click to a full week of balanced meals.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

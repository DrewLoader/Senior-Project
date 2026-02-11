import { PublicHeader } from '../components/layout/PublicHeader';

export function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50/30">
      <PublicHeader />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Resources</h1>
        <p className="text-gray-600">Tips, guides, and tools for meal prep and nutrition. Coming soon.</p>
      </main>
    </div>
  );
}

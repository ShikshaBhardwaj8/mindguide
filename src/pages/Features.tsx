import React from 'react';
import {
  MessageCircle,
  LineChart,
  Bell,
  Award,
  Shield,
  Moon,
  TrendingUp,
  Users,
  Brain,
  Heart,
  Zap,
  BookOpen,
} from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'AI-Powered Chatbot',
      description:
        'Engage in meaningful conversations with our empathetic AI companion trained on evidence-based therapeutic techniques.',
      color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
    },
    {
      icon: LineChart,
      title: 'Mood Tracking Dashboard',
      description:
        'Visualize your emotional patterns with interactive charts and gain insights into your mental wellness journey.',
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    {
      icon: Bell,
      title: 'Smart Reminders',
      description:
        'Stay on track with personalized reminders for check-ins, meditation, journaling, and self-care activities.',
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    },
    {
      icon: Award,
      title: 'Gamification & Rewards',
      description:
        'Build healthy habits with streak tracking, achievement badges, and milestone celebrations to keep you motivated.',
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description:
        'Your conversations are encrypted and completely private. We never share your data with third parties.',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    },
    {
      icon: Moon,
      title: 'Dark Mode',
      description:
        'Comfortable viewing experience any time of day with seamless dark mode that reduces eye strain.',
      color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description:
        'Export your mood logs and activity data as CSV or PDF to share with healthcare providers.',
      color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    },
    {
      icon: Users,
      title: 'Community Support',
      description:
        'Connect with others on similar journeys through moderated support groups and shared experiences.',
      color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
    },
    {
      icon: Brain,
      title: 'CBT Techniques',
      description:
        'Learn and practice Cognitive Behavioral Therapy techniques with guided exercises and personalized feedback.',
      color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
    },
    {
      icon: Heart,
      title: 'Crisis Resources',
      description:
        'Instant access to crisis hotlines and emergency resources when you need immediate professional help.',
      color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
    },
    {
      icon: Zap,
      title: 'Quick Check-ins',
      description:
        'Express your feelings quickly with mood ratings and brief notes for when you are short on time.',
      color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    },
    {
      icon: BookOpen,
      title: 'Resource Library',
      description:
        'Access curated articles, videos, and exercises on mental health topics tailored to your needs.',
      color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Features Built for Your Wellbeing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            MindGuide combines cutting-edge AI technology with evidence-based mental health
            practices to provide comprehensive support for your wellness journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex p-3 rounded-lg ${feature.color} mb-4`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of users who have improved their mental wellness with MindGuide
          </p>
          <a
            href="/signup"
            className="inline-block bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Free
          </a>
        </div>
      </div>
    </div>
  );
};

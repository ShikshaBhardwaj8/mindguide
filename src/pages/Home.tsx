import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, MessageCircle, LineChart, Award } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Brain className="h-20 w-20 text-teal-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to MindGuide
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Your compassionate AI companion for mental wellness. Get support, track your mood,
            and build healthy habits with personalized guidance available 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="px-8 py-3 bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 border-2 border-teal-600 dark:border-teal-400 rounded-lg hover:bg-teal-50 dark:hover:bg-gray-600 transition-colors font-semibold"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <MessageCircle className="h-12 w-12 text-teal-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              24/7 Support
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Chat anytime with our AI companion for immediate emotional support
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <LineChart className="h-12 w-12 text-teal-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Mood Tracking
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Visualize patterns and gain insights into your emotional wellbeing
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <Award className="h-12 w-12 text-teal-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Gamification
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Stay motivated with streaks, badges, and personalized goals
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <Brain className="h-12 w-12 text-teal-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Evidence-Based
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Built on proven CBT and mindfulness techniques
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

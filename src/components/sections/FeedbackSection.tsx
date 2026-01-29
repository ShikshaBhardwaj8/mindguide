import React, { useState } from 'react';
import { Star, Send, CheckCircle, AlertCircle, ThumbsUp, MessageSquare } from 'lucide-react';

export const FeedbackSection: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { id: 'chatbot', label: 'Chatbot Experience' },
    { id: 'dashboard', label: 'Dashboard & Features' },
    { id: 'exercises', label: 'Exercises & Assessment' },
    { id: 'ui', label: 'Design & Usability' },
    { id: 'other', label: 'Other' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};

    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    if (!feedback.trim()) {
      newErrors.feedback = 'Please provide your feedback';
    } else if (feedback.trim().length < 10) {
      newErrors.feedback = 'Feedback must be at least 10 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setRating(0);
      setCategory('');
      setFeedback('');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Share Your Feedback</h1>
        </div>
        <p className="text-teal-100">
          Your feedback helps us improve MindGuide and serve you better
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-green-600 dark:text-green-400 font-semibold text-sm">
                    Thank you for your feedback!
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                    We appreciate you taking the time to help us improve.
                  </p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-red-600 dark:text-red-400 text-sm">
                  Failed to submit feedback. Please try again.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  How would you rate your experience? *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          star <= (hoveredRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {errors.rating && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.rating}</p>
                )}
                {rating > 0 && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {rating === 5 && 'Excellent! We are so glad you love it!'}
                    {rating === 4 && 'Great! Thanks for the positive feedback!'}
                    {rating === 3 && 'Good! We will work on making it better!'}
                    {rating === 2 && 'We are sorry to hear that. Please tell us more.'}
                    {rating === 1 && 'We apologize. Your feedback will help us improve.'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  What would you like to give feedback about? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        category === cat.id
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Feedback *
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={6}
                  className={`w-full px-4 py-3 border ${
                    errors.feedback ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-none`}
                  placeholder="Tell us about your experience, suggestions, or any issues you encountered..."
                />
                {errors.feedback && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.feedback}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {feedback.length} characters
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white py-3 rounded-lg hover:from-teal-700 hover:to-teal-600 transition-all shadow-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
            <ThumbsUp className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
            <p className="text-teal-100 text-sm">
              Your feedback is invaluable in helping us create a better mental health support
              experience.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              What We Do With Your Feedback
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <span className="text-teal-600 dark:text-teal-400 mr-2">•</span>
                <span>Review and prioritize feature requests</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 dark:text-teal-400 mr-2">•</span>
                <span>Identify and fix issues quickly</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 dark:text-teal-400 mr-2">•</span>
                <span>Improve user experience continuously</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 dark:text-teal-400 mr-2">•</span>
                <span>Make data-driven product decisions</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Recent Improvements
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  Added guided breathing exercises
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  Improved chat response time
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">Enhanced dark mode support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Brain,
  Heart,
  Activity,
  Wind,
  CheckCircle,
  Play,
  ChevronRight,
} from 'lucide-react';

interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  icon: React.ElementType;
  color: string;
  steps: string[];
}

export const AssessmentSection: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const exercises: Exercise[] = [
    {
      id: 'breathing',
      title: 'Deep Breathing',
      description: 'Calm your mind and reduce anxiety with guided breathing exercises',
      duration: '5 min',
      category: 'Relaxation',
      icon: Wind,
      color: 'from-cyan-500 to-blue-500',
      steps: [
        'Find a comfortable seated position',
        'Close your eyes and relax your shoulders',
        'Breathe in slowly through your nose for 4 counts',
        'Hold your breath for 4 counts',
        'Exhale slowly through your mouth for 6 counts',
        'Repeat this cycle 5 times',
      ],
    },
    {
      id: 'gratitude',
      title: 'Gratitude Journal',
      description: 'Shift your focus to positive aspects of your life',
      duration: '10 min',
      category: 'Mindfulness',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      steps: [
        'Get a notebook or open a digital document',
        'Write down 3 things you are grateful for today',
        'For each item, write why it makes you grateful',
        'Reflect on how these things make you feel',
        'Notice any shift in your mood',
      ],
    },
    {
      id: 'body-scan',
      title: 'Body Scan Meditation',
      description: 'Connect with your body and release physical tension',
      duration: '15 min',
      category: 'Meditation',
      icon: Activity,
      color: 'from-teal-500 to-green-500',
      steps: [
        'Lie down in a comfortable position',
        'Close your eyes and take three deep breaths',
        'Focus your attention on your toes',
        'Slowly move your attention up through your body',
        'Notice any tension and consciously relax each area',
        'End by taking three more deep breaths',
      ],
    },
    {
      id: 'thought-record',
      title: 'Thought Record',
      description: 'Challenge negative thinking patterns using CBT techniques',
      duration: '10 min',
      category: 'CBT',
      icon: Brain,
      color: 'from-purple-500 to-indigo-500',
      steps: [
        'Identify a negative thought you had today',
        'Write down the situation that triggered it',
        'Rate the intensity of the emotion (1-10)',
        'Challenge the thought: Is it 100% true?',
        'Write an alternative, balanced thought',
        'Rate your emotion intensity now',
      ],
    },
  ];

  const handleStartExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCurrentStep(0);
  };

  const handleCompleteExercise = () => {
    if (selectedExercise && !completedExercises.includes(selectedExercise.id)) {
      setCompletedExercises([...completedExercises, selectedExercise.id]);
    }
    setSelectedExercise(null);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (selectedExercise && currentStep < selectedExercise.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (selectedExercise) {
    const Icon = selectedExercise.icon;
    const progress = ((currentStep + 1) / selectedExercise.steps.length) * 100;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedExercise(null)}
          className="text-teal-600 dark:text-teal-400 hover:underline mb-4"
        >
          ← Back to Exercises
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className={`bg-gradient-to-r ${selectedExercise.color} p-6 text-white`}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedExercise.title}</h2>
                <p className="text-white/80">{selectedExercise.category}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-white rounded-full h-3 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <p className="text-sm text-teal-600 dark:text-teal-400 font-medium mb-2">
                Step {currentStep + 1} of {selectedExercise.steps.length}
              </p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {selectedExercise.steps[currentStep]}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Take your time with this step. When you're ready, move to the next one.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {currentStep === selectedExercise.steps.length - 1 ? (
                <button
                  onClick={handleCompleteExercise}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg hover:from-teal-700 hover:to-teal-600 transition-all shadow-md"
                >
                  Complete Exercise
                </button>
              ) : (
                <button
                  onClick={handleNextStep}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg hover:from-teal-700 hover:to-teal-600 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Next Step
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Mental Wellness Exercises</h1>
        <p className="text-teal-100">
          Practice evidence-based exercises to improve your mental health
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Your Progress
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Exercises Completed</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {completedExercises.length} / {exercises.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-full h-3 transition-all duration-500"
                style={{
                  width: `${(completedExercises.length / exercises.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-teal-600 dark:text-teal-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exercises.map((exercise) => {
          const Icon = exercise.icon;
          const isCompleted = completedExercises.includes(exercise.id);

          return (
            <div
              key={exercise.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className={`bg-gradient-to-r ${exercise.color} p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  {isCompleted && (
                    <div className="bg-white text-teal-600 rounded-full p-1">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{exercise.title}</h3>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <span>{exercise.category}</span>
                  <span>•</span>
                  <span>{exercise.duration}</span>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-6">{exercise.description}</p>
                <button
                  onClick={() => handleStartExercise(exercise)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg hover:from-teal-700 hover:to-teal-600 transition-all shadow-md"
                >
                  <Play className="h-5 w-5" />
                  {isCompleted ? 'Practice Again' : 'Start Exercise'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

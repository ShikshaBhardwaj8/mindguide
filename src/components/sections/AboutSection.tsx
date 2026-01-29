import React from 'react';
import { Brain, Heart, Shield, Users, Award, Target } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Clinical Psychologist',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Expert in CBT and mindfulness-based therapies',
    },
    {
      name: 'Michael Chen',
      role: 'AI Engineer',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Specializes in conversational AI and NLP',
    },
    {
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Passionate about accessible, user-centered design',
    },
    {
      name: 'David Kim',
      role: 'Product Manager',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Dedicated to mental health innovation',
    },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Compassionate Care',
      description: 'Built with empathy at its core, providing supportive, non-judgmental conversations',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your conversations are private and secure with end-to-end encryption',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      title: 'Expert-Backed',
      description: 'Developed with mental health professionals and evidence-based practices',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Target,
      title: 'Goal-Oriented',
      description: 'Personalized goals and progress tracking for your mental wellness journey',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Award,
      title: 'Proven Results',
      description: 'Trusted by thousands with measurable improvements in mental wellbeing',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: Brain,
      title: 'Evidence-Based',
      description: 'Grounded in cognitive behavioral therapy and mindfulness techniques',
      color: 'from-teal-500 to-emerald-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-center mb-4">
          <Brain className="h-16 w-16" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-4">About MindGuide</h1>
        <p className="text-center text-teal-100 text-lg max-w-3xl mx-auto">
          We're on a mission to make mental health support accessible, affordable, and available
          to everyone, everywhere.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((value, index) => {
          const Icon = value.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${value.color} mb-4`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{value.description}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Our Mission
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Mental health challenges affect millions of people worldwide, yet many face barriers to
            accessing professional support. Long wait times, high costs, stigma, and limited
            availability create gaps in care that leave people struggling alone.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            MindGuide bridges this gap by providing immediate, accessible mental health support
            through artificial intelligence. Our chatbot offers a safe, judgment-free space where
            users can explore their feelings, learn coping strategies, and build emotional
            resilience.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            While MindGuide is not a replacement for professional therapy, it serves as a valuable
            complement to traditional mental health care, providing support during difficult moments
            and helping users develop healthy mental wellness habits.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-teal-600 dark:text-teal-400 text-sm font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

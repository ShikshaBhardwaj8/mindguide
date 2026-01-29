import React from 'react';
import { Brain, Heart, Shield, Users } from 'lucide-react';

export const About: React.FC = () => {
  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Clinical Psychologist',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      name: 'Michael Chen',
      role: 'AI Engineer',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      name: 'David Kim',
      role: 'Product Manager',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <Brain className="h-16 w-16 text-teal-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About MindGuide</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We're on a mission to make mental health support accessible, affordable, and available
            to everyone, everywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-lg">
            <Heart className="h-12 w-12 text-teal-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Compassionate Care
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Built with empathy at its core, our AI provides supportive, non-judgmental
              conversations
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-lg">
            <Shield className="h-12 w-12 text-teal-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Privacy First
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your conversations are private and secure, with end-to-end encryption protecting your
              data
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-lg">
            <Users className="h-12 w-12 text-teal-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Expert-Backed
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Developed in collaboration with mental health professionals and evidence-based
              practices
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-16 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            Mental health challenges affect millions of people worldwide, yet many face barriers to
            accessing professional support. Long wait times, high costs, stigma, and limited
            availability create gaps in care that leave people struggling alone.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            MindGuide bridges this gap by providing immediate, accessible mental health support
            through artificial intelligence. Our chatbot offers a safe, judgment-free space where
            users can explore their feelings, learn coping strategies, and build emotional
            resilience.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            While MindGuide is not a replacement for professional therapy, it serves as a valuable
            complement to traditional mental health care, providing support during difficult moments
            and helping users develop healthy mental wellness habits.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

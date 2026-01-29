import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { HomeSection } from '../components/sections/HomeSection';
import { ChatSection } from '../components/sections/ChatSection';
import { AboutSection } from '../components/sections/AboutSection';
import { AssessmentSection } from '../components/sections/AssessmentSection';
import { ContactSection } from '../components/sections/ContactSection';
import { FeedbackSection } from '../components/sections/FeedbackSection';

export const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection />;
      case 'chat':
        return <ChatSection />;
      case 'about':
        return <AboutSection />;
      case 'assessment':
        return <AssessmentSection />;
      case 'contact':
        return <ContactSection />;
      case 'feedback':
        return <FeedbackSection />;
      default:
        return <HomeSection />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <DashboardSidebar
          activeSection={activeSection}
          onSectionChange={(section) => {
            setActiveSection(section);
            setIsSidebarOpen(false);
          }}
        />
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">MindGuide</h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isSidebarOpen ? (
                <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">{renderSection()}</div>
      </main>
    </div>
  );
};

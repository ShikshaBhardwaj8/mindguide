import React, { useEffect, useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Activity, TrendingUp, Award, Download, Target, Zap } from 'lucide-react';
import { StatsCard } from '../StatsCard';
import { dashboardAPI } from '../../services/api';
import { DashboardStats, MoodLog } from '../../types';
import { exportToCSV, exportToPDF } from '../../utils/export';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const HomeSection: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [statsData, logsData] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getMoodLogs(),
        ]);
        setStats(statsData);
        setMoodLogs(logsData);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredLogs = timeRange === 'week' ? moodLogs.slice(-7) : moodLogs;

  const lineChartData = {
    labels: filteredLogs.map((log) => {
      const date = new Date(log.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Mood Score',
        data: filteredLogs.map((log) => log.mood),
        borderColor: 'rgb(13, 148, 136)',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const activityDistribution = {
    meditation: 0,
    exercise: 0,
    journaling: 0,
    therapy: 0,
  };

  moodLogs.forEach((log) => {
    if (log.activity && log.activity in activityDistribution) {
      activityDistribution[log.activity as keyof typeof activityDistribution]++;
    }
  });

  const doughnutData = {
    labels: ['Meditation', 'Exercise', 'Journaling', 'Therapy'],
    datasets: [
      {
        data: [
          activityDistribution.meditation,
          activityDistribution.exercise,
          activityDistribution.journaling,
          activityDistribution.therapy,
        ],
        backgroundColor: [
          'rgba(13, 148, 136, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome Back!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's your mental wellness journey overview
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Sessions"
          value={stats?.totalSessions || 0}
          icon={Activity}
          color="bg-gradient-to-br from-teal-500 to-teal-600"
        />
        <StatsCard
          title="Current Streak"
          value={`${stats?.currentStreak || 0} days`}
          icon={TrendingUp}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatsCard
          title="Badges Earned"
          value={stats?.badgesEarned || 0}
          icon={Award}
          color="bg-gradient-to-br from-amber-500 to-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                Mood Trends
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Track your emotional patterns over time
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
              <button
                onClick={() => setTimeRange('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === 'week'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === 'month'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Month
              </button>
            </div>
          </div>
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => exportToCSV(moodLogs, 'mindguide-mood-logs.csv')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={() => exportToPDF(moodLogs, 'mindguide-mood-logs.pdf')}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Activity Distribution
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Your wellness activities breakdown
          </p>
          <div className="h-48 flex items-center justify-center">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                    labels: {
                      padding: 10,
                      font: { size: 11 },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Daily Goal</h3>
              <p className="text-teal-100 text-sm">Keep your streak going!</p>
            </div>
            <Target className="h-8 w-8 text-teal-200" />
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress Today</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-teal-400 rounded-full h-3">
              <div className="bg-white rounded-full h-3 w-3/4"></div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Weekly Challenge</h3>
              <p className="text-blue-100 text-sm">Complete 5 sessions this week</p>
            </div>
            <Zap className="h-8 w-8 text-blue-200" />
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Sessions Completed</span>
              <span>3/5</span>
            </div>
            <div className="w-full bg-blue-400 rounded-full h-3">
              <div className="bg-white rounded-full h-3 w-3/5"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          {filteredLogs.slice(-5).reverse().map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
            >
              <div>
                <p className="text-gray-900 dark:text-white font-medium">
                  {new Date(log.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Activity: <span className="font-medium">{log.activity || 'N/A'}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Mood</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {log.mood}/5
                  </p>
                </div>
                <div className="text-4xl">{['😢', '😕', '😐', '🙂', '😊'][log.mood - 1]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

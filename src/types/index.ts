export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'delivered' | 'failed';
}

export interface MoodLog {
  id: string;
  date: string;
  mood: number;
  activity?: string;
}

export interface DashboardStats {
  totalSessions: number;
  currentStreak: number;
  badgesEarned: number;
  lastSessionDate: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

import axios from 'axios';
import { DashboardStats, MoodLog, Message, ContactFormData } from '../types';

// ================= BASE URL =================
const API_BASE_URL = 'http://localhost/mindguide/php/api';


// ================= AXIOS INSTANCE =================
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================= AUTH API =================
export const authAPI = {
  signup: async (email: string, password: string, name: string) => {
    const res = await axios.post(`${API_BASE_URL}/signup.php`, {
      email,
      password,
      name,
    });
    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await axios.post(`${API_BASE_URL}/login.php`, {
      email,
      password,
    });
    return res.data;
  },

  logout: async (userId: string) => {
    const res = await axios.post(`${API_BASE_URL}/logout.php`, {
      user_id: userId,
    });
    return res.data;
  },
};

// ================= DASHBOARD API =================
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const userId = localStorage.getItem('userId') || '1';
    const res = await axios.get(
      `${API_BASE_URL}/get_stats.php?user_id=${userId}`
    );
    return res.data;
  },

  getMoodLogs: async (): Promise<MoodLog[]> => {
    const userId = localStorage.getItem('userId') || '1';
    const res = await axios.get(
      `${API_BASE_URL}/get_mood_logs.php?user_id=${userId}`
    );
    return res.data;
  },
};

// ================= CHAT API =================
export const chatAPI = {
  sendMessage: async (content: string): Promise<Message> => {
    const userId = localStorage.getItem('userId') || '1';
    const conversationId = localStorage.getItem('conversationId') || '1';

    const res = await axios.post(
      `${API_BASE_URL}/send_message.php`,
      {
        user_id: userId,
        conversation_id: conversationId,
        content: content,
      }
    );

    return {
      id: res.data.bot_message.id,
      content: res.data.bot_message.content,
      sender: 'bot',
      timestamp: new Date(res.data.bot_message.timestamp),
      status: res.data.bot_message.status,
    };
  },

  getHistory: async (): Promise<Message[]> => {
    const userId = localStorage.getItem('userId') || '1';
    const conversationId = localStorage.getItem('conversationId') || '1';

    const res = await axios.get(
      `${API_BASE_URL}/get_chats.php?user_id=${userId}&conversation_id=${conversationId}`
    );

    return res.data.map((msg: any) => ({
      id: msg.id,
      content: msg.content,
      sender: msg.sender,
      timestamp: new Date(msg.timestamp),
      status: msg.status,
    }));
  },
};

// ================= CONTACT API =================
export const contactAPI = {
  submit: async (data: ContactFormData) => {
    const res = await axios.post(`${API_BASE_URL}/contact.php`, data);
    return res.data;
  },
};

export default api;

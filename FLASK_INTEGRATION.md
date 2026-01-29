# Flask Backend Integration Guide

This document provides detailed instructions for integrating the MindGuide frontend with a Flask backend.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Development Setup](#development-setup)
3. [API Endpoints to Implement](#api-endpoints-to-implement)
4. [Authentication Flow](#authentication-flow)
5. [Database Schema Recommendations](#database-schema-recommendations)
6. [CORS Configuration](#cors-configuration)
7. [Production Deployment](#production-deployment)
8. [Testing](#testing)

## Architecture Overview

The frontend is a Single Page Application (SPA) built with React. It communicates with the backend via RESTful API calls. Two deployment options are available:

### Option 1: Separate Servers (Recommended for Development)
- Frontend: React dev server on `http://localhost:5173`
- Backend: Flask API on `http://localhost:5000`
- CORS enabled for cross-origin requests

### Option 2: Flask Serves Everything (Recommended for Production)
- Flask serves both API endpoints and built React files
- React app built to `dist/` directory
- Flask serves static files and handles routing

## Development Setup

### 1. Flask Project Structure

```
flask-backend/
├── app.py                  # Main Flask application
├── config.py               # Configuration settings
├── requirements.txt        # Python dependencies
├── models/                 # Database models
│   ├── user.py
│   ├── message.py
│   └── mood_log.py
├── routes/                 # API route handlers
│   ├── auth.py
│   ├── chat.py
│   └── dashboard.py
└── utils/                  # Helper functions
    ├── validators.py
    └── ai_chatbot.py
```

### 2. Install Flask Dependencies

```bash
pip install flask flask-cors flask-sqlalchemy flask-jwt-extended python-dotenv
```

### 3. Basic Flask App Setup

```python
# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mindguide.db'

CORS(app, supports_credentials=True)
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Import routes
from routes import auth, chat, dashboard

app.register_blueprint(auth.bp, url_prefix='/api/auth')
app.register_blueprint(chat.bp, url_prefix='/api/chat')
app.register_blueprint(dashboard.bp, url_prefix='/api/dashboard')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

## API Endpoints to Implement

### Authentication Routes (`/api/auth`)

#### POST /api/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Email already exists"
}
```

**Implementation:**
```python
# routes/auth.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User
from app import db

bp = Blueprint('auth', __name__)

@bp.route('/signup', methods=['POST'])
def signup():
    data = request.json

    # Validate input
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400

    # Check if user exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400

    # Create user
    hashed_password = generate_password_hash(data['password'])
    user = User(
        email=data['email'],
        password=hashed_password,
        name=data.get('name', '')
    )

    db.session.add(user)
    db.session.commit()

    # Create JWT token
    token = create_access_token(identity=user.id)

    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.name
        }
    }), 201
```

#### POST /api/auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Implementation:**
```python
@bp.route('/login', methods=['POST'])
def login():
    data = request.json

    user = User.query.filter_by(email=data.get('email')).first()

    if not user or not check_password_hash(user.password, data.get('password')):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = create_access_token(identity=user.id)

    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.name
        }
    }), 200
```

#### POST /api/auth/logout
Invalidate user session (optional - JWT tokens are stateless).

**Response (200 OK):**
```json
{
  "success": true
}
```

### Dashboard Routes (`/api/dashboard`)

#### GET /api/dashboard/stats
Get user statistics for dashboard.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "totalSessions": 42,
  "currentStreak": 7,
  "badgesEarned": 5,
  "lastSessionDate": "2024-01-15T10:30:00Z"
}
```

**Implementation:**
```python
# routes/dashboard.py
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.mood_log import MoodLog

bp = Blueprint('dashboard', __name__)

@bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Calculate stats
    total_sessions = MoodLog.query.filter_by(user_id=user_id).count()
    current_streak = user.calculate_streak()
    badges_earned = user.badges_count
    last_session = MoodLog.query.filter_by(user_id=user_id).order_by(MoodLog.created_at.desc()).first()

    return jsonify({
        'totalSessions': total_sessions,
        'currentStreak': current_streak,
        'badgesEarned': badges_earned,
        'lastSessionDate': last_session.created_at.isoformat() if last_session else None
    }), 200
```

#### GET /api/dashboard/mood-logs
Get user's mood tracking history.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `days` (optional): Number of days to fetch (default: 30)

**Response (200 OK):**
```json
[
  {
    "id": "log-uuid",
    "date": "2024-01-15",
    "mood": 4,
    "activity": "meditation"
  },
  {
    "id": "log-uuid-2",
    "date": "2024-01-14",
    "mood": 3,
    "activity": "exercise"
  }
]
```

**Implementation:**
```python
@bp.route('/mood-logs', methods=['GET'])
@jwt_required()
def get_mood_logs():
    user_id = get_jwt_identity()
    days = request.args.get('days', 30, type=int)

    from_date = datetime.now() - timedelta(days=days)
    logs = MoodLog.query.filter(
        MoodLog.user_id == user_id,
        MoodLog.created_at >= from_date
    ).order_by(MoodLog.created_at.asc()).all()

    return jsonify([{
        'id': log.id,
        'date': log.created_at.date().isoformat(),
        'mood': log.mood,
        'activity': log.activity
    } for log in logs]), 200
```

### Chat Routes (`/api/chat`)

#### POST /api/chat/send
Send a message to the chatbot and receive a response.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "content": "I'm feeling anxious today"
}
```

**Response (200 OK):**
```json
{
  "id": "message-uuid",
  "content": "I understand you're feeling anxious. Would you like to talk about what's making you feel this way?",
  "sender": "bot",
  "timestamp": "2024-01-15T10:30:00Z",
  "status": "delivered"
}
```

**Implementation:**
```python
# routes/chat.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.message import Message
from utils.ai_chatbot import generate_response
from app import db

bp = Blueprint('chat', __name__)

@bp.route('/send', methods=['POST'])
@jwt_required()
def send_message():
    user_id = get_jwt_identity()
    data = request.json

    # Save user message
    user_message = Message(
        user_id=user_id,
        content=data['content'],
        sender='user'
    )
    db.session.add(user_message)

    # Generate bot response using AI
    bot_response_text = generate_response(data['content'], user_id)

    # Save bot message
    bot_message = Message(
        user_id=user_id,
        content=bot_response_text,
        sender='bot'
    )
    db.session.add(bot_message)
    db.session.commit()

    return jsonify({
        'id': bot_message.id,
        'content': bot_message.content,
        'sender': 'bot',
        'timestamp': bot_message.created_at.isoformat(),
        'status': 'delivered'
    }), 200
```

#### GET /api/chat/history
Get chat message history.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `limit` (optional): Number of messages to fetch (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response (200 OK):**
```json
[
  {
    "id": "msg-1",
    "content": "Hello! How are you feeling today?",
    "sender": "bot",
    "timestamp": "2024-01-15T10:00:00Z",
    "status": "delivered"
  },
  {
    "id": "msg-2",
    "content": "I'm feeling a bit anxious",
    "sender": "user",
    "timestamp": "2024-01-15T10:01:00Z",
    "status": "delivered"
  }
]
```

### Contact Route

#### POST /api/contact
Submit a contact form message.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about features",
  "message": "I would like to know more about..."
}
```

**Response (200 OK):**
```json
{
  "success": true
}
```

## Authentication Flow

### 1. Frontend Login Process

```typescript
// In AuthContext.tsx
const login = async (email: string, password: string) => {
  const response = await authAPI.login(email, password);
  const { token, user } = response.data;

  localStorage.setItem('authToken', token);
  localStorage.setItem('authUser', JSON.stringify(user));

  setToken(token);
  setUser(user);
};
```

### 2. Token Storage Options

#### Option A: localStorage (Current Implementation)
- Simple to implement
- Accessible from JavaScript
- Vulnerable to XSS attacks
- Good for development

#### Option B: HTTP-only Cookies (Recommended for Production)
- More secure
- Not accessible from JavaScript
- Protected against XSS
- Requires backend cookie management

**To switch to cookies:**

Flask backend:
```python
from flask import make_response

@app.route('/api/auth/login', methods=['POST'])
def login():
    # ... authenticate user ...

    response = make_response(jsonify({'user': user_data}))
    response.set_cookie(
        'token',
        token,
        httponly=True,
        secure=True,  # HTTPS only
        samesite='Strict',
        max_age=86400  # 24 hours
    )
    return response
```

Frontend updates:
```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true  // Send cookies with requests
});

// Remove Authorization header interceptor
// Cookies will be sent automatically
```

### 3. Protected Routes

All requests to protected endpoints must include the JWT token:

```typescript
// Already implemented in src/services/api.ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Database Schema Recommendations

### Users Table
```python
# models/user.py
from datetime import datetime
from app import db

class User(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    badges_count = db.Column(db.Integer, default=0)

    messages = db.relationship('Message', backref='user', lazy=True)
    mood_logs = db.relationship('MoodLog', backref='user', lazy=True)

    def calculate_streak(self):
        # Calculate current streak of consecutive days with mood logs
        pass
```

### Messages Table
```python
# models/message.py
class Message(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    sender = db.Column(db.String(10), nullable=False)  # 'user' or 'bot'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

### Mood Logs Table
```python
# models/mood_log.py
class MoodLog(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    mood = db.Column(db.Integer, nullable=False)  # 1-5 scale
    activity = db.Column(db.String(50))  # meditation, exercise, journaling, therapy
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

## CORS Configuration

For development with separate servers:

```python
from flask_cors import CORS

CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})
```

## Production Deployment

### 1. Build React Frontend

```bash
cd frontend
npm run build
```

### 2. Serve from Flask

```python
# app.py
import os
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='../frontend/dist')

# API routes first
from routes import auth, chat, dashboard
app.register_blueprint(auth.bp, url_prefix='/api/auth')
app.register_blueprint(chat.bp, url_prefix='/api/chat')
app.register_blueprint(dashboard.bp, url_prefix='/api/dashboard')

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run()
```

### 3. Environment Variables

```bash
# .env
FLASK_ENV=production
SECRET_KEY=your-very-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
DATABASE_URL=postgresql://user:pass@localhost/mindguide
```

## Testing

### Test API Endpoints with curl

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Get Dashboard Stats (requires token from login)
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Frontend API Base URL

```typescript
// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

## Chatbot AI Integration

Integrate with an AI service for chatbot responses:

### Option 1: OpenAI GPT
```python
# utils/ai_chatbot.py
import openai

def generate_response(user_message, user_id):
    # Get conversation history
    history = get_conversation_history(user_id)

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a compassionate mental health chatbot..."},
            *history,
            {"role": "user", "content": user_message}
        ]
    )

    return response.choices[0].message.content
```

### Option 2: Local Model
```python
from transformers import pipeline

chatbot = pipeline("conversational", model="microsoft/DialoGPT-medium")

def generate_response(user_message, user_id):
    response = chatbot(user_message)
    return response[0]['generated_text']
```

## Summary

This integration guide provides everything needed to connect the MindGuide frontend with a Flask backend. The frontend is fully functional with mock data and ready for immediate backend integration. All API endpoints are clearly documented with request/response formats and implementation examples.

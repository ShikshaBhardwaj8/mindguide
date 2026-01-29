# MindGuide - Mental Health Chatbot Frontend

A complete, production-quality frontend for a Mental Health Chatbot built with React, TypeScript, Vite, and Tailwind CSS. This project is designed to be drop-in ready for later Flask backend integration.

## Features

### Authentication
- **Signup, Login, and Logout** - Fully responsive authentication pages with modern design
- **Client-side Validation** - Email format validation, password strength requirements, and confirm password matching
- **Error Handling** - Clear success/error messages and validation feedback
- **Mock State Management** - Authentication state stored in context + localStorage (ready for backend integration)

### Dashboard
- **Interactive Charts** - Mood tracking visualization using Chart.js with weekly/monthly toggles
- **Stats Cards** - Total sessions, current streak, badges earned, last session date
- **Theme Toggle** - Light/Dark mode with persistence in localStorage
- **Data Export** - Export mood logs to CSV and PDF formats (client-side generation)
- **Recent Activity** - Display recent mood logs with emoji indicators

### Chat Interface
- **Modern Chat UI** - User messages on right, bot on left, with timestamps
- **Message Status** - Visual indicators for sending/delivered/failed states
- **Scrollable Area** - Auto-scroll to latest messages
- **Input Features** - Emoji picker, send button, Enter-to-send, attachment placeholder
- **Real-time Interaction** - Simulated bot responses with realistic delays

### Additional Pages
- **Home** - Landing page with feature highlights and call-to-action
- **About Us** - Team cards with photos and mission statement
- **Contact Us** - Contact form with validation
- **Features** - Comprehensive feature grid with icons and descriptions

### UI/UX
- **Mobile-First Responsive Design** - Works seamlessly on all device sizes
- **Tailwind CSS Styling** - Consistent color palette and spacing
- **Dark Mode Support** - Full dark theme with smooth transitions
- **Smooth Animations** - Hover effects and transitions throughout
- **Accessible** - Semantic HTML and proper ARIA attributes
- **Google Fonts** - Inter font for modern typography
- **Lucide React Icons** - Comprehensive icon library

## Technology Stack

- **React 18** - Latest version with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Chart.js + react-chartjs-2** - Interactive charts
- **Axios** - HTTP client (ready for API integration)
- **emoji-picker-react** - Emoji picker component
- **jsPDF** - PDF generation for exports
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository or extract the project files

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation bar with theme toggle
│   ├── StatsCard.tsx   # Dashboard statistics card
│   └── ProtectedRoute.tsx # Route protection wrapper
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication state management
│   └── ThemeContext.tsx # Theme (light/dark) management
├── pages/              # Route page components
│   ├── Home.tsx        # Landing page
│   ├── Login.tsx       # Login page
│   ├── Signup.tsx      # Registration page
│   ├── Dashboard.tsx   # User dashboard with charts
│   ├── Chat.tsx        # Chat interface
│   ├── About.tsx       # About us page
│   ├── Contact.tsx     # Contact form page
│   └── Features.tsx    # Features showcase
├── services/           # API and external services
│   └── api.ts          # Mock API with dummy endpoints
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
├── utils/              # Utility functions
│   ├── validation.ts   # Form validation helpers
│   └── export.ts       # CSV and PDF export functions
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Mock API Endpoints

The application uses mock API endpoints that simulate backend responses. These are defined in `src/services/api.ts`:

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Dashboard
- `GET /api/dashboard/stats` - Fetch user statistics
- `GET /api/dashboard/mood-logs` - Fetch mood tracking data

### Chat
- `POST /api/chat/send` - Send a message and receive bot response
- `GET /api/chat/history` - Fetch chat message history

### Contact
- `POST /api/contact` - Submit contact form

## Flask Integration Guide

### Option 1: Serve Built Files from Flask

1. Build the React app:
```bash
npm run build
```

2. Copy the `dist/` directory contents to your Flask `static/` directory

3. In your Flask app, serve the built files:
```python
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='static')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')
```

### Option 2: Separate Frontend and Backend (Recommended for Development)

1. Keep the React dev server running on `http://localhost:5173`
2. Run Flask backend on `http://localhost:5000`
3. Update API base URL in `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

4. Enable CORS in Flask:
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
```

### Backend API Implementation

Replace the mock functions in `src/services/api.ts` with real API calls once your Flask backend is ready. The current implementation returns mock data with simulated delays.

#### Authentication Example

Flask backend:
```python
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    # Validate credentials
    # Generate JWT token
    return jsonify({'token': token, 'user': user_data})
```

Frontend (already implemented in `AuthContext.tsx`):
```typescript
// Update the login function to use real API
const response = await authAPI.login(email, password);
```

#### Switching from localStorage to Secure Cookies

For production, consider using secure HTTP-only cookies instead of localStorage for tokens:

Flask:
```python
from flask import make_response

@app.route('/api/auth/login', methods=['POST'])
def login():
    # Authenticate user
    response = make_response(jsonify({'user': user_data}))
    response.set_cookie('token', token, httponly=True, secure=True, samesite='Strict')
    return response
```

Frontend:
```typescript
// Remove localStorage token storage
// Axios will automatically send cookies
api.defaults.withCredentials = true;
```

## Environment Variables

Create a `.env.local` file for environment-specific configuration:

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=MindGuide
```

Access in code:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
```

## User Authentication Flow

1. User visits the app (unauthenticated)
2. Navbar shows: Home, About, Features, Contact, Login, Sign Up
3. User signs up or logs in
4. Token and user data stored in AuthContext + localStorage
5. User redirected to Dashboard
6. Protected routes (Dashboard, Chat) are now accessible
7. Navbar updates to show: Dashboard, Chat, Features, user name, Logout

## Customization

### Colors

The app uses a teal color scheme. To change colors, update Tailwind classes:
- Primary: `teal-600` → your color (e.g., `blue-600`)
- Update in: buttons, links, icons, charts

### Theme

Default theme is light. Dark mode can be toggled via the moon/sun icon in the navbar. Theme preference is saved to localStorage.

### Mock Data

Mock data for charts and stats is generated in `src/services/api.ts`. Customize the data ranges, values, and response delays as needed.

## Accessibility

- Semantic HTML elements
- ARIA labels where appropriate
- Keyboard navigation support
- Focus indicators
- Color contrast ratios meet WCAG AA standards
- Responsive text sizing

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Code splitting by route
- Lazy loading of components
- Optimized image loading (using external Pexels links)
- Minimal bundle size
- Fast dev server with HMR

## Security Considerations

- Client-side validation only (implement server-side validation in Flask)
- XSS protection via React's JSX escaping
- CSRF tokens should be implemented in Flask
- Secure cookies for production
- HTTPS required for production

## Future Enhancements

- Real-time chat with WebSockets
- Push notifications for reminders
- Progressive Web App (PWA) support
- Multi-language support (i18n)
- Advanced analytics dashboard
- Integration with mental health APIs
- Video/voice call support
- Community features

## License

This project is provided as-is for educational and development purposes.

## Support

For issues or questions, use the Contact form in the app or reach out to the development team.

---

**Note**: This is a frontend-only application with mock data. All API endpoints return simulated responses. Integrate with a real Flask backend to enable full functionality.

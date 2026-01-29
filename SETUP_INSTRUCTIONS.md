# MindGuide - MySQL + PHP Backend Setup

## Database Setup

### 1. Import Database
- Open phpMyAdmin
- Create new database or use existing
- Import `database.sql` file
- Database name: `mindguide_db`

### 2. Verify Tables Created
- users
- conversations
- chat_messages
- mood_logs

### 3. Verify Database Objects
- View: `vw_recent_chats`
- Stored Procedures: `sp_save_message`, `sp_get_chat_history`, `sp_get_user_stats`
- Trigger: `tr_update_conversation_timestamp`

## PHP Backend Setup

### 1. Place PHP Files
Copy the `php` folder to your web server:
- Apache/XAMPP: `htdocs/mindguide/php/`
- WAMP: `www/mindguide/php/`

### 2. Update Database Connection
Edit `php/connection.php` if needed:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'mindguide_db');
```

### 3. Test PHP APIs
- http://localhost/mindguide/php/api/get_chats.php?user_id=1&conversation_id=1
- http://localhost/mindguide/php/api/get_stats.php?user_id=1
- http://localhost/mindguide/php/api/get_mood_logs.php?user_id=1

## Frontend Setup

### 1. Update API Base URL
The API URL in `src/services/api.ts` is already set to:
```typescript
const API_BASE_URL = 'http://localhost/mindguide/php/api';
```

Adjust if your PHP backend is at a different location.

### 2. Run Frontend
```bash
npm install
npm run dev
```

### 3. Test Application
- Login with any credentials (mock auth)
- Navigate to Dashboard - see stats from database
- Navigate to Chat - messages saved to database
- Send messages - stored in MySQL via stored procedure

## Notes

- CORS is enabled in `connection.php`
- User ID defaults to 1 (demo user)
- Conversation ID defaults to 1
- Stored procedures handle all data operations
- Trigger automatically updates conversation timestamp

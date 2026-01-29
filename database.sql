-- Create database
CREATE DATABASE IF NOT EXISTS mindguide_db;
USE mindguide_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) DEFAULT 'New Chat',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    conversation_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    sender ENUM('user', 'bot') NOT NULL,
    status ENUM('sending', 'delivered', 'failed') DEFAULT 'delivered',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Mood logs table
CREATE TABLE IF NOT EXISTS mood_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    mood INT NOT NULL CHECK (mood BETWEEN 1 AND 5),
    activity VARCHAR(50),
    log_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample users
INSERT INTO users (email, name, password) VALUES
('demo@example.com', 'Demo User', '$2y$10$YourHashedPasswordHere'),
('test@example.com', 'Test User', '$2y$10$YourHashedPasswordHere');

-- Insert sample conversation
INSERT INTO conversations (user_id, title) VALUES (1, 'Mental Health Chat');

-- Insert sample messages
INSERT INTO chat_messages (conversation_id, user_id, content, sender, status) VALUES
(1, 1, 'Hello! I am MindGuide, your mental health companion. How are you feeling today?', 'bot', 'delivered'),
(1, 1, 'I am feeling anxious', 'user', 'delivered'),
(1, 1, 'I understand how you are feeling. Would you like to talk more about it?', 'bot', 'delivered');

-- Insert sample mood logs
INSERT INTO mood_logs (user_id, mood, activity, log_date) VALUES
(1, 4, 'meditation', DATE_SUB(CURDATE(), INTERVAL 0 DAY)),
(1, 3, 'exercise', DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
(1, 5, 'journaling', DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
(1, 4, 'meditation', DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
(1, 3, 'therapy', DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
(1, 4, 'exercise', DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
(1, 5, 'meditation', DATE_SUB(CURDATE(), INTERVAL 6 DAY));

-- VIEW: Recent chat messages with user info
CREATE OR REPLACE VIEW vw_recent_chats AS
SELECT
    cm.id,
    cm.conversation_id,
    cm.content,
    cm.sender,
    cm.status,
    cm.created_at,
    u.name as user_name,
    u.email as user_email
FROM chat_messages cm
INNER JOIN users u ON cm.user_id = u.id
ORDER BY cm.created_at DESC;

-- STORED PROCEDURE 1: Save chat message
DELIMITER //
CREATE PROCEDURE sp_save_message(
    IN p_conversation_id INT,
    IN p_user_id INT,
    IN p_content TEXT,
    IN p_sender VARCHAR(10),
    IN p_status VARCHAR(20)
)
BEGIN
    INSERT INTO chat_messages (conversation_id, user_id, content, sender, status)
    VALUES (p_conversation_id, p_user_id, p_content, p_sender, p_status);

    SELECT LAST_INSERT_ID() as message_id;
END //
DELIMITER ;

-- STORED PROCEDURE 2: Get user chat history
DELIMITER //
CREATE PROCEDURE sp_get_chat_history(
    IN p_user_id INT,
    IN p_conversation_id INT
)
BEGIN
    SELECT
        id,
        content,
        sender,
        status,
        created_at as timestamp
    FROM chat_messages
    WHERE user_id = p_user_id
    AND conversation_id = p_conversation_id
    ORDER BY created_at ASC;
END //
DELIMITER ;

-- STORED PROCEDURE 3: Get user dashboard stats
DELIMITER //
CREATE PROCEDURE sp_get_user_stats(
    IN p_user_id INT
)
BEGIN
    SELECT
        COUNT(DISTINCT conversation_id) as totalSessions,
        IFNULL((SELECT COUNT(DISTINCT log_date)
                FROM mood_logs
                WHERE user_id = p_user_id
                AND log_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)), 0) as currentStreak,
        5 as badgesEarned,
        IFNULL((SELECT MAX(created_at) FROM chat_messages WHERE user_id = p_user_id), NOW()) as lastSessionDate
    FROM chat_messages
    WHERE user_id = p_user_id;
END //
DELIMITER ;

-- TRIGGER: Update conversation timestamp on new message
DELIMITER //
CREATE TRIGGER tr_update_conversation_timestamp
AFTER INSERT ON chat_messages
FOR EACH ROW
BEGIN
    UPDATE conversations
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.conversation_id;
END //
DELIMITER ;

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- STORED PROCEDURE: Insert activity log
DELIMITER //
CREATE PROCEDURE sp_insert_activity_log(
    IN p_user_id INT,
    IN p_action_type VARCHAR(50)
)
BEGIN
    INSERT INTO activity_logs (user_id, action_type)
    VALUES (p_user_id, p_action_type);

    SELECT LAST_INSERT_ID() as log_id;
END //
DELIMITER ;

-- Insert sample activity logs
INSERT INTO activity_logs (user_id, action_type) VALUES
(1, 'LOGIN'),
(1, 'MESSAGE_SENT'),
(1, 'MESSAGE_SENT'),
(1, 'MOOD_LOGGED'),
(1, 'LOGOUT'),
(2, 'LOGIN'),
(2, 'MESSAGE_SENT'),
(2, 'LOGOUT');

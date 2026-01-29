<?php
// ================= CORS =================
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ================= DB =================
require_once '../connection.php';

// ================= INPUT =================
$data = json_decode(file_get_contents("php://input"), true);

$conversation_id = isset($data['conversation_id']) ? (int)$data['conversation_id'] : 1;
$user_id         = isset($data['user_id']) ? (int)$data['user_id'] : 1;
$content         = isset($data['content']) ? trim($data['content']) : '';

if ($content === '') {
    echo json_encode([
        "success" => false,
        "message" => "Content is required"
    ]);
    exit;
}

// ================= SAVE USER MESSAGE =================
$stmt = $conn->prepare("
    INSERT INTO chat_messages (conversation_id, user_id, content, sender, status)
    VALUES (?, ?, ?, 'user', 'delivered')
");
$stmt->bind_param("iis", $conversation_id, $user_id, $content);
$stmt->execute();

$user_message_id = $stmt->insert_id;
$stmt->close();

// ================= BOT MESSAGE =================
$botReplies = [
    "I understand. Tell me more.",
    "That sounds difficult. I'm listening.",
    "You're not alone in this.",
    "It's okay to feel this way.",
    "Thanks for sharing this with me."
];

$bot_content = $botReplies[array_rand($botReplies)];

$stmt2 = $conn->prepare("
    INSERT INTO chat_messages (conversation_id, user_id, content, sender, status)
    VALUES (?, ?, ?, 'bot', 'delivered')
");
$stmt2->bind_param("iis", $conversation_id, $user_id, $bot_content);
$stmt2->execute();

$bot_message_id = $stmt2->insert_id;
$stmt2->close();

// ================= ACTIVITY LOG =================
$log = $conn->prepare("
    INSERT INTO activity_logs (user_id, action_type)
    VALUES (?, 'MESSAGE_SENT')
");
$log->bind_param("i", $user_id);
$log->execute();
$log->close();

// ================= RESPONSE =================
echo json_encode([
    "success" => true,
    "user_message" => [
        "id" => "user-$user_message_id",
        "content" => $content,
        "sender" => "user",
        "timestamp" => date('c'),
        "status" => "delivered"
    ],
    "bot_message" => [
        "id" => "bot-$bot_message_id",
        "content" => $bot_content,
        "sender" => "bot",
        "timestamp" => date('c'),
        "status" => "delivered"
    ]
]);

$conn->close();

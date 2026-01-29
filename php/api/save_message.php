<?php
// ================= CORS HEADERS =================
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ================= DB CONNECTION =================
require_once 'connection.php';

// ================= READ INPUT =================
$input = json_decode(file_get_contents('php://input'), true);

$conversation_id = isset($input['conversation_id']) ? (int)$input['conversation_id'] : 1;
$user_id = isset($input['user_id']) ? (int)$input['user_id'] : 1;
$content = isset($input['content']) ? trim($input['content']) : '';

$status = 'delivered';

// ================= VALIDATION =================
if ($content === '') {
    echo json_encode([
        "success" => false,
        "message" => "Content is required"
    ]);
    exit;
}

// ================= SAVE USER MESSAGE =================
$sender = 'user';

$stmt = $conn->prepare("CALL sp_save_message(?, ?, ?, ?, ?)");
$stmt->bind_param("iisss", $conversation_id, $user_id, $content, $sender, $status);
$stmt->execute();

$result = $stmt->get_result();
$userRow = $result->fetch_assoc();
$user_message_id = $userRow['message_id'];

$result->free();
$stmt->close();

// IMPORTANT: clear results (MySQL stored procedure rule)
while ($conn->more_results() && $conn->next_result()) {
    if ($res = $conn->store_result()) {
        $res->free();
    }
}

// ================= ACTIVITY LOG =================
$log = $conn->prepare(
    "INSERT INTO activity_logs (user_id, action_type) VALUES (?, 'MESSAGE_SENT')"
);
$log->bind_param("i", $user_id);
$log->execute();
$log->close();

// ================= BOT RESPONSE =================
$bot_responses = [
    "I understand how you're feeling. Would you like to talk more about it?",
    "That's completely normal. Many people experience similar feelings.",
    "Thank you for sharing that with me. How long have you been feeling this way?",
    "It's great that you're taking the time to reflect on your emotions.",
    "Have you tried any coping strategies that have worked for you in the past?",
    "Remember, it's okay to ask for help. You're doing the right thing by reaching out."
];

$bot_content = $bot_responses[array_rand($bot_responses)];
$bot_sender = 'bot';

// ================= SAVE BOT MESSAGE =================
$stmt2 = $conn->prepare("CALL sp_save_message(?, ?, ?, ?, ?)");
$stmt2->bind_param("iisss", $conversation_id, $user_id, $bot_content, $bot_sender, $status);
$stmt2->execute();

$result2 = $stmt2->get_result();
$botRow = $result2->fetch_assoc();
$bot_message_id = $botRow['message_id'];

$result2->free();
$stmt2->close();

// Clear again
while ($conn->more_results() && $conn->next_result()) {
    if ($res = $conn->store_result()) {
        $res->free();
    }
}

// ================= FINAL RESPONSE =================
echo json_encode([
    "success" => true,
    "bot_message" => [
        "id" => "bot-" . $bot_message_id,
        "content" => $bot_content,
        "sender" => "bot",
        "timestamp" => date('c'),
        "status" => "delivered"
    ]
]);

$conn->close();

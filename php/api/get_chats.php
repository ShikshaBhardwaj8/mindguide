<?php
// ================= CORS HEADERS =================
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ================= DB CONNECTION =================
require_once 'php/connection.php';

// ================= READ QUERY PARAMS =================
$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 1;
$conversation_id = isset($_GET['conversation_id']) ? (int)$_GET['conversation_id'] : 1;

// ================= CALL STORED PROCEDURE =================
$stmt = $conn->prepare("CALL sp_get_chat_history(?, ?)");
$stmt->bind_param("ii", $user_id, $conversation_id);
$stmt->execute();

$result = $stmt->get_result();

$messages = [];

while ($row = $result->fetch_assoc()) {
    $messages[] = [
        "id" => $row['sender'] . "-" . $row['id'],
        "content" => $row['content'],
        "sender" => $row['sender'],
        "timestamp" => date('c', strtotime($row['timestamp'])),
        "status" => $row['status']
    ];
}

// ================= CLEANUP =================
$result->free();
$stmt->close();

// Clear remaining result sets (VERY IMPORTANT for MySQL procedures)
while ($conn->more_results() && $conn->next_result()) {
    if ($res = $conn->store_result()) {
        $res->free();
    }
}

// ================= RESPONSE =================
echo json_encode([
    "success" => true,
    "messages" => $messages
]);

$conn->close();

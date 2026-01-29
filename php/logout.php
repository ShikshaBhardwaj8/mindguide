<?php
// ================= CORS HEADERS =================
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ================= DB CONNECTION =================
require_once 'connection.php';

// ================= READ INPUT =================
$data = json_decode(file_get_contents("php://input"), true);

// Fallback user_id
$user_id = 1;

// If frontend sends user_id
if ($data && isset($data['user_id'])) {
    $user_id = (int)$data['user_id'];
}

// ================= SAVE LOGOUT ACTIVITY =================
$stmt = $conn->prepare(
    "INSERT INTO activity_logs (user_id, action_type) VALUES (?, 'LOGOUT')"
);
$stmt->bind_param("i", $user_id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Logout saved successfully",
        "user_id" => $user_id
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to save logout"
    ]);
}

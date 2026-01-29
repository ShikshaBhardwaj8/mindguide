<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

require_once 'connection.php';

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'])) {
    echo json_encode([
        "success" => false,
        "message" => "Email is required"
    ]);
    exit;
}

$email = $data['email'];

// Fetch user
$stmt = $conn->prepare("SELECT id, email, name FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {

    $user_id = $user['id'];

    // Save LOGIN activity
    $log = $conn->prepare(
        "INSERT INTO activity_logs (user_id, action_type) VALUES (?, 'LOGIN')"
    );
    $log->bind_param("i", $user_id);
    $log->execute();

    // ✅ IMPORTANT: frontend expects this format
    echo json_encode([
        "success" => true,
        "user" => [
            "id" => $user['id'],
            "email" => $user['email'],
            "name" => $user['name']
        ]
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "User not found"
    ]);
}

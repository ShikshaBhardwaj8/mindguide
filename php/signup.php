<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

require_once 'connection.php';

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'], $data['password'], $data['name'])) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid input"
    ]);
    exit;
}

$email = $data['email'];
$name = $data['name'];
$password = password_hash($data['password'], PASSWORD_DEFAULT);

// Check if email already exists
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Email already exists"
    ]);
    exit;
}

// Insert new user
$stmt = $conn->prepare(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
);
$stmt->bind_param("sss", $name, $email, $password);

if ($stmt->execute()) {

    $user_id = $stmt->insert_id;

    // Save SIGNUP activity
    $log = $conn->prepare(
        "INSERT INTO activity_logs (user_id, action_type) VALUES (?, 'SIGNUP')"
    );
    $log->bind_param("i", $user_id);
    $log->execute();

    // ✅ Frontend-compatible response
    echo json_encode([
        "success" => true,
        "user" => [
            "id" => $user_id,
            "email" => $email,
            "name" => $name
        ]
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Signup failed"
    ]);
}

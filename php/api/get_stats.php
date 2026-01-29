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
require_once 'connection.php';

// ================= READ QUERY PARAM =================
$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 1;

// ================= CALL STORED PROCEDURE =================
$stmt = $conn->prepare("CALL sp_get_user_stats(?)");
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$stats = $result->fetch_assoc();

// ================= CLEANUP =================
$result->free();
$stmt->close();

// Clear remaining result sets (important for MySQL procedures)
while ($conn->more_results() && $conn->next_result()) {
    if ($res = $conn->store_result()) {
        $res->free();
    }
}

// ================= RESPONSE =================
echo json_encode([
    "success" => true,
    "stats" => [
        "totalSessions"   => (int)($stats['totalSessions'] ?? 0),
        "currentStreak"   => (int)($stats['currentStreak'] ?? 0),
        "badgesEarned"    => (int)($stats['badgesEarned'] ?? 0),
        "lastSessionDate" => $stats['lastSessionDate'] ?? null
    ]
]);

$conn->close();

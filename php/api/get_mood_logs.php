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

// ================= READ QUERY PARAMS =================
$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 1;
$days    = isset($_GET['days']) ? (int)$_GET['days'] : 30;

// ================= FETCH MOOD LOGS =================
$query = "
    SELECT id, mood, activity, log_date
    FROM mood_logs
    WHERE user_id = ?
      AND log_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    ORDER BY log_date ASC
";

$stmt = $conn->prepare($query);
$stmt->bind_param("ii", $user_id, $days);
$stmt->execute();

$result = $stmt->get_result();

$logs = [];

while ($row = $result->fetch_assoc()) {
    $logs[] = [
        "id" => "log-" . $row['id'],
        "date" => $row['log_date'],
        "mood" => (int)$row['mood'],
        "activity" => $row['activity']
    ];
}

// ================= CLEANUP =================
$result->free();
$stmt->close();

// ================= RESPONSE =================
echo json_encode([
    "success" => true,
    "logs" => $logs
]);

$conn->close();

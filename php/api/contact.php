<?php
require_once 'php/connection.php';

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);

$name = isset($input['name']) ? $input['name'] : '';
$email = isset($input['email']) ? $input['email'] : '';
$subject = isset($input['subject']) ? $input['subject'] : '';
$message = isset($input['message']) ? $input['message'] : '';

// Validate input
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo json_encode(['success' => false, 'error' => 'All fields are required']);
    exit;
}

// Insert contact submission (optional: create contacts table)
// For now, just return success
echo json_encode(['success' => true]);

mysqli_close($conn);
?>

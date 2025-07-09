<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "quiz_app";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        exit;
    }
    
    $user_id = $input['user_id'] ?? '';
    $score = $input['score'] ?? 0;
    $total_questions = $input['total_questions'] ?? 0;
    $quiz_date = $input['quiz_date'] ?? date('Y-m-d H:i:s');
    
    if (empty($user_id)) {
        http_response_code(400);
        echo json_encode(['error' => 'User ID is required']);
        exit;
    }
    
    // Insert score
    $stmt = $pdo->prepare("INSERT INTO user_scores (user_id, score, total_questions, quiz_date) VALUES (?, ?, ?, ?)");
    $stmt->execute([$user_id, $score, $total_questions, $quiz_date]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Score saved successfully',
        'id' => $pdo->lastInsertId()
    ]);
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
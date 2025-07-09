<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "quiz_app";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Fetch all questions
    $stmt = $pdo->prepare("SELECT * FROM quiz_questions ORDER BY id");
    $stmt->execute();
    $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Convert to proper format
    $formattedQuestions = array_map(function($question) {
        return [
            'id' => (int)$question['id'],
            'question' => $question['question'],
            'option1' => $question['option1'],
            'option2' => $question['option2'],
            'option3' => $question['option3'],
            'option4' => $question['option4'],
            'correct_option' => (int)$question['correct_option']
        ];
    }, $questions);
    
    echo json_encode($formattedQuestions);
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
}
?>
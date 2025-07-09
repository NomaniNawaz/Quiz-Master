-- Create database
CREATE DATABASE IF NOT EXISTS quiz_app;
USE quiz_app;

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    option1 VARCHAR(255) NOT NULL,
    option2 VARCHAR(255) NOT NULL,
    option3 VARCHAR(255) NOT NULL,
    option4 VARCHAR(255) NOT NULL,
    correct_option INT NOT NULL CHECK (correct_option BETWEEN 1 AND 4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_scores table
CREATE TABLE IF NOT EXISTS user_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    quiz_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_quiz_date (quiz_date)
);

-- Insert sample questions
INSERT INTO quiz_questions (question, option1, option2, option3, option4, correct_option) VALUES
('What is the capital of France?', 'London', 'Berlin', 'Paris', 'Madrid', 3),
('Which planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 2),
('What is 2 + 2?', '3', '4', '5', '6', 2),
('Who painted the Mona Lisa?', 'Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo', 3),
('What is the largest ocean on Earth?', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean', 4),
('In which year did World War II end?', '1944', '1945', '1946', '1947', 2),
('What is the chemical symbol for gold?', 'Go', 'Gd', 'Au', 'Ag', 3),
('Which programming language is known as the "language of the web"?', 'Python', 'Java', 'JavaScript', 'C++', 3),
('What is the smallest country in the world?', 'Monaco', 'Nauru', 'Vatican City', 'San Marino', 3),
('How many continents are there?', '5', '6', '7', '8', 3);
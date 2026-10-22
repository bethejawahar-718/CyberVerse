-- CyberVerse database schema (MySQL)
-- Run this once against your database before starting the backend.

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- A couple of starter rows so /api/lessons returns something immediately
INSERT INTO lessons (title, description, category, order_index) VALUES
    ('Intro to Cybersecurity', 'What cybersecurity is and why it matters.', 'Fundamentals', 1),
    ('Phishing Basics', 'How to recognize and avoid phishing attacks.', 'Social Engineering', 2);

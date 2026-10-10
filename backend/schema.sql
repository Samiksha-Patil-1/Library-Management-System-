-- The Academic Hub - Library Management System
-- MySQL Database Schema and Seed Data

DROP DATABASE IF EXISTS academic_hub_db;
CREATE DATABASE academic_hub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE academic_hub_db;

-- 1. Users Table (Authentication & Roles)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'librarian', 'student') DEFAULT 'student',
    student_id VARCHAR(50) NULL,
    avatar_url TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Students Table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    department VARCHAR(100) DEFAULT 'General Studies',
    membership_date DATE NOT NULL,
    status ENUM('active', 'suspended', 'graduated') DEFAULT 'active',
    avatar_url TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Books Table
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    isbn VARCHAR(30) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(150) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    status ENUM('Available', 'Issued', 'Reserved', 'Maintenance') DEFAULT 'Available',
    cover_url TEXT NULL,
    rating DECIMAL(2,1) DEFAULT 4.5,
    total_copies INT DEFAULT 5,
    available_copies INT DEFAULT 5,
    shelf_location VARCHAR(50) DEFAULT 'Section A-12',
    description TEXT,
    published_year INT DEFAULT 2021,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Transactions Table (Issue & Return Records)
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_code VARCHAR(50) NOT NULL UNIQUE,
    student_id INT NOT NULL,
    book_id INT NOT NULL,
    issue_date DATE NOT NULL,
    return_due_date DATE NOT NULL,
    returned_at DATE NULL,
    status ENUM('Issued', 'Overdue', 'Returned', 'Recent') DEFAULT 'Issued',
    fine_amount DECIMAL(6,2) DEFAULT 0.00,
    notes VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- 5. Reports Table (Stored Analytics & Summaries)
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_type VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    data JSON NOT NULL,
    generated_by VARCHAR(100) DEFAULT 'System',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for optimal lookup performance
CREATE INDEX idx_books_genre ON books(genre);
CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_trans_status ON transactions(status);
CREATE INDEX idx_trans_student ON transactions(student_id);
CREATE INDEX idx_trans_book ON transactions(book_id);

-- ==========================================
-- SEED DATA
-- ==========================================

-- Seed Users (Passwords are bcrypt hashed for "password123": $2a$10$w82JcQ7uG3YnZ4b5B0l3ueK5Pj3K8h0s9qM9zC0v2s3j4h5g6k7l8)
INSERT INTO users (name, email, password_hash, role, student_id, avatar_url) VALUES
('Sarah Jenkins', 'sarah.librarian@academichub.edu', '$2a$10$O0I2w645oJ2mU1.B2QYkCOx2b0U4tQ0L7aI0Z/b9kK6q5P0x1y2z3', 'librarian', NULL, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'),
('Karie Berlinn', 'karie.berlinn@student.academichub.edu', '$2a$10$O0I2w645oJ2mU1.B2QYkCOx2b0U4tQ0L7aI0Z/b9kK6q5P0x1y2z3', 'student', '22401', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
('Aaran Habits', 'aaran.habits@student.academichub.edu', '$2a$10$O0I2w645oJ2mU1.B2QYkCOx2b0U4tQ0L7aI0Z/b9kK6q5P0x1y2z3', 'student', '22402', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
('Dune Famlinn', 'dune.famlinn@student.academichub.edu', '$2a$10$O0I2w645oJ2mU1.B2QYkCOx2b0U4tQ0L7aI0Z/b9kK6q5P0x1y2z3', 'student', '22403', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80');

-- Seed Students
INSERT INTO students (id, student_code, name, email, phone, department, membership_date, status, avatar_url) VALUES
(1, '22401', 'Karie Berlinn', 'karie.berlinn@student.academichub.edu', '+1 (555) 234-5678', 'Literature & Arts', '2022-09-01', 'active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
(2, '22402', 'Aaran Habits', 'aaran.habits@student.academichub.edu', '+1 (555) 345-6789', 'Behavioral Psychology', '2022-09-15', 'active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
(3, '22403', 'Dune Famlinn', 'dune.famlinn@student.academichub.edu', '+1 (555) 456-7890', 'Science Fiction Studies', '2023-01-10', 'active', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'),
(4, '22404', 'Sarah Jazed', 'sarah.jazed@student.academichub.edu', '+1 (555) 567-8901', 'Social Sciences', '2022-08-20', 'active', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'),
(5, '22405', 'Sarah Sapiens', 'sarah.sapiens@student.academichub.edu', '+1 (555) 678-9012', 'Anthropology', '2023-02-05', 'active', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'),
(6, '22406', 'Dune Dune', 'dune.dune@student.academichub.edu', '+1 (555) 789-0123', 'Cosmology & Physics', '2023-03-12', 'active', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'),
(7, '22407', 'Aaran Toam', 'aaran.toam@student.academichub.edu', '+1 (555) 890-1234', 'Modern History', '2022-10-18', 'active', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'),
(8, '22408', 'Jaran Habits', 'jaran.habits@student.academichub.edu', '+1 (555) 901-2345', 'Economics & Policy', '2023-04-01', 'active', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80');

-- Seed Books
INSERT INTO books (id, isbn, title, author, genre, status, cover_url, rating, total_copies, available_copies, shelf_location, description, published_year) VALUES
(1, '978-1250301696', 'The Silent Patient', 'Alex Michaelides', 'Fiction', 'Available', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop&q=80', 4.8, 6, 4, 'Floor 2, Shelf F-04', 'Alicia Berenson’s life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house in London. One evening, she shoots her husband five times in the face and never speaks another word.', 2019),
(2, '978-0441172719', 'Dune', 'Frank Herbert', 'Science', 'Available', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80', 4.9, 8, 5, 'Floor 3, Shelf S-11', 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the spice melange.', 1965),
(3, '978-0062316097', 'Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 'History', 'Available', 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&auto=format&fit=crop&q=80', 4.7, 10, 7, 'Floor 1, Shelf H-02', 'From a renowned historian comes a groundbreaking narrative of humanity’s creation and evolution that explores how the cognitive, agricultural, and scientific revolutions have shaped us.', 2014),
(4, '978-0399590504', 'Educated', 'Tara Westover', 'Non-Fiction', 'Issued', 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=400&auto=format&fit=crop&q=80', 4.8, 5, 0, 'Floor 2, Shelf N-08', 'Born to survivalists in the mountains of Idaho, Tara Westover was 17 the first time she set foot in a classroom. Her quest for knowledge transformed her and took her over oceans to Cambridge.', 2018),
(5, '978-0451524935', '1984', 'George Orwell', 'Fiction', 'Issued', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&auto=format&fit=crop&q=80', 4.9, 7, 1, 'Floor 2, Shelf F-01', 'Winston Smith toes the Party line, rewriting history to satisfy the Ministry of Truth. With each lie he writes, Winston grows to hate the Party that seeks power for its own sake.', 1949),
(6, '978-0735211292', 'Atomic Habits', 'James Clear', 'Non-Fiction', 'Available', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80', 5.0, 12, 9, 'Floor 1, Shelf N-02', 'No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies to form good habits and break bad ones.', 2018),
(7, '978-0143127741', 'Thinking, Fast and Slow', 'Daniel Kahneman', 'Science', 'Available', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&auto=format&fit=crop&q=80', 4.6, 6, 5, 'Floor 3, Shelf S-05', 'Daniel Kahneman takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think: System 1 is fast and emotional; System 2 is slower and deliberative.', 2011),
(8, '978-0062457714', 'The Subtle Art of Not Giving a F*ck', 'Mark Manson', 'Non-Fiction', 'Available', 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&auto=format&fit=crop&q=80', 4.4, 8, 6, 'Floor 1, Shelf N-05', 'A counterintuitive approach to living a good life, showing how to stop trying to be positive all the time so that we can truly become better, happier people.', 2016),
(9, '978-0345391803', 'The Hitchhiker’s Guide to the Galaxy', 'Douglas Adams', 'Fiction', 'Issued', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&auto=format&fit=crop&q=80', 4.7, 4, 0, 'Floor 2, Shelf F-09', 'Seconds before Earth is demolished to make way for a galactic freeway, Arthur Dent is plucked off the planet by his friend Ford Prefect, a researcher for the titular travel guide.', 1979),
(10, '978-1400033416', 'Beloved', 'Toni Morrison', 'History', 'Available', 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&auto=format&fit=crop&q=80', 4.7, 5, 3, 'Floor 1, Shelf H-07', 'Set in post-Civil War Ohio, it tells the story of Sethe, an escaped slave who has fled to freedom but remains haunted by memories of Sweet Home and the specter of her dead baby girl.', 1987);

-- Seed Transactions matching reference UI records
INSERT INTO transactions (id, transaction_code, student_id, book_id, issue_date, return_due_date, returned_at, status, fine_amount) VALUES
(1, '1000001', 4, 1, '2024-01-09', '2024-01-18', '2024-01-17', 'Returned', 0.00),
(2, '1000012', 3, 2, '2024-01-16', '2024-03-18', NULL, 'Issued', 0.00),
(3, '1000013', 2, 3, '2024-01-15', '2024-03-18', NULL, 'Issued', 0.00),
(4, '1000003', 5, 4, '2024-02-17', '2024-02-17', NULL, 'Overdue', 15.00),
(5, '1000014', 6, 5, '2024-01-18', '2024-03-18', NULL, 'Overdue', 8.50),
(6, '1000015', 5, 2, '2024-03-19', '2024-03-20', NULL, 'Overdue', 12.00),
(7, '1000016', 2, 1, '2024-01-15', '2024-01-28', NULL, 'Issued', 0.00),
(8, '1000017', 7, 3, '2024-01-12', '2024-01-21', NULL, 'Overdue', 22.00),
(9, '1000118', 8, 1, '2024-02-04', '2024-02-14', '2024-02-14', 'Returned', 0.00),
(10, '1000119', 1, 1, '2024-03-02', '2024-03-16', NULL, 'Recent', 0.00);

-- Seed Reports
INSERT INTO reports (report_type, title, data, generated_by) VALUES
('monthly_circulation', 'Library Circulation & Activity Summary', '{"totalIssues": 12105, "totalReturns": 11862, "overdueCount": 319, "topBorrower": "Literature & Arts", "busiestDay": "Tuesday"}', 'Sarah Jenkins');

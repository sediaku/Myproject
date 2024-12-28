-- Create the database
CREATE DATABASE teacher_student_app;

-- Switch to the created database
USE teacher_student_app;

-- Table for storing teachers
CREATE TABLE teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Table for storing students
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Table for storing questions
CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text TEXT NOT NULL,
  deadline DATETIME NOT NULL,
  teacher_id INT NOT NULL,
  visible BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

-- Table for storing answers
CREATE TABLE answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  student_id INT NOT NULL,
  text TEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Table for storing grades
CREATE TABLE grades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  student_id INT NOT NULL,
  grade DECIMAL(5, 2),
  FOREIGN KEY (question_id) REFERENCES questions(id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  UNIQUE (question_id, student_id)
);

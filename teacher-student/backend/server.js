const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://your-frontend.vercel.app', // Replace with your actual frontend URL
}));

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'yourpassword',  // Update with your database password
  database: 'teacher_student_app',
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// Routes
// Teacher creates a question
app.post('/questions', (req, res) => {
  const { text, deadline, teacherId } = req.body;
  const query = 'INSERT INTO questions (text, deadline, teacher_id, visible) VALUES (?, ?, ?, ?)';
  db.query(query, [text, deadline, teacherId, true], (err, result) => {
    if (err) throw err;
    res.status(201).json({ id: result.insertId, text, deadline, teacherId, visible: true });
  });
});

// Get active questions
app.get('/questions', (req, res) => {
  const query = 'SELECT * FROM questions WHERE visible = true';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Student submits an answer
app.post('/questions/:id/answers', (req, res) => {
  const { text, studentId } = req.body;
  const query = 'INSERT INTO answers (question_id, student_id, text, submitted_at) VALUES (?, ?, ?, NOW())';
  db.query(query, [req.params.id, studentId, text], (err, result) => {
    if (err) throw err;
    res.status(201).json({ id: result.insertId, questionId: req.params.id, studentId, text });
  });
});

// Teacher assigns grades
app.post('/questions/:id/grades', (req, res) => {
  const { grades } = req.body; // grades is an array of { studentId, grade }
  grades.forEach(({ studentId, grade }) => {
    const query = 'INSERT INTO grades (question_id, student_id, grade) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE grade = ?';
    db.query(query, [req.params.id, studentId, grade, grade], (err) => {
      if (err) throw err;
    });
  });
  res.status(200).send('Grades updated');
});

// Get grades for a student
app.get('/grades/:studentId', (req, res) => {
  const query = 'SELECT * FROM grades WHERE student_id = ?';
  db.query(query, [req.params.studentId], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Mark expired questions as invisible
setInterval(() => {
  const query = 'UPDATE questions SET visible = false WHERE deadline < NOW()';
  db.query(query, (err) => {
    if (err) throw err;
  });
}, 60000); // Run every minute

app.listen(5000, () => console.log('Server running on port 5000'));

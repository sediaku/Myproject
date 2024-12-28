import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [questions, setQuestions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const response = await axios.get('https://your-backend.herokuapp.com/questions');
    setQuestions(response.data);
  };

  const postQuestion = async () => {
    if (!newQuestion || !deadline) {
      setNotification('Please provide both question text and deadline');
      return;
    }
    try {
      await axios.post('https://your-backend.herokuapp.com/questions', {
        text: newQuestion,
        deadline,
        teacherId: 'teacher1',
      });
      setNotification('Question posted successfully!');
      fetchQuestions();
    } catch (err) {
      setNotification('Failed to post question');
    }
  };

  const submitAnswer = async (questionId, answer) => {
    await axios.post(`https://your-backend.herokuapp.com/questions/${questionId}/answers`, {
      text: answer,
      studentId: 'student1',
    });
  };

  const fetchGrades = async () => {
    const response = await axios.get('https://your-backend.herokuapp.com/grades/student1');
    setGrades(response.data);
  };

  return (
    <div>
      <h1>Teacher-Student App</h1>
      <div>
        <h2>Create Question</h2>
        <input
          type="text"
          placeholder="Question Text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button onClick={postQuestion}>Post Question</button>
      </div>

      <div>{notification && <p>{notification}</p>}</div>

      <div>
        <h2>Active Questions</h2>
        {questions.map((q) => (
          <div key={q.id}>
            <p>{q.text}</p>
            <p>Deadline: {new Date(q.deadline).toLocaleString()}</p>
            <button onClick={() => submitAnswer(q.id, 'Sample Answer')}>Submit Answer</button>
          </div>
        ))}
      </div>

      <div>
        <h2>Grades</h2>
        <button onClick={fetchGrades}>Fetch Grades</button>
        {grades.map((g) => (
          <div key={g.id}>
            <p>Question ID: {g.question_id}</p>
            <p>Grade: {g.grade}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

function GenerateAnswer() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const { auth } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/generate_answer',
        { question },
        { headers: { Authorization: `Bearer ${auth}` } }
      );
      setAnswer(response.data.answer);
    } catch (err) {
      setAnswer('Error generating answer');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h2>Ask a Question</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Enter question..." style={{ width: '100%' }} />
        </div><br />
        <button type="submit">Generate Answer</button>
      </form>
      {answer && <div><h3>Answer:</h3><p>{answer}</p></div>}
    </div>
  );
}

export default GenerateAnswer;

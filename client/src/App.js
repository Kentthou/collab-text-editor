import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [document, setDocument] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let lastError = null;
    const newSocket = new WebSocket('ws://localhost:5000');
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    newSocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'init' || message.type === 'update') {
          setDocument(message.data);
        }
      } catch (err) {
        lastError = err;
        console.error('Error parsing message:', err);
      }
    };

    newSocket.onclose = () => {
      console.log('WebSocket closed. Last error was:', lastError);
    };

    newSocket.onerror = (event) => {
      console.error('WebSocket encountered an error:', event);
    };

    return () => newSocket.close();
  }, []);


  const handleChange = (e) => {
    const newDocument = e.target.value;
    setDocument(newDocument);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'update', data: newDocument }));
    }
  };  

  return (
    <div className="App">
      <h1>Collaborative Text Editor</h1>
      <textarea
        value={document} 
        onChange={handleChange}
        rows="20"
        cols="80"
      />
    </div>
  );
}

export default App;
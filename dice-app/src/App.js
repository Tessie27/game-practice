import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [dice, setDice] = useState([1, 1]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const rollDice = () => {
    setLoading(true);
    setTimeout(() => {
      const newDice = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];
      setDice(newDice);
      setLoading(false);
      setHistory(prevHistory => [...prevHistory, newDice]);
    }, 1000);
  };

  const resetGame = () => {
    setDice([1, 1]);
    setHistory([]);
    setLoading(false);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <h1>Dice Roller</h1>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
      </button>
      <div className="dice-container">
        {loading ? (
          <div className="dice loading">Rolling...</div>
        ) : (
          <>
            <div className="dice">{dice[0]}</div>
            <div className="dice">{dice[1]}</div>
          </>
        )}
      </div>
      <button onClick={rollDice} disabled={loading}>
        {loading ? 'Rolling...' : 'Roll Dice'}
      </button>
      <button onClick={resetGame} disabled={loading}>
        Reset Game
      </button>
      <div className="history">
        <h3>Roll History</h3>
        <ul>
          {history.map((roll, index) => (
            <li key={index}>
              Roll {index + 1}: {roll.join(' & ')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

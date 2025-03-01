import React, { useState, useEffect } from 'react';
import './App.css';

// App Component
const App = () => {
  // Game state variables
  const [board, setBoard] = useState(['', '', '', '', '', '', '', '', '']); // Empty 3x3 grid
  const [gameOver, setGameOver] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [tieScore, setTieScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // Player goes first by default

  // Event handler for player move
  const handlePlayerMove = (index) => {
    if (gameOver || !isPlayerTurn || board[index] !== '') return; // Ignore invalid clicks

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    if (checkWinner('X', newBoard)) {
      setPlayerScore(playerScore + 1);
      setGameOver(true);
      setTimeout(resetGame, 1000); // Delay for UX
      return;
    }

    if (newBoard.every(cell => cell !== '') && !checkWinner('X', newBoard) && !checkWinner('O', newBoard)) {
      setTieScore(tieScore + 1);
      setGameOver(true);
      setTimeout(resetGame, 1000); // Delay for UX
      return;
    }

    setIsPlayerTurn(false); // Switch turn to computer
  };

  // Function for computer's turn (Medium AI)
  useEffect(() => {
    if (gameOver || isPlayerTurn) return;

    const timer = setTimeout(() => {
      const availableMoves = board.reduce((acc, curr, idx) => {
        if (!curr) acc.push(idx);
        return acc;
      }, []);

      // 1. Check for a winning move for the computer
      const winningMove = findWinningMove('O', board);
      if (winningMove !== -1) {
        makeMove(winningMove, 'O');
        return;
      }

      // 2. Check if the player has a winning move (block it)
      const blockingMove = findWinningMove('X', board);
      if (blockingMove !== -1) {
        makeMove(blockingMove, 'O');
        return;
      }

      // 3. No immediate winning or blocking move? Make a random move.
      const randomIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      makeMove(randomIndex, 'O');
    }, 1000); // 1-second delay before the CPU makes a move

    // Cleanup the timeout when the component re-renders
    return () => clearTimeout(timer);

  }, [board, isPlayerTurn, gameOver]);

  // Function to make a move on the board
  const makeMove = (index, player) => {
    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    if (checkWinner(player, newBoard)) {
      if (player === 'X') {
        setPlayerScore(playerScore + 1);
      } else {
        setComputerScore(computerScore + 1);
      }
      setGameOver(true);
      setTimeout(resetGame, 1000); // Delay for UX
      return;
    }

    if (newBoard.every(cell => cell !== '') && !checkWinner('X', newBoard) && !checkWinner('O', newBoard)) {
      setTieScore(tieScore + 1);
      setGameOver(true);
      setTimeout(resetGame, 1000); // Delay for UX
      return;
    }

    setIsPlayerTurn(true);
  };

  // Function to find a winning move for a given player
  const findWinningMove = (player, board) => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      const values = [board[a], board[b], board[c]];
      const emptyIndex = values.indexOf('');
      if (values.filter(val => val === player).length === 2 && emptyIndex !== -1) {
        return combination[emptyIndex];
      }
    }
    return -1;
  };

  // Function to check for a winner
  const checkWinner = (player, board) => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    return winningCombinations.some(combination =>
      combination.every(index => board[index] === player)
    );
  };

  // Reset the game after a round ends
  const resetGame = () => {
    setBoard(['', '', '', '', '', '', '', '', '']);
    setGameOver(false);
    setIsPlayerTurn(!isPlayerTurn); // Switch who goes first

    if (!isPlayerTurn) {
      setTimeout(() => makeMove(Math.floor(Math.random() * 9), 'O'), 500); // Computer makes its move immediately after reset
    }
  };

  // Update the scoreboard
  const updateScoreboard = () => (
    <div className="scoreboard">
      <div className="score-item">
        <span>Player</span>
        <span>{playerScore}</span>
      </div>
      <div className="score-item">
        <span>Tie</span>
        <span>{tieScore}</span>
      </div>
      <div className="score-item">
        <span>Computer</span>
        <span>{computerScore}</span>
      </div>
    </div>
  );

  return (
    <div className="App">
      {updateScoreboard()}
      <div className="grid-container">
        {board.map((cell, index) => (
          <div
            key={index}
            className="grid-item"
            onClick={() => handlePlayerMove(index)}
          >
            {cell}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

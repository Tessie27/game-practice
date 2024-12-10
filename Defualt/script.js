// Game state variables
let board = ['', '', '', '', '', '', '', '', ''];  // Empty 3x3 grid
let gameOver = false;
let playerScore = 0;
let tieScore = 0;
let computerScore = 0;
let isPlayerTurn = true;  // Keeps track of whose turn it is (true = player, false = computer)

// Select the grid items and scoreboard elements
const gridItems = document.querySelectorAll('.grid-item');
const playerScoreElement = document.getElementById('player');
const tieScoreElement = document.getElementById('tie');
const computerScoreElement = document.getElementById('computer');

// Event listener for player clicks
gridItems.forEach(item => {
    item.addEventListener('click', handlePlayerMove);
});

// Function to handle player move
function handlePlayerMove(event) {
    if (gameOver || !isPlayerTurn) return;  // Ignore clicks if the game is over or it's not the player's turn

    const index = event.target.getAttribute('data-index');
    
    // Prevent click if the cell is already taken
    if (board[index] || gameOver) return;

    // Mark the player's move
    board[index] = 'X';
    event.target.textContent = 'X';

    // Check if player has won
    if (checkWinner('X')) {
        playerScore++;
        updateScoreboard();
        gameOver = true;
        setTimeout(resetGame, 1000);  // Delay before resetting for better UX
        return;
    }

    // Check for tie (if board is full)
    if (board.every(cell => cell !== '') && !checkWinner('X') && !checkWinner('O')) {
        tieScore++;
        updateScoreboard();
        gameOver = true;
        setTimeout(resetGame, 1000);  // Delay before resetting for better UX
        return;
    }

    // Switch turn to computer
    isPlayerTurn = false;
    setTimeout(handleComputerMove, 500);  // Give a brief delay before computer moves
}

// Function for computer's turn (Medium AI)
function handleComputerMove() {
    if (gameOver || isPlayerTurn) return;  // Ignore if game is over or it's the player's turn

    const availableMoves = board.reduce((acc, curr, idx) => {
        if (!curr) acc.push(idx);
        return acc;
    }, []);

    // 1. Check for a winning move for the computer
    const winningMove = findWinningMove('O');
    if (winningMove !== -1) {
        makeMove(winningMove, 'O');
        return;
    }

    // 2. Check if the player has a winning move (block it)
    const blockingMove = findWinningMove('X');
    if (blockingMove !== -1) {
        makeMove(blockingMove, 'O');
        return;
    }

    // 3. No immediate winning or blocking move? Make a random move.
    const randomIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    makeMove(randomIndex, 'O');
}

// Function to find a winning move for a given player (returns index of the winning move or -1 if no winning move)
function findWinningMove(player) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        const values = [board[a], board[b], board[c]];
        const emptyIndex = values.indexOf('');
        
        // Check if the player can win by completing the line
        if (values.filter(val => val === player).length === 2 && emptyIndex !== -1) {
            return combination[emptyIndex];  // Return the index of the empty spot
        }
    }
    return -1;  // No winning move found
}

// Function to make a move on the board
function makeMove(index, player) {
    board[index] = player;
    gridItems[index].textContent = player;

    // Check if the player has won
    if (checkWinner(player)) {
        if (player === 'X') {
            playerScore++;
        } else {
            computerScore++;
        }
        updateScoreboard();
        gameOver = true;
        setTimeout(resetGame, 1000);  // Delay before resetting for better UX
        return;
    }

    // Check for tie (if board is full)
    if (board.every(cell => cell !== '') && !checkWinner('X') && !checkWinner('O')) {
        tieScore++;
        updateScoreboard();
        gameOver = true;
        setTimeout(resetGame, 1000);  // Delay before resetting for better UX
        return;
    }

    // Switch turn back to player
    isPlayerTurn = true;
}

// Function to check for a winner
function checkWinner(player) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winningCombinations.some(combination => {
        return combination.every(index => board[index] === player);
    });
}

// Function to update the scoreboard
function updateScoreboard() {
    playerScoreElement.textContent = playerScore;
    tieScoreElement.textContent = tieScore;
    computerScoreElement.textContent = computerScore;
}

// Reset the game board after a round ends
function resetGame() {
    // Reset game state
    board = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;

    // Clear grid display
    gridItems.forEach(item => item.textContent = '');

    // Switch who goes first for the next round
    isPlayerTurn = !isPlayerTurn;  // If it was player first, now it will be computer first and vice versa

    // If the computer goes first, make its move right away
    if (!isPlayerTurn) {
        setTimeout(handleComputerMove, 500); // The computer makes its move immediately after reset
    }
}

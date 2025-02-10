// Function to switch between games
function showGame(game) {
    // Hide both games initially
    document.getElementById('tictactoe').style.display = 'none';
    document.getElementById('snake').style.display = 'none';

    if (game === 'tictactoe') {
        // Show Tic Tac Toe
        document.getElementById('tictactoe').style.display = 'block';
    } else if (game === 'snake') {
        // Show Snake game
        document.getElementById('snake').style.display = 'block';
        startSnakeGame();  // Initialize Snake game when switched to snake
    }
}


// Game state variables for Tic Tac Toe
let board = ['', '', '', '', '', '', '', '', ''];  // Empty 3x3 grid
let gameOver = false;
let playerScore = 0;
let tieScore = 0;
let computerScore = 0;
let isPlayerTurn = true;  // Keeps track of whose turn it is (true = player, false = computer)

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
    
    if (board[index]) return;  // Prevent click if the cell is already taken

    // Mark the player's move
    board[index] = 'X';
    event.target.textContent = 'X';

    if (checkWinner('X')) {
        playerScore++;
        updateScoreboard();
        gameOver = true;
        setTimeout(resetGame, 1000);  // Delay before resetting for better UX
        return;
    }

    if (board.every(cell => cell !== '') && !checkWinner('X') && !checkWinner('O')) {
        tieScore++;
        updateScoreboard();
        gameOver = true;
        setTimeout(resetGame, 1000);  // Delay before resetting for better UX
        return;
    }

    isPlayerTurn = false;
    setTimeout(handleComputerMove, 500);  // Give a brief delay before computer moves
}

// Function for computer's turn (Medium AI)
function handleComputerMove() {
    if (gameOver || isPlayerTurn) return;  // Ignore if game is over or it's the player's turn

    const availableMoves = getAvailableMoves();

    // Check for winning or blocking moves
    const winningMove = findWinningMove('O');
    if (winningMove !== -1) {
        makeMove(winningMove, 'O');
        return;
    }

    const blockingMove = findWinningMove('X');
    if (blockingMove !== -1) {
        makeMove(blockingMove, 'O');
        return;
    }

    // No immediate winning or blocking move? Make a random move
    const randomIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    makeMove(randomIndex, 'O');
}

// Get available moves (empty cells)
function getAvailableMoves() {
    return board.reduce((acc, curr, idx) => {
        if (!curr) acc.push(idx);
        return acc;
    }, []);
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

    if (checkWinner(player)) {
        player === 'X' ? playerScore++ : computerScore++;
        updateScoreboard();
        gameOver = true;
        setTimeout(resetGame, 1000);
        return;
    }

    if (board.every(cell => cell !== '') && !checkWinner('X') && !checkWinner('O')) {
        tieScore++;
        updateScoreboard();
        gameOver = true;
        setTimeout(resetGame, 1000);
        return;
    }

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
    board = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;

    gridItems.forEach(item => item.textContent = '');  // Clear grid

    // Switch turn for next round
    isPlayerTurn = !isPlayerTurn;  // Switch player/computer turn

    if (!isPlayerTurn) {
        setTimeout(handleComputerMove, 500);  // Computer plays first after reset
    }
}

// Snake Game Logic
let canvas = document.getElementById("gameCanvas2");
let ctx = canvas.getContext("2d");

let box = 20; // Original box size
let snake = [];
snake[0] = { x: 10 * box, y: 10 * box };
let food = generateFoodPosition(); // Original food position
let score = 0;
let gamePaused = false;

let d;
document.addEventListener("keydown", direction);

function direction(event) {
    if (event.keyCode == 37 && d != "RIGHT") {
        d = "LEFT";
    } else if (event.keyCode == 38 && d != "DOWN") {
        d = "UP";
    } else if (event.keyCode == 39 && d != "LEFT") {
        d = "RIGHT";
    } else if (event.keyCode == 40 && d != "UP") {
        d = "DOWN";
    } else if (event.keyCode == 80) { // 'P' key for pause/resume
        togglePause();
    }
}

function generateFoodPosition() {
    let position;
    do {
        position = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } while (collision(position, snake));
    return position;
}

function draw() {
    if (gamePaused) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "#B19470" : "#fff"; // Snake colour changed to #B19470
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "black";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Food colour remains red
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    if (snakeX < 0) snakeX = canvas.width - box;
    if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY < 0) snakeY = canvas.height - box;
    if (snakeY >= canvas.height) snakeY = 0;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = generateFoodPosition();
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (collision(newHead, snake)) {
        clearInterval(game);
        displayBanner("Game Over! Your score is " + score);
        setTimeout(() => {
            location.reload(); // Reload the page to restart the game
        }, 3000); // 3 seconds delay before reloading
    }

    snake.unshift(newHead);

    document.getElementById("score2").innerHTML = "Score: " + score;
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function displayBanner(message) {
    let banner = document.getElementById("banner");
    banner.innerHTML = message;
    banner.style.display = "block";
}

function togglePause() {
    gamePaused = !gamePaused;
    let pauseButton = document.getElementById("pauseButton2");
    pauseButton.textContent = gamePaused ? "Resume" : "Pause";
}

document.getElementById("pauseButton2").addEventListener("click", togglePause);

let game = setInterval(draw, 100);


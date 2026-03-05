// ===== SHARED CONSTANTS =====
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// ===== NAV =====
function showGame(game) {
    document.getElementById('tictactoe').style.display = 'none';
    document.getElementById('snake').style.display = 'none';

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    if (game === 'tictactoe') {
        document.getElementById('tictactoe').style.display = 'flex';
        document.getElementById('nav-tictactoe').classList.add('active');
    } else if (game === 'snake') {
        document.getElementById('snake').style.display = 'flex';
        document.getElementById('nav-snake').classList.add('active');
        initSnakeGame();
    }
}


// ===========================
// TIC TAC TOE
// ===========================
let board = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
let playerScore = 0;
let tieScore = 0;
let computerScore = 0;
let isPlayerTurn = true;

const gridItems = document.querySelectorAll('.grid-item');
const playerScoreElement = document.getElementById('player');
const tieScoreElement = document.getElementById('tie');
const computerScoreElement = document.getElementById('computer');
const tttStatus = document.getElementById('ttt-status');

gridItems.forEach(item => {
    item.addEventListener('click', handlePlayerMove);
});

function setStatus(msg, type = '') {
    tttStatus.textContent = msg;
    tttStatus.className = 'ttt-status' + (type ? ' ' + type : '');
}

function handlePlayerMove(event) {
    if (gameOver || !isPlayerTurn) return;

    const index = event.target.getAttribute('data-index');
    if (board[index]) return;

    board[index] = 'X';
    event.target.textContent = 'X';
    event.target.classList.add('x-mark', 'taken');

    const winCells = getWinningCells('X');
    if (winCells) {
        playerScore++;
        updateScoreboard();
        highlightWinner(winCells);
        setStatus('You win!', 'win');
        gameOver = true;
        setTimeout(resetGame, 1400);
        return;
    }

    if (board.every(cell => cell !== '')) {
        tieScore++;
        updateScoreboard();
        setStatus("It's a tie!", 'tie');
        gameOver = true;
        setTimeout(resetGame, 1400);
        return;
    }

    isPlayerTurn = false;
    setStatus("CPU is thinking…");
    setTimeout(handleComputerMove, 500);
}

function handleComputerMove() {
    if (gameOver || isPlayerTurn) return;

    const winningMove = findWinningMove('O');
    if (winningMove !== -1) { makeMove(winningMove, 'O'); return; }

    const blockingMove = findWinningMove('X');
    if (blockingMove !== -1) { makeMove(blockingMove, 'O'); return; }

    // Prefer center, then corners, then random
    const preferred = [4, 0, 2, 6, 8, 1, 3, 5, 7];
    const move = preferred.find(i => board[i] === '');
    makeMove(move, 'O');
}

function getAvailableMoves() {
    return board.reduce((acc, curr, idx) => {
        if (!curr) acc.push(idx);
        return acc;
    }, []);
}

function findWinningMove(player) {
    for (const combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo;
        const values = [board[a], board[b], board[c]];
        const emptyIndex = values.indexOf('');
        if (values.filter(v => v === player).length === 2 && emptyIndex !== -1) {
            return combo[emptyIndex];
        }
    }
    return -1;
}

function makeMove(index, player) {
    board[index] = player;
    gridItems[index].textContent = player;
    gridItems[index].classList.add(player === 'X' ? 'x-mark' : 'o-mark', 'taken');

    const winCells = getWinningCells(player);
    if (winCells) {
        player === 'X' ? playerScore++ : computerScore++;
        updateScoreboard();
        highlightWinner(winCells);
        setStatus(player === 'X' ? 'You win!' : 'CPU wins!', player === 'X' ? 'win' : 'lose');
        gameOver = true;
        setTimeout(resetGame, 1400);
        return;
    }

    if (board.every(cell => cell !== '')) {
        tieScore++;
        updateScoreboard();
        setStatus("It's a tie!", 'tie');
        gameOver = true;
        setTimeout(resetGame, 1400);
        return;
    }

    isPlayerTurn = true;
    setStatus("Your turn");
}

function getWinningCells(player) {
    for (const combo of WINNING_COMBINATIONS) {
        if (combo.every(i => board[i] === player)) return combo;
    }
    return null;
}

function highlightWinner(cells) {
    cells.forEach(i => gridItems[i].classList.add('winner'));
}

function updateScoreboard() {
    playerScoreElement.textContent = playerScore;
    tieScoreElement.textContent = tieScore;
    computerScoreElement.textContent = computerScore;
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    gridItems.forEach(item => {
        item.textContent = '';
        item.className = 'grid-item';
    });
    isPlayerTurn = !isPlayerTurn;
    if (!isPlayerTurn) {
        setStatus("CPU is thinking…");
        setTimeout(handleComputerMove, 500);
    } else {
        setStatus("Your turn");
    }
}


// ===========================
// SNAKE GAME
// ===========================
let canvas = document.getElementById("gameCanvas2");
let ctx = canvas.getContext("2d");

let box = 20;
let snake, food, snakeScore, gamePaused, snakeGameInterval, snakeDir, snakeStarted;

function initSnakeGame() {
    // Clear any existing interval first
    clearInterval(snakeGameInterval);

    snake = [{ x: 10 * box, y: 10 * box }];
    food = generateFoodPosition();
    snakeScore = 0;
    gamePaused = false;
    snakeDir = null;
    snakeStarted = false;

    document.getElementById('score2').textContent = 'Score: 0';
    document.getElementById('banner').style.display = 'none';
    document.getElementById('snake-start-msg').style.opacity = '1';

    const pauseBtn = document.getElementById('pauseButton2');
    pauseBtn.textContent = 'Pause';
    pauseBtn.disabled = true;

    // Draw initial static frame
    drawSnakeFrame();

    // Game loop — will only move once snakeStarted is true
    snakeGameInterval = setInterval(draw, 100);
}

function generateFoodPosition() {
    let position;
    do {
        position = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } while (snake && collision(position, snake));
    return position;
}

function drawSnakeFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2 - 1, 0, Math.PI * 2);
    ctx.fill();

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#818cf8' : '#6366f1';
        ctx.beginPath();
        ctx.roundRect(snake[i].x + 1, snake[i].y + 1, box - 2, box - 2, 4);
        ctx.fill();
    }
}

function draw() {
    if (gamePaused || !snakeStarted) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food as circle
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2 - 1, 0, Math.PI * 2);
    ctx.fill();

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#818cf8' : '#6366f1';
        ctx.beginPath();
        ctx.roundRect(snake[i].x + 1, snake[i].y + 1, box - 2, box - 2, 4);
        ctx.fill();
    }

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (snakeDir === "LEFT")  snakeX -= box;
    if (snakeDir === "UP")    snakeY -= box;
    if (snakeDir === "RIGHT") snakeX += box;
    if (snakeDir === "DOWN")  snakeY += box;

    // Wrap around walls
    if (snakeX < 0) snakeX = canvas.width - box;
    if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY < 0) snakeY = canvas.height - box;
    if (snakeY >= canvas.height) snakeY = 0;

    if (snakeX === food.x && snakeY === food.y) {
        snakeScore++;
        food = generateFoodPosition();
    } else {
        snake.pop();
    }

    const newHead = { x: snakeX, y: snakeY };

    if (collision(newHead, snake)) {
        clearInterval(snakeGameInterval);
        displayBanner("Game Over! Score: " + snakeScore);
        setTimeout(() => initSnakeGame(), 3000);
        return;
    }

    snake.unshift(newHead);
    document.getElementById("score2").textContent = "Score: " + snakeScore;
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

function displayBanner(message) {
    const banner = document.getElementById("banner");
    banner.innerHTML = message;
    banner.style.display = "block";
}

function togglePause() {
    if (!snakeStarted) return;
    gamePaused = !gamePaused;
    document.getElementById("pauseButton2").textContent = gamePaused ? "Resume" : "Pause";
}

document.getElementById("pauseButton2").addEventListener("click", togglePause);

// Key handler — use event.key instead of deprecated keyCode
document.addEventListener("keydown", function (event) {
    const key = event.key;

    // Prevent page scrolling with arrow keys when snake is active
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(key)) {
        event.preventDefault();
    }

    if (key === 'ArrowLeft'  && snakeDir !== "RIGHT") snakeDir = "LEFT";
    else if (key === 'ArrowUp'    && snakeDir !== "DOWN")  snakeDir = "UP";
    else if (key === 'ArrowRight' && snakeDir !== "LEFT")  snakeDir = "RIGHT";
    else if (key === 'ArrowDown'  && snakeDir !== "UP")    snakeDir = "DOWN";
    else if (key === 'p' || key === 'P') { togglePause(); return; }
    else return;

    // First keypress — start the game
    if (!snakeStarted) {
        snakeStarted = true;
        document.getElementById('snake-start-msg').style.opacity = '0';
        document.getElementById('pauseButton2').disabled = false;
    }
});

// Theme functionality
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Check for saved theme preference or default to light
const currentTheme = localStorage.getItem("theme") || "light";
body.setAttribute("data-theme", currentTheme);
updateThemeButton();

// Theme toggle event listener
themeToggle.addEventListener("click", () => {
    const currentTheme = body.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    
    body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeButton();
});

function updateThemeButton() {
    const currentTheme = body.getAttribute("data-theme");
    themeToggle.textContent = currentTheme === "light" ? "🌙 Dark Theme" : "☀️ Light Theme";
}

// Game elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const finalScoreElement = document.getElementById("finalScore");
const finalHighScoreElement = document.getElementById("finalHighScore");
const gameOverMessageElement = document.getElementById("gameOverMessage");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");
const restartButtonMain = document.getElementById("restartButtonMain");
const difficultySelect = document.getElementById("difficulty");

// Mobile controls
const upButton = document.querySelector(".mobile-controls .up");
const leftButton = document.querySelector(".mobile-controls .left");
const rightButton = document.querySelector(".mobile-controls .right");
const downButton = document.querySelector(".mobile-controls .down");

// Game variables
const box = 20;
let snake = [];
let food = {};
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
let d;
let game;
let gamePaused = false;
let gameStarted = false;
// Slowed down snake speed by increasing interval values
let gameSpeed = 120; // Increased from 80 to 120 (slower)

// Initialize game
function init() {
    snake = [];
    snake[0] = { x: 10 * box, y: 10 * box };
    food = generateFoodPosition();
    score = 0;
    d = null;
    gamePaused = false;
    updateScore();
    
    // Set button text correctly
    pauseButton.textContent = "Pause";
    
    // Set high score
    highScoreElement.textContent = highScore;
}

// Generate food position
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

// Check collision
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Draw game elements
function draw() {
    // Clear entire canvas with green background
    const currentTheme = body.getAttribute("data-theme");
    const canvasColor = currentTheme === "dark" ? "#2D5D4B" : "#87A922";
    
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        const snakeHeadColor = currentTheme === "dark" ? "#4A7866" : "#B19470";
        const snakeBodyColor = currentTheme === "dark" ? "#3A6755" : "#8A9A5B";
        
        ctx.fillStyle = (i === 0) ? snakeHeadColor : snakeBodyColor;
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        
        ctx.strokeStyle = currentTheme === "dark" ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.2)";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        
        // Draw eyes on snake head
        if (i === 0) {
            ctx.fillStyle = "white";
            if (d === "RIGHT" || !d) {
                ctx.fillRect(snake[i].x + box - 5, snake[i].y + 5, 3, 3);
                ctx.fillRect(snake[i].x + box - 5, snake[i].y + box - 8, 3, 3);
            } else if (d === "LEFT") {
                ctx.fillRect(snake[i].x + 2, snake[i].y + 5, 3, 3);
                ctx.fillRect(snake[i].x + 2, snake[i].y + box - 8, 3, 3);
            } else if (d === "UP") {
                ctx.fillRect(snake[i].x + 5, snake[i].y + 2, 3, 3);
                ctx.fillRect(snake[i].x + box - 8, snake[i].y + 2, 3, 3);
            } else if (d === "DOWN") {
                ctx.fillRect(snake[i].x + 5, snake[i].y + box - 5, 3, 3);
                ctx.fillRect(snake[i].x + box - 8, snake[i].y + box - 5, 3, 3);
            }
        }
    }
    
    // Draw food with animation
    ctx.fillStyle = "#FF6B6B";
    ctx.beginPath();
    ctx.arc(food.x + box/2, food.y + box/2, box/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw food shine
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.beginPath();
    ctx.arc(food.x + box/2 - 3, food.y + box/2 - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Move snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    if (d === "LEFT") snakeX -= box;
    if (d === "UP") snakeY -= box;
    if (d === "RIGHT") snakeX += box;
    if (d === "DOWN") snakeY += box;
    
    // Wrap around edges
    if (snakeX < 0) snakeX = canvas.width - box;
    if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY < 0) snakeY = canvas.height - box;
    if (snakeY >= canvas.height) snakeY = 0;
    
    // Check if snake ate food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = generateFoodPosition();
        updateScore();
    } else {
        snake.pop();
    }
    
    // Create new head
    let newHead = {
        x: snakeX,
        y: snakeY
    };
    
    // Game over check
    if (collision(newHead, snake)) {
        gameOver();
        return;
    }
    
    snake.unshift(newHead);
}

// Update score display
function updateScore() {
    scoreElement.textContent = score;
    
    // Update high score if needed
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("snakeHighScore", highScore);
        highScoreElement.textContent = highScore;
    }
}

// Game over function
function gameOver() {
    clearInterval(game);
    gameStarted = false;
    
    // Update final scores
    finalScoreElement.textContent = score;
    finalHighScoreElement.textContent = highScore;
    
    // Set game over message
    let messages = [
        "Better luck next time!",
        "You were so close!",
        "Great effort!",
        "Try again!",
        "You can do better!"
    ];
    gameOverMessageElement.textContent = messages[Math.floor(Math.random() * messages.length)];
    
    // Show game over screen
    gameOverScreen.style.display = "flex";
}

// Start game function
function startGame() {
    init();
    startScreen.style.display = "none";
    gameOverScreen.style.display = "none";
    gameStarted = true;
    gameSpeed = parseInt(difficultySelect.value);
    game = setInterval(draw, gameSpeed);
}

// Toggle pause
function togglePause() {
    if (!gameStarted) return;
    
    gamePaused = !gamePaused;
    if (gamePaused) {
        clearInterval(game);
        pauseButton.textContent = "Resume";
    } else {
        game = setInterval(draw, gameSpeed);
        pauseButton.textContent = "Pause";
    }
}

// Direction control
function direction(key) {
    if (gamePaused || !gameStarted) return;
    
    if (key === "LEFT" && d !== "RIGHT") {
        d = "LEFT";
    } else if (key === "UP" && d !== "DOWN") {
        d = "UP";
    } else if (key === "RIGHT" && d !== "LEFT") {
        d = "RIGHT";
    } else if (key === "DOWN" && d !== "UP") {
        d = "DOWN";
    }
}

// Event listeners
document.addEventListener("keydown", (event) => {
    if (event.keyCode === 37) direction("LEFT");
    else if (event.keyCode === 38) direction("UP");
    else if (event.keyCode === 39) direction("RIGHT");
    else if (event.keyCode === 40) direction("DOWN");
    else if (event.keyCode === 80) togglePause(); // P key
});

startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", togglePause);
restartButton.addEventListener("click", startGame);
restartButtonMain.addEventListener("click", startGame);

// Mobile controls
upButton.addEventListener("click", () => direction("UP"));
leftButton.addEventListener("click", () => direction("LEFT"));
rightButton.addEventListener("click", () => direction("RIGHT"));
downButton.addEventListener("click", () => direction("DOWN"));

// Difficulty change - updated values to be slower
difficultySelect.addEventListener("change", () => {
    if (gameStarted && !gamePaused) {
        clearInterval(game);
        gameSpeed = parseInt(difficultySelect.value);
        game = setInterval(draw, gameSpeed);
    }
});

// Initialize high score display
highScoreElement.textContent = highScore;

// Set initial game speed to match the selected difficulty
gameSpeed = 120;

// Ensure canvas is properly sized
function resizeCanvas() {
    const gameContainer = document.querySelector('.game-container');
    canvas.width = gameContainer.offsetWidth;
    canvas.height = gameContainer.offsetHeight;
    
    // Redraw if game is in progress
    if (gameStarted && !gamePaused) {
        draw();
    }
}

// Handle window resize
window.addEventListener('resize', resizeCanvas);

// Initial resize
setTimeout(resizeCanvas, 100);

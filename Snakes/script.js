let canvas = document.getElementById("gameCanvas");
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
        ctx.fillStyle = (i === 0) ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "black";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

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

    document.getElementById("score").innerHTML = "Score: " + score;
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
    let pauseButton = document.getElementById("pauseButton");
    pauseButton.textContent = gamePaused ? "Resume" : "Pause";
}

document.getElementById("pauseButton").addEventListener("click", togglePause);

let game = setInterval(draw, 100);

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

    document.getElementById("score").innerHTML = "Score: " + score;
}

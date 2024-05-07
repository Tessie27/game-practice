let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameStatus = 'Game On';
let isComputerPlaying = false;

const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const restartButton = document.getElementById('restart');

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartButton.addEventListener('click', restartGame);

function handleCellClick(e) {
    if (!isComputerPlaying) {
        const cellIndex = e.target.id;
        
        if (board[cellIndex] === '' && gameStatus === 'Game On') {
            board[cellIndex] = currentPlayer;
            e.target.textContent = currentPlayer;
            
            checkGameStatus();
            
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            status.textContent = `Player ${currentPlayer}'s turn`;
            
            // Computer's move (randomly select an empty cell) after a delay
            if (gameStatus === 'Game On' && currentPlayer === 'O') {
                isComputerPlaying = true;
                setTimeout(makeComputerMove, 2000);
            }
        }
    }
}

function makeComputerMove() {
    let emptyCells = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            emptyCells.push(i);
        }
    }
    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const computerMoveIndex = emptyCells[randomIndex];
        board[computerMoveIndex] = currentPlayer;
        cells[computerMoveIndex].textContent = currentPlayer;
        checkGameStatus();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
    }
    isComputerPlaying = false;
}

function checkGameStatus() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
        [0, 4, 8], [2, 4, 6]             // Diagonal
    ];

    for (let i = 0; i < winningCombos.length; i++) {
        const [a, b, c] = winningCombos[i];
        
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameStatus = 'Game Over';
            status.textContent = `Player ${currentPlayer} wins!`;

            // Highlight winning cells
            cells[a].classList.add('winner');
            cells[b].classList.add('winner');
            cells[c].classList.add('winner');

            return; // Exit the function since game is over
        }
    }

    if (!board.includes('') && gameStatus === 'Game On') {
        gameStatus = 'Game Over';
        status.textContent = 'It\'s a tie!';
    }
}


function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameStatus = 'Game On';
    isComputerPlaying = false;
    status.textContent = 'Player X\'s turn';
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner'); 
    });
}

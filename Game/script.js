let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameStatus = 'Game On';

const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const restartButton = document.getElementById('restart');

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartButton.addEventListener('click', restartGame);

function handleCellClick(e) {
    const cellIndex = e.target.id;
    
    if (board[cellIndex] === '' && gameStatus === 'Game On') {
        board[cellIndex] = currentPlayer;
        e.target.textContent = currentPlayer;
        
        checkGameStatus();
        
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function checkGameStatus() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
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

            // Delay the alert to wait for 300 milliseconds
            setTimeout(() => {
                alert(`Player ${currentPlayer} wins!`);
            }, 300); 

            break;
        }
    }

    if (!board.includes('') && gameStatus === 'Game On') {
        gameStatus = 'Game Over';
        status.textContent = 'It\'s a tie!';
        
        // Delay the alert to wait for 300 milliseconds
        setTimeout(() => {
            alert('It\'s a tie!');
        }, 300); 
    }
}

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameStatus = 'Game On';
    status.textContent = 'Player X\'s turn';
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner'); 
    });
}

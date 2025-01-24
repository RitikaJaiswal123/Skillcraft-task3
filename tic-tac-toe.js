const boardElement = document.getElementById('board');
const messageElement = document.getElementById('message');
const restartButton = document.getElementById('restart');
const modeSelector = document.getElementById('modeSelector');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameOver = false;
let gameMode = 'twoPlayer'; 

function initializeBoard() {
    boardElement.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        cellElement.addEventListener('click', handleCellClick);
        boardElement.appendChild(cellElement);
    });
    updateMessage(`${currentPlayer}'s turn`);
}

function handleCellClick(event) {
    const index = event.target.dataset.index;
    if (board[index] || isGameOver || (gameMode === 'computer' && currentPlayer === 'O')) return;

    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add('taken');

    if (checkWin()) {
        updateMessage(`${currentPlayer} wins!`);
        isGameOver = true;
    } else if (board.every(cell => cell)) {
        updateMessage('It\'s a draw!');
        isGameOver = true;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        if (gameMode === 'computer' && currentPlayer === 'O') {
            updateMessage(`Computer's turn`);
            setTimeout(computerMove, 500); 
        } else {
            updateMessage(`${currentPlayer}'s turn`);
        }
    }
}

function computerMove() {
    const availableMoves = board.map((cell, index) => (cell === '') ? index : null).filter(index => index !== null);
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    board[randomMove] = 'O';
    const cellElement = boardElement.children[randomMove];
    cellElement.textContent = 'O';
    cellElement.classList.add('taken');

    if (checkWin()) {
        updateMessage('Computer wins!');
        isGameOver = true;
    } else if (board.every(cell => cell)) {
        updateMessage('It\'s a draw!');
        isGameOver = true;
    } else {
        currentPlayer = 'X';
        updateMessage(`${currentPlayer}'s turn`);
    }
}

function checkWin() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

function updateMessage(message) {
    messageElement.textContent = message;
}

restartButton.addEventListener('click', () => {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameOver = false;
    initializeBoard();
});

modeSelector.addEventListener('change', (event) => {
    gameMode = event.target.value;
    restartButton.click(); 
});

initializeBoard();

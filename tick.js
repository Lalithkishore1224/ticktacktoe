const board = document.getElementById('board');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const scoreTie = document.getElementById('score-tie');
const aiModeButton = document.getElementById('ai-mode');
const multiplayerButton = document.getElementById('multiplayer');
const resetButton = document.getElementById('reset');

let cells = [];
let currentPlayer = 'X';
let gameMode = 'ai';
let gameActive = true;
let scores = { X: 0, O: 0, TIE: 0 };

// 🎵 Audio for AI Win
const winSound = new Audio('ee_saala_cup_lollipop.mp3'); 

// 🎵 Audio for Match Draw
const drawSound = new Audio('irrungbhai.mp3'); 

function initializeBoard() {
    board.innerHTML = '';
    cells = [];
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleClick, { once: true });
        board.appendChild(cell);
        cells.push(cell);
    }
    currentPlayer = 'X';
    gameActive = true;
}

function handleClick(event) {
    if (!gameActive) return;
    const cell = event.target;
    if (cell.textContent) return;
    
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    
    if (checkWin(currentPlayer)) {
        updateScore(currentPlayer);
        resetGame();
        return;
    } else if (cells.every(cell => cell.textContent)) {
        updateScore('TIE');
        drawSound.play(); 
        resetGame();
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (gameMode === 'ai' && currentPlayer === 'O') {
        setTimeout(aiMove, 500);
    }
}

function aiMove() {
    let bestScore = -Infinity;
    let bestMove;
    const boardState = cells.map(cell => cell.textContent || null);
    
    
    for (let i = 0; i < 9; i++) {
        if (!boardState[i]) {
            boardState[i] = 'O';
            if (checkWin('O')) {
                cells[i].click();
                return;
            }
            boardState[i] = null;
        }
    }

    
    for (let i = 0; i < 9; i++) {
        if (!boardState[i]) {
            boardState[i] = 'O';
            let score = minimax(boardState, 0, false, -Infinity, Infinity);
            boardState[i] = null;
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    
    cells[bestMove].click();
}

function checkWin(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    const isWinner = winPatterns.some(pattern =>
        pattern.every(index => cells[index].textContent === player)
    );

   
    if (isWinner && player === 'O') {
        winSound.play();
    }

    return isWinner;
}

function updateScore(winner) {
    scores[winner]++;
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
    scoreTie.textContent = scores.TIE;
}

function resetGame() {
    setTimeout(initializeBoard, 1000);
}

function minimax(board, depth, isMaximizing, alpha, beta) {
    if (checkTerminal('O', board)) return 10 - depth;
    if (checkTerminal('X', board)) return depth - 10;
    if (board.every(cell => cell)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false, alpha, beta);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) break;
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true, alpha, beta);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
                beta = Math.min(beta, score);
                if (beta <= alpha) break;
            }
        }
        return bestScore;
    }
}

function checkTerminal(player, board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern =>
        pattern.every(index => board[index] === player)
    );
}

aiModeButton.addEventListener('click', () => { gameMode = 'ai'; initializeBoard(); });
multiplayerButton.addEventListener('click', () => { gameMode = 'multiplayer'; initializeBoard(); });
resetButton.addEventListener('click', () => {
    scores = { X: 0, O: 0, TIE: 0 };
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
    scoreTie.textContent = scores.TIE;
    initializeBoard();
});

initializeBoard();

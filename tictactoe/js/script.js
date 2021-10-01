const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
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
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('top-panel');
const restartButton = document.querySelector('.restart');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const score_one = document.querySelector('.score_player_1');
const score_two = document.querySelector('.score_player_2');
const score_draw = document.querySelector('.score_draw');
const player_one = document.querySelector('.player1');
const player_two = document.querySelector('.player2');

let circleTurn;
let lastWinner = 1;
let playerOneScore = 0;
let playerTwoScore = 0;
let drawScore = 0;

let gameIsRunning = true;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    gameIsRunning = true;
    winningMessageTextElement.innerText = '';
    if (lastWinner == 1) {
        circleTurn = false;
    } else {
        circleTurn = true;
    }
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    })
    setBoardHoverClass();
}

function handleClick(e) {
    if (gameIsRunning) {
        const cell = e.target;
        const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
        placeMark(cell, currentClass);
        if (checkWin(currentClass)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
            setBoardHoverClass();
        }
    }
}

function endGame(draw) {
    gameIsRunning = false;
    score_two.classList.remove('active');
    score_one.classList.remove('active');
    player_two.classList.remove('active');
    player_one.classList.remove('active');
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!';
        drawScore++;
        if (drawScore < 10) {
            score_draw.textContent = '0' + drawScore;
        } else {
            score_draw.textContent = drawScore;
        }
    } else {
        winningMessageTextElement.innerText = `${circleTurn ? "2nd PLAYER" : "1st PLAYER"} WON!`;
        if (!circleTurn) {
            playerOneScore++;
            if (playerOneScore < 10) {
                score_one.textContent = '0' + playerOneScore;
            } else {
                score_one.textContent = playerOneScore;
            }
            lastWinner = 1;
        } else if (circleTurn) {
            playerTwoScore++;
            if (playerTwoScore < 10) {
                score_two.textContent = '0' + playerTwoScore;
            } else {
                score_two.textContent = playerTwoScore;
            }
            lastWinner = 2;
        }
    }
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    circleTurn = !circleTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS);
        score_two.classList.add('active');
        score_one.classList.remove('active');
        player_two.classList.add('active');
        player_one.classList.remove('active');
    } else {
        board.classList.add(X_CLASS);
        score_one.classList.add('active');
        score_two.classList.remove('active');
        player_one.classList.add('active');
        player_two.classList.remove('active');
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}
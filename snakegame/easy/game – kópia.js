document.addEventListener('keydown', keyPush);
window.addEventListener('resize', checkWindowSize);
document.addEventListener('touchstart', touchStart);
document.addEventListener('touchend', touchEnd);

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const score_num = document.querySelector('.this-score-num');
const best_score_num = document.querySelector('.best-score-num');
const game_over_text = document.querySelector('.game-over-text')

canvas.width;
canvas.height;

let tileSize;
let tileCountX;
let tileCountY;
let indentation;

let fps = 10;
let gameIsRunning = true;

//PLAYER
let snakePosX;
let snakePosY;

let velocityX;
let velocityY;

let snakeSpeed;

let tail = [];
let snakeLength;

let score;
let best_score = 0;

if (localStorage.getItem("best_score") !== null){
    best_score = (localStorage.getItem("best_score"))
    if (best_score > 9){
        best_score_num.textContent = best_score;
    }
    else{
        best_score_num.textContent ='0' + best_score;
    }
}
function checkWindowSize(){
    if (!gameIsRunning){
        playAgain();
        return;
    }
    gameIsRunning = false;
    if (window.innerWidth > 750 && window.innerHeight > 850){
        canvas.width = 688;
        canvas.height = 688;
        tileSize = 43;
        tileCountX = canvas.width / tileSize;
        tileCountY = canvas.height / tileSize;
        indentation = 3
        snakePosX = 0;
        snakePosY = canvas.height / 2;
        snakeSpeed = tileSize;
        resetFood();
        velocityX = 1;
        velocityY = 0;
        snakeSpeed = tileSize;
        tail = [];
        snakeLength = 4;
        score = 0;
    } 
    if ((window.innerWidth > 600 && window.innerWidth <= 750) || (window.innerHeight > 700 && window.innerHeight <= 850)){
        canvas.width = 540;
        canvas.height = 540;
        tileSize = 36;
        tileCountX = canvas.width / tileSize;
        tileCountY = canvas.height / tileSize;
        indentation = 2;
        snakePosX = 0;
        snakePosY = (canvas.height - tileSize) / 2;
        snakeSpeed = tileSize;
        resetFood();
        velocityX = 1;
        velocityY = 0;
        snakeSpeed = tileSize;
        tail = [];
        snakeLength = 4;
        score = 0;
    }
    if ((window.innerWidth > 530 && window.innerWidth <= 600) || (window.innerHeight > 625 && window.innerHeight <= 700)){
        canvas.width = 480;
        canvas.height = 480;
        tileSize = 32;
        tileCountX = canvas.width / tileSize;
        tileCountY = canvas.height / tileSize;
        indentation = 2;
        snakePosX = 0;
        snakePosY = (canvas.height - tileSize) / 2;
        snakeSpeed = tileSize;
        resetFood();
        velocityX = 1;
        velocityY = 0;
        snakeSpeed = tileSize;
        tail = [];
        snakeLength = 3;
        score = 0;
    }
    if ((window.innerWidth > 400 && window.innerWidth <= 530) || (window.innerHeight > 475 && window.innerHeight <= 625)){
        canvas.width = 360;
        canvas.height = 360;
        tileSize = 24;
        tileCountX = canvas.width / tileSize;
        tileCountY = canvas.height / tileSize;
        indentation = 1;
        snakePosX = 0;
        snakePosY = (canvas.height - tileSize) / 2;
        snakeSpeed = tileSize;
        resetFood();
        velocityX = 1;
        velocityY = 0;
        snakeSpeed = tileSize;
        tail = [];
        snakeLength = 3;
        score = 0;
    }
    if ((window.innerWidth <= 400) || (window.innerHeight <= 625)){
        canvas.width = 270;
        canvas.height = 270;
        tileSize = 18;
        tileCountX = canvas.width / tileSize;
        tileCountY = canvas.height / tileSize;
        indentation = 1;
        snakePosX = 0;
        snakePosY = (canvas.height - tileSize) / 2;
        snakeSpeed = tileSize;
        resetFood();
        velocityX = 1;
        velocityY = 0;
        snakeSpeed = tileSize;
        tail = [];
        snakeLength = 3;
        score = 0;
    }
    gameIsRunning = true;
}
checkWindowSize();
function gameLoop(){
    if(gameIsRunning){
        drawEverything();
        moveEverything();
        //console.log(window.innerWidth);
        //console.log(window.innerHeight);
        setTimeout(gameLoop, 1000 / fps);
    }
}
resetFood();
gameLoop();

function rectangle(color, x, y, width, height){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawGrid(){
    for (let i = 0; i < tileCountX; i++){
        for (let j = 0; j < tileCountY; j++){
            if ((i === tileCountX - 1) & (j === tileCountY - 1)){
                rectangle('#373943', (tileSize * i), (tileSize * j), tileSize, tileSize);   
            }
            else if (i === tileCountX - 1){
                rectangle('#373943', (tileSize * i), (tileSize * j), tileSize, tileSize - 0.3);   
            }
            else if (j === tileCountY - 1){
                rectangle('#373943', (tileSize * i), (tileSize * j), tileSize - 0.3, tileSize);   
            }
            else{
                rectangle('#373943', (tileSize * i), (tileSize * j), tileSize - 0.3, tileSize - 0.3);   
            }
        }
    }
}

function drawEverything(){
    //background:
    rectangle('#E5E5E5', 0, 0, canvas.width, canvas.height);
    drawGrid();

    //food:
    rectangle('#4D8B31', foodPosX + indentation, foodPosY + indentation, tileSize - indentation*2 - 1, tileSize - indentation*2 - 1)

    tail.forEach((snakePart) =>
		rectangle("#B5B5B5", snakePart.x + indentation, snakePart.y + indentation, tileSize - indentation*2 - 1, tileSize - indentation*2 - 1)
    );

    //snake:
    rectangle('#DCDCDC', snakePosX + indentation, snakePosY + indentation, tileSize - indentation*2 - 1, tileSize - indentation*2 - 1);
}

function moveEverything(){
    snakePosX += snakeSpeed * velocityX
    snakePosY += snakeSpeed * velocityY

    // wall collision:
    if (snakePosX > canvas.width - tileSize + 1) {
        snakePosX = 0;
    }
    if (snakePosX < -1) {
        snakePosX = canvas.width;
    }
    if (snakePosY > canvas.height - tileSize + 1) {
        snakePosY = 0;
    }
    if (snakePosY < -1) {
        snakePosY = canvas.height;
    }

    // game over:
	tail.forEach((snakePart) => {
		if (snakePosX === snakePart.x && snakePosY === snakePart.y) {
			gameOver();
		}
	});

    tail.push({ x: snakePosX, y: snakePosY });

    tail = tail.slice(-1 * snakeLength);

    //food collision:
	if (snakePosX === foodPosX && snakePosY === foodPosY) {
        snakeLength += 0.5;
        fps += 0.1;
        score += 1;
		resetFood();
        if (score > 9){
            score_num.textContent = score;
        }
        else{
            score_num.textContent ='0' + score;
        }
        if (score > best_score){
            best_score = score;
            if (score > 9){
                best_score_num.textContent = best_score;
            }
            else{
                best_score_num.textContent ='0' + best_score;
            }
            localStorage.setItem("best_score", best_score)
        }
	}
}

function resetFood(){
    foodPosX = Math.floor(Math.random() * tileCountX) * tileSize;
    foodPosY = Math.floor(Math.random() * tileCountY) * tileSize;

    if (foodPosX === snakePosX && foodPosY === snakePosY) {
        resetFood();
    }
    
    if (
        tail.some(
            (snakePart) => snakePart.x === foodPosX && snakePart.y === foodPosY
        )
    ) {
        resetFood();
    }
}

function gameOver(){
    gameIsRunning = false;
    game_over_text.classList.add('active')
}

function playAgain(){
    resetFood();
    snakePosX = 0;
    snakePosY = (canvas.height - tileSize) / 2;
    fps = 10;
    score = 0;

    velocityX = 1;
    velocityY = 0;

    snakeSpeed = tileSize;

    tail = [];
    snakeLength = 3;
    score_num.textContent = '00';

    if (!gameIsRunning){
        gameIsRunning = true;
        gameLoop();
    }
    game_over_text.classList.remove('active')
    checkWindowSize();
}

function touchStart(event){
    xPositionStart = event.touches[0].clientX;
    yPositionStart = event.touches[0].clientY;
    //console.log(xPositionStart, yPositionStart);
}
function touchEnd(event){
    //console.log(event.changedTouches);
    xPositionEnd = event.changedTouches[0].clientX;
    yPositionEnd = event.changedTouches[0].clientY;
    console.log(xPositionEnd, yPositionEnd);
    changeVelocity();
}

function changeVelocity(){
    xPositionDifference = xPositionStart - xPositionEnd;
    yPositionDifference = yPositionStart - yPositionEnd;

    if (xPositionDifference != 0 || yPositionDifference != 0){
        if (yPositionDifference == 0){
            if (xPositionDifference < 0){
                if (velocityX !== -1){
                    velocityX = 1;
                    velocityY = 0
                }
            }
            else if (xPositionDifference > 0){
                if (velocityX !== 1){
                    velocityX = -1;
                    velocityY = 0
                }
            }
        }
        else if (xPositionDifference < 0){
            if (yPositionDifference < 0){
                if (xPositionDifference*-1 < yPositionDifference*-1){
                    if (velocityY !== -1){
                        velocityY = 1;
                        velocityX = 0
                    }
                }
                if (xPositionDifference*-1 > yPositionDifference*-1){
                    if (velocityX !== -1){
                        velocityX = 1;
                        velocityY = 0
                    }
                }
            }
            else if (yPositionDifference > 0){
                if (xPositionDifference*-1 < yPositionDifference){
                    if (velocityY !== 1){
                        velocityY = -1;
                        velocityX = 0
                    }
                }
                if (xPositionDifference*-1 > yPositionDifference){
                    if (velocityX !== -1){
                        velocityX = 1;
                        velocityY = 0
                    }
                }
            }
        }
        else if (xPositionDifference > 0){
            if (yPositionDifference < 0){
                if (xPositionDifference < yPositionDifference*-1){
                    if (velocityY !== -1){
                        velocityY = 1;
                        velocityX = 0
                    }
                }
                if (xPositionDifference > yPositionDifference*-1){
                    if (velocityX !== 1){
                        velocityX = -1;
                        velocityY = 0
                    }
                }
            }
            else if (yPositionDifference > 0){
                if (xPositionDifference < yPositionDifference){
                    if (velocityY !== 1){
                        velocityY = -1;
                        velocityX = 0
                    }
                }
                if (xPositionDifference > yPositionDifference){
                    if (velocityX !== 1){
                        velocityX = -1;
                        velocityY = 0
                    }
                }
            }
        }
        else if (xPositionDifference == 0){
            if (yPositionDifference < 0){
                if (velocityY !== -1){
                    velocityY = 1;
                    velocityX = 0
                }
            }
            else if (yPositionDifference > 0){
                if (velocityY !== 1){
                    velocityY = -1;
                    velocityX = 0
                }
            }
        }
    }
}

//keyboard:

function keyPush(event){
    switch (event.key){
        case 'ArrowLeft':
            if (velocityX !== 1){
                velocityX = -1;
                velocityY = 0
            }
            break;
        case 'ArrowRight':
            if (velocityX !== -1){
                velocityX = 1;
                velocityY = 0
            }
            break;
        case 'ArrowUp':
            if (velocityY !== 1){
                velocityY = -1;
                velocityX = 0
            }
            break;
        case 'ArrowDown':
            if (velocityY !== -1){
                velocityY = 1;
                velocityX = 0
            }
            break;
    }
}

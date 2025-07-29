const board = document.getElementById('score');
const canvas = document.getElementById('field');
const gameover = document.getElementById('gameover');
const restartBtn = document.getElementById('restart-btn');
const starterPage = document.getElementById('starter-page');
const backBtn = document.getElementById('back-btn');

const ctx = canvas.getContext('2d');

// Grid size
const box = 20;
const frog = new Image();
frog.src = './images/frog.png';

const snakeHead = new Image();
snakeHead.src = './images/snake-head.png';

const snakeBody = new Image();
snakeBody.src = './images/snake-body.png';
let game;
let speed;

// Snake and food positions
let snake = [{ x: 9 * box, y: 9 * box }];
let food = spawnFood();
let dircetion = null;
let score = 0;

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        // ctx.fillStyle = i === 0 ? 'green' : 'darkgreen';
        // ctx.fillRect(snake[i].x, snake[i].y,box, box);
        ctx.drawImage(i === 0 ? snakeHead : snakeBody, snake[i].x, snake[i].y, box, box);
    }

    ctx.drawImage(frog, food.x, food.y, box, box);
    // ctx.fillStyle = "red";
    // ctx.fillRect(food.x, food.y, box, box);
}

function updateSnake() {
    const head = { ...snake[0] }

    if (dircetion === 'LEFT') head.x -= box;
    else if (dircetion === 'RIGHT') head.x += box;
    else if (dircetion === 'UP') head.y -= box;
    else if (dircetion === 'DOWN') head.y += box;

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        food = spawnFood(); // change position of food
        board.textContent = "Score: " + (++score);
    } else {
        snake.pop(); // un set shifting if not ate
    }

    // Game over (Wall or self)
    if (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height ||
        isCollision(head, snake)
    ) {
        clearInterval(game);
        gameover.style.display = 'flex';
    }

    snake.unshift(head);
}

function isCollision(head, array) {
    return array.some(segment => segment.x === head.x && segment.y === head.y);
}

document.addEventListener('keydown', changeDirection);
function changeDirection(event) {
    const key = event.key ?? event;

    if (key === 'ArrowLeft' && dircetion !== 'RIGHT') dircetion = 'LEFT';
    else if (key === 'ArrowUp' && dircetion !== 'DOWN') dircetion = 'UP';
    else if (key === 'ArrowRight' && dircetion !== 'LEFT') dircetion = 'RIGHT';
    else if (key === 'ArrowDown' && dircetion !== 'UP') dircetion = 'DOWN';
}

function gameLoop() {
    updateSnake();
    drawGame();
}

function spawnFood() {
    let newFrog;

    // Avoid frog is overlapping snake's body
    do {
        newFrog = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box,
        };
    }while (snake.some(segment => segment.x === newFrog.x && segment.y === newFrog.y));

    return newFrog;
}

// start game
function startGame(modeSpeed = 180) {
    speed = modeSpeed;
    starterPage.style.display = 'none';

    clearInterval(game);
    game = setInterval(gameLoop, modeSpeed);
}

function resetGameState() {
    snake = [{x: 9 * box, y: 9 * box}];
    dircetion = null;
    score = 0;
    food = spawnFood();
}

restartBtn.addEventListener('click', restartGame);
function restartGame() {
    resetGameState();
    gameover.style.display = 'none';

    // Restart game loop
    clearInterval(game);
    game = setInterval(gameLoop, speed);
}

backBtn.addEventListener('click', back);
function back() {
    clearInterval(game);
    resetGameState();
    speed = 0;
    starterPage.style.display = 'flex';
    gameover.style.display = 'none';
}
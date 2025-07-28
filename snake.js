const board = document.getElementById('score');
const canvas = document.getElementById('field');
const ctx = canvas.getContext('2d');

// Grid size
const box = 20;
const frog = new Image();
frog.src = './images/frog.png';

const snakeHead = new Image();
snakeHead.src = './images/snake-head.png';

const snakeBody = new Image();
snakeBody.src = './images/snake-body.png';

// Snake and food positions
let snake = [{x: 9 * box, y: 9 * box}];
let food = spawnFood();
let dircetion = null;
let score = 0;

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        // ctx.fillStyle = i === 0 ? 'green' : 'darkgreen';
        // ctx.fillRect(snake[i].x, snake[i].y,box, box);
        ctx.drawImage(i ===0 ? snakeHead : snakeBody, snake[i].x, snake[i].y, box, box);
    }

    ctx.drawImage(frog, food.x, food.y, box, box);
    // ctx.fillStyle = "red";
    // ctx.fillRect(food.x, food.y, box, box);
}

function updateSnake() {
    const head = {...snake[0]}
    
    if (dircetion === 'LEFT') head.x -= box;
    else if (dircetion === 'RIGHT') head.x += box;
    else if (dircetion === 'UP') head.y -= box;
    else if (dircetion === 'DOWN') head.y += box;

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        food = spawnFood(); // change position of food
        board.textContent = "Score: "+ (++score);
    }else {
        snake.pop(); // un set shifting if not ate
    }

    // Game over (Wall or self)
    if (
        head.x < 0 || head.x >= canvas.width || 
        head.y < 0 || head.y >= canvas.height || 
        isCollision(head, snake)
    ) {
        clearInterval(game);
        // location.reload();
        alert('Game Over');
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

// start game
const game = setInterval(gameLoop, 180);

function spawnFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
}
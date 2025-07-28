const canvas = document.getElementById('field');
const ctx = canvas.getContext('2d');

// Grid size
const box = 20;
const rows = canvas.width;
const cols = canvas.height;

// Snake and food positions
let snake = [{x: 9 * box, y: 9 * box}];
let food = spawnFood();
let dircetion = null;
let sorce = 0;

function resizeCanvas() {
    const canvas = document.getElementById('field');
    
    const width = document.innerWidth < 500 ? 360 : 400;
    const height = document.innerHeight < 500 ? 360 : 400;

    canvas.width = width;
    canvas.height = height;

    console.log(canvas.width, canvas.height, window.innerWidth);
    
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'green' : 'darkgreen';
        ctx.fillRect(snake[i].x, snake[i].y,box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
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
        sorce++;
    }else {
        snake.pop(); // un set shifting if not ate
    }

    // Game over (Wall or self)
    if (
        head.x < 0 || head.x >= rows || 
        head.y < 0 || head.y >= cols || 
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
const game = setInterval(gameLoop, 150);

function spawnFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
}
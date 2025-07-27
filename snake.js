const canvas = document.getElementById('field');
const ctx = canvas.getContext('2d');

// Grid size
const box = 20;

// Snake and food positions
let snake = [{x: 9 * box, y: 9 * box}];
let food = spawnFood();
let dircetion = null;
let sorce = 0;

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
    
    if (dircetion === 'LEFT' && dircetion !== 'RIGHT') head.x -= box;
    else if (dircetion === 'RIGHT' && dircetion !== 'LEFT') head.x += box;
    else if (dircetion === 'UP' && dircetion !== 'DOWN') head.y -= box;
    else if (dircetion === 'DOWN' && dircetion !== 'UP') head.y += box;

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        food = spawnFood(); // change position of food
        sorce++;
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
    const key = event.key;

    if (key === 'ArrowLeft') dircetion = 'LEFT';
    else if (key === 'ArrowUp') dircetion = 'UP';
    else if (key === 'ArrowRight') dircetion = 'RIGHT';
    else if (key === 'ArrowDown') dircetion = 'DOWN';
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
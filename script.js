const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startButton');

canvas.width = 800;
canvas.height = 600;

let car = { x: canvas.width / 2, y: canvas.height - 70, width: 50, height: 100, speed: 5, dx: 0, dy: 0 };
let obstacles = [];
let score = 0;
let gameInterval;
let isGameOver = false;

startButton.addEventListener('click', startGame);
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function startGame() {
    score = 0;
    car = { x: canvas.width / 2, y: canvas.height - 70, width: 50, height: 100, speed: 5, dx: 0, dy: 0 };
    obstacles = [];
    isGameOver = false;
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, 1000 / 60);
}

function updateGame() {
    if (isGameOver) return;
    clearCanvas();
    moveCar();
    drawCar();
    handleObstacles();
    updateScore();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function keyDown(e) {
    if (e.key === 'ArrowLeft') car.dx = -car.speed;
    if (e.key === 'ArrowRight') car.dx = car.speed;
    if (e.key === 'ArrowUp') car.dy = -car.speed;
    if (e.key === 'ArrowDown') car.dy = car.speed;
}

function keyUp(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') car.dx = 0;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') car.dy = 0;
}

function moveCar() {
    car.x += car.dx;
    car.y += car.dy;

    // Prevent the car from moving out of the canvas boundaries
    if (car.x < 0) car.x = 0;
    if (car.x + car.width > canvas.width) car.x = canvas.width - car.width;
    if (car.y < 0) car.y = 0;
    if (car.y + car.height > canvas.height) car.y = canvas.height - car.height;
}

function drawCar() {
    ctx.fillStyle = 'red';
    ctx.fillRect(car.x, car.y, car.width, car.height);
}

function handleObstacles() {
    if (Math.random() < 0.02) {
        obstacles.push({ x: Math.random() * (canvas.width - 50), y: -100, width: 50, height: 100 });
    }

    for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        obs.y += car.speed;
        if (obs.y > canvas.height) {
            obstacles.splice(i, 1);
            score++;
        } else if (checkCollision(car, obs)) {
            gameOver();
        }
        ctx.fillStyle = 'blue';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
}

function checkCollision(car, obs) {
    return car.x < obs.x + obs.width &&
           car.x + car.width > obs.x &&
           car.y < obs.y + obs.height &&
           car.y + car.height > obs.y;
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    alert('Game Over! Your score: ' + score);
}


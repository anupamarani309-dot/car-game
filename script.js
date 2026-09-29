const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 400;
canvas.height = 600;

// Game variables
let gameRunning = false;
let score = 0;
let lives = 3;
let level = 1;
let gameSpeed = 4;

// Player car
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 50,
    speed: 0,
    maxSpeed: 7
};

// Arrays for obstacles and coins
let obstacles = [];
let coins = [];

// Keyboard controls
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Start game
function startGame() {
    document.getElementById('startScreen').classList.add('hidden');
    gameRunning = true;
    score = 0;
    lives = 3;
    level = 1;
    gameSpeed = 4;
    obstacles = [];
    coins = [];
    gameLoop();
}

// Draw player car
function drawPlayer() {
    // Car body
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Windows
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(player.x + 5, player.y + 10, 30, 15);
    ctx.fillRect(player.x + 5, player.y + 30, 30, 10);
    
    // Wheels
    ctx.fillStyle = '#000';
    ctx.fillRect(player.x + 8, player.y - 5, 8, 8);
    ctx.fillRect(player.x + 24, player.y - 5, 8, 8);
    ctx.fillRect(player.x + 8, player.y + player.height - 3, 8, 8);
    ctx.fillRect(player.x + 24, player.y + player.height - 3, 8, 8);
}

// Draw obstacle
function drawObstacle(obstacle) {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    
    // Windows
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(obstacle.x + 5, obstacle.y + 10, 30, 15);
}

// Draw coin
function drawCoin(coin) {
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(coin.x + 8, coin.y + 8, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Star in center
    ctx.fillStyle = '#FFA500';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', coin.x + 8, coin.y + 8);
}

// Update player position
function updatePlayer() {
    // Handle movement
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        if (player.x > 0) player.x -= player.maxSpeed;
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        if (player.x + player.width < canvas.width) player.x += player.maxSpeed;
    }
}

// Spawn obstacles
function spawnObstacle() {
    const lanes = [50, 150, 250, 350];
    const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
    const colors = ['#0000FF', '#00FF00', '#FFA500', '#FF1493'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    obstacles.push({
        x: randomLane - 20,
        y: -50,
        width: 40,
        height: 50,
        speed: gameSpeed,
        color: randomColor
    });
}

// Spawn coins
function spawnCoin() {
    const lanes = [50, 150, 250, 350];
    const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
    
    coins.push({
        x: randomLane - 8,
        y: -20,
        width: 16,
        height: 16,
        speed: gameSpeed
    });
}

// Update obstacles
function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].y += obstacles[i].speed;
        
        // Check collision with player
        if (checkCollision(player, obstacles[i])) {
            lives--;
            obstacles.splice(i, 1);
            if (lives <= 0) {
                endGame();
            }
        } else if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            score += 10;
        }
    }
}

// Update coins
function updateCoins() {
    for (let i = coins.length - 1; i >= 0; i--) {
        coins[i].y += coins[i].speed;
        
        // Check collision with player
        if (checkCollision(player, coins[i])) {
            coins.splice(i, 1);
            score += 50;
        } else if (coins[i].y > canvas.height) {
            coins.splice(i, 1);
        }
    }
}

// Collision detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Update HUD
function updateHUD() {
    document.getElementById('score').textContent = 'Score: ' + score;
    document.getElementById('lives').textContent = 'Lives: ' + lives;
    document.getElementById('speed').textContent = 'Level: ' + level;
}

// End game
function endGame() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = 'Final Score: ' + score;
    document.getElementById('gameOver').classList.remove('hidden');
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
    ctx.fillStyle = '#90EE90';
    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
    
    // Draw road lines
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 4, 0);
    ctx.lineTo(canvas.width / 4, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo((canvas.width / 4) * 2, 0);
    ctx.lineTo((canvas.width / 4) * 2, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo((canvas.width / 4) * 3, 0);
    ctx.lineTo((canvas.width / 4) * 3, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Update
    updatePlayer();
    updateObstacles();
    updateCoins();
    
    // Spawn new obstacles and coins
    if (Math.random() < 0.02) spawnObstacle();
    if (Math.random() < 0.01) spawnCoin();
    
    // Increase difficulty
    if (score > 0 && score % 300 === 0) {
        level++;
        gameSpeed = Math.min(gameSpeed + 0.5, 10);
    }
    
    // Draw everything
    drawPlayer();
    
    obstacles.forEach(obstacle => {
        drawObstacle(obstacle);
    });
    
    coins.forEach(coin => {
        drawCoin(coin);
    });
    
    updateHUD();
    
    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

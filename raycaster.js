const canvas = document.getElementById('raycaster');
const ctx = canvas.getContext('2d');

// Grid size
const gridSize = 10;
const rows = canvas.height / gridSize;
const cols = canvas.width / gridSize;

// Map (1 = wall, 0 = empty space)
const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Player position and angle
let playerX = 200;
let playerY = 200;
let playerAngle = Math.PI / 4;  // 45 degrees

// Raycasting constants
const fov = Math.PI / 3;  // Field of view (60 degrees)
const numRays = canvas.width / 2;  // Number of rays cast (width of canvas)
const maxDist = 1000;  // Maximum ray distance

// Draw the map and the player
function drawMap() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (map[y][x] === 1) {
                ctx.fillStyle = 'gray';
                ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
            }
        }
    }

    // Draw the player
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(playerX, playerY, 5, 0, Math.PI * 2);
    ctx.fill();
}

// Cast a single ray
function castRay(angle) {
    let rayX = playerX;
    let rayY = playerY;

    let sinA = Math.sin(angle);
    let cosA = Math.cos(angle);

    // Step size for ray traversal
    let stepSize = 5;

    // Step through the grid until a collision is found
    for (let dist = 0; dist < maxDist; dist += stepSize) {
        rayX += cosA * stepSize;
        rayY += sinA * stepSize;

        // Convert to grid coordinates
        const gridX = Math.floor(rayX / gridSize);
        const gridY = Math.floor(rayY / gridSize);

        if (map[gridY] && map[gridY][gridX] === 1) {
            return dist;
        }
    }

    return maxDist;
}

// Draw the rays (view frustum)
function drawRays() {
    let startAngle = playerAngle - fov / 2;

    for (let i = 0; i < numRays; i++) {
        let distance = castRay(startAngle);
        
        // Calculate the height of the wall slice based on distance
        let wallHeight = (canvas.height / distance) * 100;
        let wallWidth = canvas.width / numRays;

        // Set the color based on distance
        ctx.fillStyle = `hsl(${(distance % 360)}, 100%, 50%)`;
        ctx.fillRect(i * wallWidth, (canvas.height - wallHeight) / 2, wallWidth, wallHeight);

        // Increment the angle for the next ray
        startAngle += fov / numRays;
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawRays();
    requestAnimationFrame(gameLoop);
}

gameLoop();
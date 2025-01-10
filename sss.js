// Global Variables
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

var map = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1]
]

var w = false
var s = false
var a = false
var d = false

var xpos = 50
var ypos = 50

var winWidth = window.innerWidth
var winHeight = window.innerHeight
canvas.width = winWidth
canvas.height = winHeight

var rot = 0.0 // Initial rotation
var playerSpeed = 2; // Movement speed

function main() {
    ctx.clearRect(0, 0, winWidth, winHeight)

    // Draw the map
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] == 1) {
                fullRect(j * 50, i * 50, 50, 50) // Draw walls
            } else {
                rect(j * 50, i * 50, 50, 50) // Draw empty spaces
            }
        }
    }

    player(xpos, ypos) // Draw the player
    
    handleMovement() // Update player movement based on direction

    direction() // Draw the player's direction line

    requestAnimationFrame(main) // Main game loop
}

function direction() {
    // Draw the direction line where the player is facing
    var posx = xpos
    var posy = ypos
    var xnew = 50
    var ynew = 50
    var newx = xnew * Math.cos(rot) - ynew * Math.sin(rot)
    var newy = xnew * Math.sin(rot) + ynew * Math.cos(rot)

    line(posx, posy, posx + newx, posy + newy)

    // Handle rotation with A and D keys
    if (a == true) {
        rot -= 0.04 // Rotate left
    }
    if (d == true) {
        rot += 0.04 // Rotate right
    }
}

// Handle movement based on the player's direction
function handleMovement() {
    var nextX = xpos
    var nextY = ypos

    if (w == true) { // Move forward in the direction of the line
        nextX += playerSpeed * Math.cos(rot)
        nextY += playerSpeed * Math.sin(rot)
    }
    if (s == true) { // Move backward
        nextX -= playerSpeed * Math.cos(rot)
        nextY -= playerSpeed * Math.sin(rot)
    }

    // Check if the new position collides with walls
    if (!checkCollision(nextX, nextY)) {
        xpos = nextX
        ypos = nextY
    }
}

// Collision detection
function checkCollision(nextX, nextY) {
    var gridX = Math.floor(nextX / 50)
    var gridY = Math.floor(nextY / 50)

    // Check if the player is about to move into a wall
    if (map[gridY][gridX] == 1) {
        return true // Collides with a wall
    }
    return false // No collision
}

// Utility functions

function line(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.lineWidth = 2
    ctx.stroke()
}

function rect(x, y, width, height) {
    ctx.rect(x, y, width, height)
    ctx.strokeStyle = 'black'
    ctx.stroke()
}

function fullRect(x, y, width, height) {
    ctx.fillRect(x, y, width, height)
}

document.body.addEventListener('keydown', (event) => {
    if (event.key === 'w') {
        w = true
    }
    if (event.key === 's') {
        s = true
    }
    if (event.key === 'a') {
        a = true
    }
    if (event.key === 'd') {
        d = true
    }
})

document.body.addEventListener('keyup', (event) => {
    if (event.key === 'w') {
        w = false
    }
    if (event.key === 's') {
        s = false
    }
    if (event.key === 'a') {
        a = false
    }
    if (event.key === 'd') {
        d = false
    }
})

function player(x, y) {
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, 2 * Math.PI)
    ctx.fillStyle = 'red'
    ctx.fill()
}

requestAnimationFrame(main)

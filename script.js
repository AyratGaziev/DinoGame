let canvas = document.getElementById("game")
let ctx = canvas.getContext('2d')
let dinoWidth = 30
let dinoHeight = 40
let groundHeight = 20
let groundWidth = canvas.width
let dinoX = 20
let dinoY = canvas.height - groundHeight - dinoHeight
let jump = false
let dinoSpeed = 5
let cactus = {x: 590, y: 265, w: 15, h:15}
let cactusSpeed = 5
let popUp = document.querySelector('.pop-up')
let tryBtn = document.querySelector('.pop__button')
let score = 0
let dinoImg = new Image()
dinoImg.src = 'dino.png'
let cactusImg = new Image()
cactusImg.src = 'cactus.png'
let popUpScore = document.querySelector('.pop-up__score')

console.log(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/.test(navigator.userAgent))


function drawDino() {
    ctx.drawImage(dinoImg, dinoX, dinoY, dinoWidth, dinoHeight)
}

function drawGround() {
    ctx.beginPath()
    ctx.rect(0, canvas.height - groundHeight, groundWidth, groundHeight)
    ctx.fillStyle = 'black'
    ctx.fill()
    ctx.closePath()
}

function drawCactus() {
    ctx.drawImage(cactusImg, cactus.x, cactus.y, cactus.w, cactus.h)
}

function moveCactus() {
    if(cactus.x > 0) {
        cactus.x -= cactusSpeed
    } else {
        cactus.x = canvas.width
        let h = Math.floor(Math.random()*50)
        let w = Math.floor(Math.random()*30)
        cactus.h = h > 30 ? h : 20
        cactus.w = w > 20 ? w : 20
        cactus.y = canvas.height - groundHeight - cactus.h
        console.log(`cactus W = ${cactus.w} cactus H = ${cactus.h}`)
    }
}

function dinoJumpKey(e) {
    e.preventDefault()
    if(e.key == 'ArrowUp' || e.type == 'click') {
        jump = true
        console.log('jump')
    }
}

function dinoJump() {
    if(dinoY < canvas.height - groundHeight - dinoHeight - 80) {
        jump = false
        dinoY += dinoSpeed 
    } else if(!jump && dinoY + dinoSpeed > canvas.height - groundHeight - dinoHeight) {
        return
    } else if(!jump) {
        dinoY += dinoSpeed 
    }
    if(jump) {
        dinoY -= dinoSpeed 
    }

}

function drawScore() {
    ctx.font = "bold 12pt Open Sans"
    ctx.fillStyle = 'blueviolet'
    ctx.fillText(`SCORE: ${score}`, 10, 20 )
}

addEventListener('keydown', dinoJumpKey) 
tryBtn.addEventListener('click', (e) => {
    if(e.target.parentNode.style.opacity == 0) {return}
    document.location.reload()
})

addEventListener('click', dinoJumpKey) 


function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawDino()
    drawGround()
    dinoJump()
    drawCactus()
    moveCactus()
    drawScore()

    popUpScore.textContent = `Score: ${score}`

    if(dinoX + dinoWidth > cactus.x && dinoY + dinoHeight > cactus.y) {
        
        return popUp.style.opacity = '1', popUp.style.width = '200px', tryBtn.style.cursor = 'pointer'
        
    }

    if(dinoX + dinoWidth > cactus.x && dinoY + dinoHeight < cactus.y && dinoY < canvas.height - groundHeight - dinoHeight - 80) {
        score += 10
    }

    requestAnimationFrame(drawGame)
}

drawGame()
class Dino {
    constructor(canvas, groundHeight) {
        this.width = 126;
        this.height = 116;
        this.x = 50;
        this.y = canvas.height - groundHeight - this.height + 15;
        this.jump = false;
        this.speed = 9;
        this.img = new Image();
        this.img.src = "./img/run.png";
        this.runCounter = 0;
        this.time = 0;
        this.jumpTop = false;
    }

    drawDino(ctx, progress) {
        if (progress - this.time > 50) {
            this.runCounter += 1;
            if (this.runCounter > 7) this.runCounter = 0;
            this.time = progress;
        }
        ctx.drawImage(
            this.img,
            this.runCounter * 435,
            0,
            435,
            472,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
    jumpDino(game) {
        const {canvas, groundHeight, cactusCoords} = game;

        if(!this.jump) {
            return
        }

        if(!this.jumpTop && this.y >= cactusCoords.y - this.height * 1.8) {
            this.y -= this.speed;
        } else if(this.y <= cactusCoords.y - this.height * 1.8) {
            this.y += this.speed;
            this.jumpTop = true;
        } else if(this.jumpTop && this.y < canvas.height - groundHeight - this.height + 15) {
            this.y += this.speed;
        } else if(this.jumpTop && this.y <= canvas.height - groundHeight - this.height + 15 ){
            this.y = canvas.height - groundHeight - this.height + 15;
            this.jump = false;
            this.jumpTop = false;
        }
    }
}

class Game {
    constructor(Dino) {
        this.canvas = document.getElementById("game");
        this.ctx = this.canvas.getContext("2d");
        this.groundHeight = 70;
        this.groundWidth = this.canvas.width;
        this.dino = new Dino(this.canvas, this.groundHeight);
        this.cactusCoords = {
            x: this.canvas.width,
            y: this.canvas.height - this.groundHeight - 67,
            w: 55,
            h: 67
        };
        this.cactusSpeed = 8;
        this.cactusImg = new Image();
        this.cactusImg.src = "./img/cactus.svg";
        this.score = 0;
        this.popUp = document.querySelector(".pop-up");
        this.tryBtn = document.querySelector(".pop__button");
        this.popUpScore = document.querySelector(".pop-up__score");
        this.startBtn = document.querySelector('.start__btn')
        this.startMenu = document.querySelector('.start')
    }
    drawGround() {
        this.ctx.beginPath();
        this.ctx.rect(
            0,
            this.canvas.height - this.groundHeight,
            this.groundWidth,
            this.groundHeight
        );
        this.ctx.fillStyle = "#FFCB47";
        this.ctx.fill();
        this.ctx.closePath();
    }
    drawCactus() {

        this.ctx.drawImage(
            this.cactusImg,
            this.cactusCoords.x,
            this.cactusCoords.y,
            this.cactusCoords.w,
            this.cactusCoords.h
        );
    }
    moveCactus(updateScore) {
        if (this.cactusCoords.x > 0) {
            this.cactusCoords.x -= this.cactusSpeed;
        } else {
            if(updateScore) {
                this.score += 10;
            }
            this.cactusCoords.x = this.canvas.width;
            let w = Math.floor(Math.random() * 95);
            this.cactusCoords.w = w > 55 ? w : 55;
            this.cactusCoords.h = this.cactusCoords.w * 1.22;
            this.cactusCoords.y =
                this.canvas.height - this.groundHeight - this.cactusCoords.h;
        }
    }
    drawScore() {
        this.ctx.font = "bold 12pt Open Sans";
        this.ctx.fillStyle = "blueviolet";
        this.ctx.fillText(`SCORE: ${this.score}`, 10, 20);
    }
    dinoJumpKey(e) {
        e.preventDefault();
        if (e.key === "ArrowUp" || e.type === "click") {
            if (
                this.dino.y !==
                this.canvas.height - this.groundHeight - this.dino.height + 15
            ) {
                return;
            }
            this.dino.jump = true;
        }
    }
    init() {
        this.startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.runGame()
        })
        this.drawGround();
        this.drawCactus();
    }
    runGame() {
        this.startMenu.style.display = 'none'
        this.tryBtn.addEventListener("click", (e) => {
            if (e.target.parentNode.style.opacity == 0) {
                return;
            }

            e.stopPropagation();
            this.popUp.style.opacity = "0";
            this.popUp.style.width = "0";
            this.dino = new Dino(this.canvas, this.groundHeight);
            this.cactusCoords = {
                x: this.canvas.width,
                y: this.canvas.height - this.groundHeight - 67,
                w: 55,
                h: 67
            };
            this.score = 0;
            this.drawCactus();
            this.runGame()

            // document.location.reload();
        });

        document.addEventListener("click", (e) => this.dinoJumpKey(e));
        document.addEventListener("keydown", (e) => this.dinoJumpKey(e));

        this.startTime = performance.now();

        const drawGame = (time) => {
            if (!this.startTime) this.startTime = time;
            this.progress = time - this.startTime;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawGround();
            this.drawCactus();
            this.moveCactus(true);
            this.drawScore();
            this.dino.drawDino(this.ctx, this.progress);
            this.dino.jumpDino(this);

            this.popUpScore.textContent = `Score: ${this.score}`;

            if (
                this.dino.x <= this.cactusCoords.x + this.cactusCoords.w * 0.7 &&
                this.dino.x + this.dino.width >= this.cactusCoords.x + this.cactusCoords.w * 0.3 &&
                this.dino.y + this.dino.height >= this.cactusCoords.y + this.cactusCoords.h * 0.5
            ) {
                return (
                    (this.popUp.style.opacity = "1"),
                    (this.popUp.style.width = "200px"),
                    (this.tryBtn.style.cursor = "pointer")
                );
            }

            console.log('this.dino.x', this.dino.x);
            console.log('this.cactusCoords.x', this.cactusCoords.x);
            console.log(this.dino.jump)

            if (
                this.dino.x > this.cactusCoords.x + this.cactusCoords.w * 2 &&
                this.dino.jump === false
            ) {
                this.score += 10;
            }

            requestAnimationFrame(drawGame);
        };
        drawGame();
    }
}

const game = new Game(Dino);
game.init()

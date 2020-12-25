class Dino {
    constructor(canvas, groundHeight) {
        this.width = 30;
        this.height = 40;
        this.x = 20;
        this.y = canvas.height - groundHeight - this.height;
        this.jump = false;
        this.speed = 5;
        this.img = new Image();
        this.img.src = "./img/dino.png";
    }
    drawDino(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    jumpDino(canvas, groundHeight) {
        if (this.y < canvas.height - groundHeight - this.height - 80) {
            this.jump = false;
            this.y += this.speed;
        } else if (
            !this.jump &&
            this.y + this.speed > canvas.height - groundHeight - this.height
        ) {
            return;
        } else if (!this.jump) {
            this.y += this.speed;
        }
        if (this.jump) {
            this.y -= this.speed;
        }
    }
}

class Game {
    constructor(Dino) {
        this.canvas = document.getElementById("game");
        this.ctx = this.canvas.getContext("2d");
        this.groundHeight = 20;
        this.groundWidth = this.canvas.width;
        this.dino = new Dino(this.canvas, this.groundHeight);
        this.cactusCoords = { x: 590, y: 265, w: 15, h: 15 };
        this.cactusSpeed = 5;
        this.cactusImg = new Image();
        this.cactusImg.src = "./img/cactus.png";
        this.score = 0;
        this.popUp = document.querySelector(".pop-up");
        this.tryBtn = document.querySelector(".pop__button");
        this.popUpScore = document.querySelector(".pop-up__score");
    }
    drawGround() {
        this.ctx.beginPath();
        this.ctx.rect(
            0,
            this.canvas.height - this.groundHeight,
            this.groundWidth,
            this.groundHeight
        );
        this.ctx.fillStyle = "black";
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
    moveCactus() {
        if (this.cactusCoords.x > 0) {
            this.cactusCoords.x -= this.cactusSpeed;
        } else {
            this.cactusCoords.x = this.canvas.width;
            let h = Math.floor(Math.random() * 50);
            let w = Math.floor(Math.random() * 30);
            this.cactusCoords.h = h > 30 ? h : 20;
            this.cactusCoords.w = w > 20 ? w : 20;
            this.cactusCoords.y =
                this.canvas.height - this.groundHeight - this.cactusCoords.h;
            console.log(
                `cactus W = ${this.cactusCoords.w} cactus H = ${this.cactusCoords.h}`
            );
        }
    }
    drawScore() {
        this.ctx.font = "bold 12pt Open Sans";
        this.ctx.fillStyle = "blueviolet";
        this.ctx.fillText(`SCORE: ${this.score}`, 10, 20);
    }
    runGame() {
        const dinoJumpKey = (e) => {
            e.preventDefault();
            if (e.key == "ArrowUp" || e.type == "click") {
                this.dino.jump = true;
                console.log("jump");
            }
        };

        addEventListener("keydown", dinoJumpKey);
        this.tryBtn.addEventListener("click", (e) => {
            if (e.target.parentNode.style.opacity == 0) {
                return;
            }
            document.location.reload();
        });

        addEventListener("click", dinoJumpKey);

        const drawGame = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.dino.drawDino(this.ctx);
            this.dino.jumpDino(this.canvas, this.groundHeight);
            this.drawGround();
            this.drawCactus();
            this.moveCactus();
            this.drawScore();

            this.popUpScore.textContent = `Score: ${this.score}`;

            if (
                this.dino.x + this.dino.width > this.cactusCoords.x &&
                this.dino.y + this.dino.height > this.cactusCoords.y
            ) {
                return (
                    (this.popUp.style.opacity = "1"),
                    (this.popUp.style.width = "200px"),
                    (this.tryBtn.style.cursor = "pointer")
                );
            }

            if (
                this.dino.x + this.dino.width > this.cactusCoords.x &&
                this.dino.y + this.dino.height < this.cactusCoords.y &&
                this.dino.y <
                    this.canvas.height -
                        this.groundHeight -
                        this.dino.height -
                        80
            ) {
                this.score += 10;
            }

            requestAnimationFrame(drawGame);
        };
        drawGame();
    }
}

const game = new Game(Dino);
game.runGame();

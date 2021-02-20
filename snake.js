/*=================== Load elements ========================*/
const canvas = document.getElementById('grid');
const scoreLabel = document.getElementById('score-label');
const bestScoreLabel = document.getElementById('best-score-label');
const context = canvas.getContext('2d');
/*=========================================================*/
const sound = new Audio("hit-food.mp3");

blocksCount = 20; // Split the canvas into 20 blocks
blockSize = canvas.width / blocksCount - 2;


class Piece {
	// This class handles the snake pieces
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}


class Game {
	constructor() {
		this.gameAlive = true;
		this.gameSpeed = 7;
		this.score = 0;
		this.bestScore = 0;

		/*============ Snake properties ==============*/
		this.x = 10;
		this.y = 10;
		this.snakePieces = [];
		this.snakeLength = 0;
		this.velX = 0;
		this.velY = 0;
		/*===========================================*/

		this.foodX = Math.floor(Math.random() * 26);
		this.foodY = Math.floor(Math.random() * 26);
	}
	
	play() {
		game.changePos();
		game.gameAlive = game.isGameAlive();
		if(game.gameAlive) {
			game.clearScreen();
			
			game.checkFoodCollision();
			
			game.drawFood();
			game.drawSnake();
			setTimeout(game.play, 1000 / game.gameSpeed);
		} else {
			context.fillStyle = "#50fa7b";
			context.font = "50px Abril Text"
			context.textAlign = "center;"
			context.fillText("Game over!", canvas.width/4, canvas.height/2-50);
			
			context.font = "20px Abril Text"
			context.fillText("Press SPACE to keep playing", canvas.width/4, canvas.height/2);
			
			if (game.score > game.bestScore) {
				game.bestScore = game.score;
				bestScoreLabel.innerHTML = `Best score: ${game.bestScore}`.bold();
			}
		}
	}

	isGameAlive() {
		let gameAlive = true;

		if(game.velY === 0 && game.velX === 0){
			return gameAlive;
		}
		
		if(game.x < 0 || game.x == 26 || game.y < 0 || game.y == 26) {
			gameAlive = false;
		}

		for (let piece of game.snakePieces) {
			if (piece.x === game.x && piece.y === game.y) {
				gameAlive = false;
				break;
			}
		}
		
		return gameAlive;
	}


	drawSnake() {
		context.fillStyle = '#ff5555';
		for(let piece of game.snakePieces) {
			context.fillRect(piece.x * blocksCount, piece.y * blocksCount, blockSize, blockSize);
		}
		
		game.snakePieces.push(new Piece(game.x, game.y));
		if(game.snakePieces.length > game.snakeLength) {
			game.snakePieces.shift();
		}
		
		context.fillRect(game.x * blocksCount, game.y * blocksCount, blockSize, blockSize);
	}

	drawFood() {
		context.fillStyle = '#f1fa8c';
		context.fillRect(game.foodX * blocksCount, game.foodY * blocksCount, blockSize, blockSize);
	}

	changePos() {
		game.x += game.velX;
		game.y += game.velY;
	}

	checkFoodCollision() {
		if (game.x == game.foodX && game.y == game.foodY) {
			game.foodX = Math.floor(Math.random() * 26);
			game.foodY = Math.floor(Math.random() * 26);
			game.snakeLength++;
			game.gameSpeed+=.5;
			game.score++;
			
			sound.play();
			scoreLabel.innerHTML = `Score: ${game.score}`.bold();
		}
	}

	clearScreen() {
		context.fillStyle = '#282a36';
		context.fillRect(0, 0, canvas.width, canvas.height);
	}

	restartGame() {
		// Reset the values to their default
		game.score = 0;
		scoreLabel.innerHTML = `Score: ${game.score}`.bold();
		
		game.snakePieces = [];
		game.snakeLength = 0;
		game.x = 10;
		game.y = 10;
		game.velX = 0;
		game.velY = 0;
		game.gameSpeed = 7;
		game.foodX = Math.floor(Math.random() * 26);
		game.foodY = Math.floor(Math.random() * 26);
		
		game.gameAlive = true;
		game.play();
	}

	move(event) {
		switch (event.key) {
			case "a":
			case "ArrowLeft":
				if (game.velX != 1) {
					game.velY = 0;
					game.velX = -1;
				}
				break;
			case "d":
			case "ArrowRight":
				if (game.velX != -1) {
					game.velY = 0;
					game.velX = 1;
				}
				break;
			case "w":
			case "ArrowUp":
				if (game.velY != 1) {
					game.velY = -1;
					game.velX = 0;
				}
				break;
			case "s":
			case "ArrowDown":
				if (game.velY != -1) {
					game.velY = 1;
					game.velX = 0;
				}
				break;
			case " ":
				if (!game.gameAlive) {
					game.restartGame();
				}
		}
	}
}

const game = new Game();
document.body.addEventListener('keydown', game.move)
game.play();


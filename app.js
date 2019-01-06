// Refresh scoreboard
document.getElementById('scoreboard').src = document.getElementById('scoreboard').src


var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var direction = "none";
var lastDirection = "none";
var lengthCount = 0;
var score = 0;
var scoreText = document.getElementById("score"); // Score counter
var scoreSubmit = document.getElementById("scoresubmit"); // Score submission text box and submit button
// Hide score submission until game is over
scoreSubmit.style.visibility = "hidden";

gameOver = false;
gameWon = false;

// Draw start text
ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, 1200, 800);
ctx.textAlign = "center";
ctx.font = "30px Arial";
ctx.fillStyle = "white";
ctx.fillText("Press arrow key to begin", 600, 400);

var updateSnake = function() {
	// Check if game is won based on snake length
	if (snake.length === 9600) {
		gameWon = true;
	}
	// Keep track of last snake direction so that the snake does not go backwards into itself
	lastDirection = direction;
	
	//Move snake by adding block in direction of movement
	if (direction === "up") {
		snake.push({x:snake[snake.length - 1].x, y:snake[snake.length - 1].y - 10});
	}
	if (direction === "down") {
		snake.push({x:snake[snake.length - 1].x, y:snake[snake.length - 1].y + 10});
	}
	if (direction === "left") {
		snake.push({x:snake[snake.length - 1].x - 10, y:snake[snake.length - 1].y});
	}
	if (direction === "right") {
		snake.push({x:snake[snake.length - 1].x + 10, y:snake[snake.length - 1].y});
	}
	
	// Elongate snake when food is eaten
	if (lengthCount > 0) {
		lengthCount--;
	} else {
		// Move snake by removing last block
		snake.shift();
	}
	
	// Check if snake has collided with food block
	if (snake[snake.length - 1].x === food.x && snake[snake.length - 1].y === food.y) {
		// Generate new food
		food = createFood();
		// Elongate snake by 10 blocks
		lengthCount = 10;
		// Update score
		score += 10;
		scoreText.innerHTML = score;
	}
	
	// Check if snake has collided with itself
	if (collideSnake(snake[snake.length - 1])) {
		gameOver = true;
	}
	
	// Check if snake has collided with walls of play area
	if (snake[snake.length - 1].x < 0 || snake[snake.length - 1].x > 1190) {
		gameOver = true;
	}
	
	if (snake[snake.length - 1].y < 0 || snake[snake.length - 1].y > 790) {
		gameOver = true;
	}
}

// Game loop - Updates and draws game
var loop = function() {
	if (!gameOver && !gameWon) {
		updateSnake();
		
		// Draw snake
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, 1200, 800);
		ctx.fillStyle = "white";
		for (i = 0; i < snake.length; i++) {
			ctx.fillRect(snake[i].x, snake[i].y, 10, 10);
		}
		
		// Draw food
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(food.x, food.y, 10, 10);
	} else if (gameOver) {
		// Stop game loop when game is over
		clearInterval(gameloop);
		
		// Display game over text
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, 1200, 800);
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("Game Over", 600, 400);
		
		// Show score submission controls
		scoreSubmit.style.visibility = "visible";
	} else {
		// Stop game loop and show win text
		clearInterval(gameloop);
		// Display game over text
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, 1200, 800);
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("You Win!", 600, 400);
	}
}
// Check if any block of the snake is collided with the given point
var collideSnake = function({x, y}) {
	// To prevent self collision, exclude the head of the snake if the head is the given point
	var upperBound;
	if (x === snake[snake.length - 1].x && y === snake[snake.length - 1].y) {
		upperBound = snake.length - 1;
	} else {
		upperBound = snake.length;
	}
	
	// Iterate through all blocks of snake to check for collision
	for (i = 0; i < snake.length - 1; i++) {
		if (x === snake[i].x && y === snake[i].y) {
			return true;
		}
	}
	return false;
}

// Generate food block at a random location that is not within the snake
var createFood = function() {
	do {
		x = 10 * Math.floor(Math.random() * 120);
		y = 10 * Math.floor(Math.random() * 80);
	} while (collideSnake({x, y}));
	return {x, y};
}

// Initiate game
var init = function() {
	snake = [{x: 600, y: 400}];
	gameloop = setInterval(loop, 60);
	food = createFood();
}

// Check for key presses
document.onkeydown = function(event) {
	keyCode = window.event.keyCode; 
    keyCode = event.keyCode;
	
	// Begin the game when an arrow key is pressed
	if (direction === "none") {
		init();
	}
	
	// Set direction based on key press. Prevent the snake from going backwards in on itself
	switch(keyCode) {
		case 37: 
			if (lastDirection != 'right') {
				direction = 'left';
			}
			break;

        case 39:
			if (lastDirection != 'left') {
				direction = 'right';
			}
			break;

        case 38:
			if (lastDirection != 'down') {
				direction = 'up';
			}
			break;

        case 40:
			if (lastDirection != 'up') {
				direction = 'down';
			}
			break;
	}
}

// When submit button is pressed, send name and score to score.php
document.getElementById("submitbtn").addEventListener("click", function(){
	window.location.href = "score.php?name=" + document.getElementById("name").value + "&score=" + score
});
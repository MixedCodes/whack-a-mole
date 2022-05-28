let seconds = 10;
const defaultMin = 500;
const defaultMax = 1000;
const defaultSpeed = 10;
const defaultLives = 5;
let gameOverEnabled = true;
let testMode = false;
const difficulty = 0;

let hole1 = ".hole"
const holes = document.querySelectorAll(".hole");
const moles = document.querySelectorAll(".mole");
let lastHole;
const scoreSpan  = document.getElementById("score-board");
const highscoreSpan = document.getElementById("highscore");
const timerSpan = document.getElementById("timer");
const lives = document.getElementById("lives");
const startButton = document.getElementById("start");
const defaultStartButtonText = startButton.textContent;



let timeUp = false;
let started = false;
let score = 0;
let livesLeft = 0;
let timeLeft = seconds;
let highscore = highscoreSpan.textContent;
// let missed = 0

let gameTimeOut

let moleTimeOut;

let timer;


function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomHole(holes){
 	const index = Math.floor(Math.random() * holes.length);
 	const hole = holes[index];
 	if (hole == lastHole) {
   		return getRandomHole(holes)
 	}
 	lastHole = hole
 	return hole
}

function pop() {
	let speed = defaultSpeed;
	// if (score > speed) {
	speed = score;
	if (defaultMin - speed * 10 <= 10) {
	speed = defaultMin - 10
	}
	let min = defaultMin - ((speed * 10) * 1 + (difficulty / 10));
	let max = defaultMax - ((speed * 10) * 1 + (difficulty / 10));

   	const time = getRandomInt(min, max);
    const hole = getRandomHole(holes);
	const type = getRandomInt(1, 100);
	if (type <= 20) {
		hole.classList.add("bomb");
	} else if (type <= 40 && type > 21) {
		hole.classList.add("coin");
	}

    hole.classList.add("up");
    moleTimeOut = window.setTimeout(function() {
     	if (hole.classList.contains("up")) {
    		hole.classList.remove("up");
			hole.classList.remove("bomb");
			hole.classList.remove("coin");
    		livesLeft --;
    		lives.textContent = livesLeft;
    		gameOver();
    	}
      	if (started) pop();
    }, time)
}
 
function start() {
	if (started) return;
	// checkTestMode();
	startButton.textContent = "เริ่มใหม่";
	startButton.onclick = confirm;
	started = true;
	scoreSpan.textContent = 0;
	timerSpan.textContent = timeLeft;
	score = 0;
	missed = 0;
	livesLeft = defaultLives;
	lives.textContent = defaultLives;
	pop();
	countdown();
	gameTimeOut = window.setTimeout(function() {
		started = false;
		retry();
	}, seconds * 1000)

	// setTimeout(() => {
	// 	started = false;
	// }, milliseconds);
}

function gameOver() {
	if (!gameOverEnabled) return;
	if (livesLeft <= 0) {
		started = false;
		clearTimeout(gameTimeOut);
		clearTimeout(moleTimeOut);
		clearTimeout(timer);
		timerSpan.textContent = 0;
		checkHighscore();
		// timerSpan.textContent = 0
		lastHole.classList.remove("up");
		lastHole.classList.remove("bomb");
		lastHole.classList.remove("coin");
		retry();
	}
}

function whack(click) {
	if (!click.isTrusted) return;
	if (this.parentNode.classList.contains("up")) {
		if (this.parentNode.classList.contains("bomb")) {
			if (score <= 0) return;
			score--;
		} else if (this.parentNode.classList.contains("coin")) {
			score += 2;
		} else {
			score ++;
		}
		this.parentNode.classList.remove("up");
		this.parentNode.classList.remove("bomb");
		this.parentNode.classList.remove("coin");
	}
	scoreSpan.textContent = score;
}

function retry() {
	startButton.textContent = "เริ่มใหม่";
	startButton.onclick = start;
}

function confirm() {
	startButton.style.color = "#FFFFFF";
	startButton.style.backgroundColor = "#E6564E";
	startButton.textContent = "กดอีกรอบเพื่อเริ่มใหม่";
	startButton.onclick = confirmed;
	
}

function confirmed() {
	livesLeft = 0
	gameOver()
	start();
	startButton.style.color = "#E6564E";
	startButton.style.backgroundColor = "#FFFFFF";
	startButton.textContent = "เริ่มใหม่";
}

function checkHighscore() {
	if (score > highscore && !started) {
		highscore = score;
		highscoreSpan.textContent = score;
		localStorage.setItem("highscore", score);
	}
}

function countdown() {	
	timer = window.setTimeout(function() {
		if (timerSpan.textContent <= 0) {
			checkHighscore();
			return;
		}
		timerSpan.textContent--;
		countdown();
	}, 1000);
}

// function checkTestMode() {
// 	if (testMode = true) {
// 		gameOverEnabled = false;
// 		seconds = seconds * 10;
// 	}
// }

moles.forEach(mole => mole.addEventListener('click', whack));
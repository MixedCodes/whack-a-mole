let seconds = 10;
let defaultMin = 500;
let defaultMax = 1000;
let defaultSpeed = 10;
let defaultlivesLeft = 5;
const gameOverEnabled = true;
let difficulty = 0;

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
const gameTimeOut = setTimeout(function() {
    started = false;
    retry();
	}, seconds * 1000);

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
    hole.classList.add("up");
    moleTimeOut = window.setTimeout(function() {
     	if (hole.classList.contains("up")) {
    		hole.classList.remove("up");
    		livesLeft --;
    		lives.textContent = livesLeft;
    		gameOver();
    	}
      	if (started) pop();
    }, time)
}
 
function start() {
	if (started) return;
	startButton.textContent = "เริ่มใหม่";
	startButton.onclick = confirm;
	started = true;
	scoreSpan.textContent = 0;
	timerSpan.textContent = timeLeft;
	score = 0;
	missed = 0;
	livesLeft = defaultlivesLeft;
	lives.textContent = defaultlivesLeft;
	pop();
	countdown();
	gameTimeOut;

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
		retry();
	}
}

function whack(click) {
	if (!click.isTrusted) return;
	if (this.parentNode.classList.contains("up")) {
		score ++;
		this.parentNode.classList.remove("up");
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

moles.forEach(mole => mole.addEventListener('click', whack));
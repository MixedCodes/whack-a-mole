let seconds = 20;
const defaultMin = 1000;
const defaultMax = 1500;
const defaultSpeed = 10;
const point = 10;
const defaultScore = 0;

const defaultLives = 5;
let gameOverEnabled = true;
let testMode = false;
let refresh = false;
const difficulty = 0;

let hole1 = ".hole"
const holes = document.querySelectorAll(".hole");
const moles = document.querySelectorAll(".mole");
let lastHole;
const lives = document.getElementById("lives");
const scoreSpan  = document.getElementById("score-board");
// const highscoreSpan = document.getElementById("highscore");
const timerSpan = document.getElementById("timer");
const startButton = document.getElementById("start");
const defaultStartButtonText = startButton.textContent;
const container = document.querySelector(".container");
const tel = document.getElementById("tel");
const earnPointUrl = "https://script.google.com/macros/s/AKfycbw9CjYyKuRx72cozBVcu0oDFcMNxHlb5nHjec_z8dzvpB9gcHNkFKBAcOIj2dgVgIDl/exec?phone="

let timeUp = false;
let started = false;
let score = 0;
let livesLeft = 0;
let timeLeft = seconds;
let won = false;
// let highscore = highscoreSpan.textContent;
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
	let min = defaultMin - ((speed * 10) * (1 + (difficulty / 10)));
	let max = defaultMax - ((speed * 10) * (1 + (difficulty / 10)));

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
			if (!hole.classList.contains("bomb")) {
				livesLeft--;
				console.log("missed");
			}
			hole.classList.remove("bomb");
			hole.classList.remove("coin");
    		lives.textContent = livesLeft;
    		gameOver();
    	}
      	if (started) pop();
    }, time)
}
 
function start() {
	if (started) return;
	// checkTestMode();
	clearTimeout(gameTimeOut);
	clearTimeout(moleTimeOut);
	clearTimeout(timer);
	startButton.textContent = "เริ่มใหม่";
	startButton.onclick = confirm;
	scoreSpan.style.color = "#E6564E";
	scoreSpan.style.backgroundColor = "#FFFFFF";
	scoreSpan.style.fontWeight = "700";
	started = true;
	scoreSpan.textContent = defaultScore;
	timerSpan.textContent = timeLeft;
	score = defaultScore;
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
		checkMaxScore();
		checkScore();
		// timerSpan.textContent = 0
		retry();
		lastHole.classList.remove("up");
		lastHole.classList.remove("bomb");
		lastHole.classList.remove("coin");
	}
}

function checkMaxScore() {
	if (score >= 15) {
		scoreSpan.style.color = "#B69B54";
		scoreSpan.style.fontWeight = "900";
		won = true;
	}
}

function whack(click) {
	if (!click.isTrusted) return;
	if (this.parentNode.classList.contains("up")) {
		if (this.parentNode.classList.contains("bomb")) {
			livesLeft--;
			console.log("whacked a bomc");
			lives.textContent = livesLeft;
			gameOver();
			if (score <= 0) return;
			if (score >= 15) return;
			score--;
		} else if (this.parentNode.classList.contains("coin")) {
			if (score >= 15) return;
			if (score === 14) {
				score++;
			} 
			else {
				score+= 2;
			}
			checkMaxScore();
		} else {
			if (score >= 15) return;
			score++;
			checkMaxScore();
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

function checkScore() {
	// if (score > highscore && !started) {
	// 	highscore = score;
	// 	highscoreSpan.textContent = score;
	// 	localStorage.setItem("highscore", score);
	// }
	if (score === 15 || won === true) {
		container.classList.add("open");
		console.log("won");
	}
}

function countdown() {	
	timer = window.setTimeout(function() {
		if (timerSpan.textContent <= 0) {
			checkScore();
			return;
		}
		timerSpan.textContent--;
		countdown();
	}, 1000);
}

function closePopUp() {
	console.log("closing");
	container.classList.remove("open");
}

function earnPoint() {
	if (!container.classList.contains("open")) return;
	// const response = await fetch(`${earnPointUrl}${tel.value}&point=${point}`);
	fetch(`${earnPointUrl}${tel.value}&point=${point}`).then(res => console.log(res)).catch(err => console.log(err))
	container.classList.remove("open");
}
// function checkTestMode() {
// 	if (testMode === true) {
// 		gameOverEnabled = false;
// 		seconds = seconds * 10;
// 	}
// }

// function checkRefresh() {
// 	if (refresh === true) {
// 		location.reload();
// 	}
// }

moles.forEach(mole => mole.addEventListener('click', whack));

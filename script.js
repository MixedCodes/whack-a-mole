const holes = document.querySelectorAll(".hole");
const moles = document.querySelectorAll(".mole");
const scoreBoard  = document.getElementById("score");
const timer = document.getElementById("timer");
let lastHole;
let timeUp = false;
let started = false;
let score = 0;
let milliseconds = 10000;
let timeLeft = milliseconds / 10;
let min = 500;
let max = 1500;


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
   	const time = getRandomInt(500, 1000);
    const hole = getRandomHole(holes);
    hole.classList.add("up");
    setTimeout(() => {
      	hole.classList.remove("up");
      	if (started) pop();
    }, time);
}
 
function start() {
	if (started) return;
	started = true;
	scoreBoard.textContent = 0;
	score = 0;
	pop();
	setTimeout(() => {
		started = false;
	}, milliseconds);
}

function whack(click) {
	if (!click.isTrusted) return;
	if (this.parentNode.classList.contains("up")) {
		score ++;
		this.parentNode.classList.remove("up");
	}
	scoreBoard.textContent = score;
}

moles.forEach(mole => mole.addEventListener('click', whack));
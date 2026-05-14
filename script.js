const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originTextElement = document.querySelector("#origin-text p");
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");
const wpmDisplay = document.querySelector("#wpm");
const errorsDisplay = document.querySelector("#errors");
const scoreList = document.querySelector("#score-list");

const typingTexts = [
    "The text to test.",
    "JavaScript makes websites interactive and dynamic.",
    "Practice typing every day to improve your speed and accuracy.",
    "A good programmer writes code that is clear and easy to maintain.",
    "The timer starts when you begin typing and stops when the text matches exactly."
];

let originText = originTextElement.innerHTML;
let timer = [0, 0, 0, 0];
let interval;
let timerRunning = false;
let errors = 0;
let mistakeActive = false;

// Add leading zero to numbers 9 or below (purely for aesthetics):
function leadingZero(time) {
    if (time <= 9) {
        time = "0" + time;
    }

    return time;
}

// Run a standard minute/second/hundredths timer:
function runTimer() {
    let currentTime = leadingZero(timer[0]) + ":" + leadingZero(timer[1]) + ":" + leadingZero(timer[2]);
    theTimer.innerHTML = currentTime;

    timer[3]++;

    timer[0] = Math.floor((timer[3] / 100) / 60);
    timer[1] = Math.floor((timer[3] / 100) - (timer[0] * 60));
    timer[2] = Math.floor(timer[3] - (timer[1] * 100) - (timer[0] * 6000));

    updateWPM();
}

// Match the text entered with the provided text on the page:
function spellCheck() {
    let textEntered = testArea.value;
    let originTextMatch = originText.substring(0, textEntered.length);

    if (textEntered === originText) {
        clearInterval(interval);
        testWrapper.style.borderColor = "green";
        saveScore();
    } else {
        if (textEntered === originTextMatch) {
            testWrapper.style.borderColor = "blue";
            mistakeActive = false;
        } else {
            testWrapper.style.borderColor = "red";

            if (!mistakeActive) {
                errors++;
                errorsDisplay.innerHTML = errors;
                mistakeActive = true;
            }
        }
    }
}

// Start the timer:
function start() {
    let textEnteredLength = testArea.value.length;

    if (textEnteredLength === 0 && !timerRunning) {
        timerRunning = true;
        interval = setInterval(runTimer, 10);
    }
}

// Reset everything:
function reset() {
    clearInterval(interval);

    let randomIndex = Math.floor(Math.random() * typingTexts.length);
    originTextElement.innerHTML = typingTexts[randomIndex];
    originText = originTextElement.innerHTML;

    interval = null;
    timer = [0, 0, 0, 0];
    timerRunning = false;
    errors = 0;
    mistakeActive = false;

    testArea.value = "";
    theTimer.innerHTML = "00:00:00";
    testWrapper.style.borderColor = "grey";
    wpmDisplay.innerHTML = "0";
    errorsDisplay.innerHTML = "0";
}

// Calculate WPM:
function updateWPM() {
    let totalSeconds = timer[3] / 100;

    if (totalSeconds > 0) {
        let wpm = Math.round((testArea.value.length / 5) / (totalSeconds / 60));
        wpmDisplay.innerHTML = wpm;
    }
}

// Save top three scores:
function saveScore() {
    let finalTime = theTimer.innerHTML;
    let totalSeconds = timer[3] / 100;
    let finalWPM = wpmDisplay.innerHTML;

    let scores = JSON.parse(localStorage.getItem("typingScores")) || [];

    scores.push({
        time: finalTime,
        seconds: totalSeconds,
        wpm: finalWPM
    });

    scores.sort(function(a, b) {
        return a.seconds - b.seconds;
    });

    scores = scores.slice(0, 3);

    localStorage.setItem("typingScores", JSON.stringify(scores));
    displayScores();
}

// Display top three scores:
function displayScores() {
    let scores = JSON.parse(localStorage.getItem("typingScores")) || [];

    scoreList.innerHTML = "";

    scores.forEach(function(score) {
        let listItem = document.createElement("li");
        listItem.innerHTML = score.time + " - " + score.wpm + " WPM";
        scoreList.appendChild(listItem);
    });
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keypress", start);
testArea.addEventListener("keyup", spellCheck);
resetButton.addEventListener("click", reset);

displayScores();
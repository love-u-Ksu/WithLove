
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const loadingScreen = document.getElementById('loading-screen');
const finalScreen = document.getElementById('final-screen');
const loveScreen = document.getElementById('love-screen');
const startButton = document.getElementById('start-button');
const yesButton = document.getElementById('yes-button');
const noButton = document.getElementById('no-button');

const gameContainer = document.querySelector('.game-container');
const player = document.getElementById('player');
const scoreElement = document.getElementById('score');
const loadingProgress = document.getElementById('loading-progress');

const backgroundMusic = document.getElementById('background-music');
const collectSound = document.getElementById('collect-sound');
const winSound = document.getElementById('win-sound');
const noButtonSound = document.getElementById('no-button-sound');

let heartsCollected = 0;
let isDragging = false;
let gameInterval;
let noButtonClicked = false;
let yesButtonTimerInterval;
let timeLeft = 5; 


function playBackgroundMusic() {
    if (!noButtonClicked) { 
        backgroundMusic.play().catch(error => {
            console.warn("Autoplay prevented by browser. User interaction required.", error);
            
        });
    }
}


playBackgroundMusic();

startButton.addEventListener('click', () => {
    welcomeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    startGame();
});

gameContainer.addEventListener('mousedown', () => {
    isDragging = true;
});

gameContainer.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const containerRect = gameContainer.getBoundingClientRect();
        let x = e.clientX - containerRect.left - player.offsetWidth / 2; 
        const maxX = containerRect.width - player.offsetWidth;
        x = Math.max(0, Math.min(x, maxX)); 
        player.style.left = `${x}px`;
    }
});

gameContainer.addEventListener('mouseup', () => {
    isDragging = false;
});

player.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDragging = true;
});

player.addEventListener('touchmove', (e) => {
    if (isDragging) {
        const touch = e.touches[0];
        const containerRect = gameContainer.getBoundingClientRect();
        let x = touch.clientX - containerRect.left - player.offsetWidth / 2;
        const maxX = containerRect.width - player.offsetWidth;
        x = Math.max(0, Math.min(x, maxX));
        player.style.left = `${x}px`;
    }
});

player.addEventListener('touchend', () => {
    isDragging = false;
});

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    const containerRect = gameContainer.getBoundingClientRect();
    const maxX = containerRect.width - heart.offsetWidth;

    heart.style.left = `${Math.random() * maxX}px`;
    heart.style.animationDuration = `${Math.random() * 2 + 1}s`;
    gameContainer.appendChild(heart);

    let checkCollision;

    checkCollision = setInterval(() => {
        const heartRect = heart.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (
            heartRect.bottom >= playerRect.top &&
            heartRect.top <= playerRect.bottom &&
            heartRect.right >= playerRect.left &&
            heartRect.left <= playerRect.right
        ) {
            heartsCollected++;
            scoreElement.textContent = `Собрано сердечек: ${heartsCollected}`;
            heart.remove();
            clearInterval(checkCollision);
            collectSound.play();
            collectSound.currentTime = 0;

            if (heartsCollected === 10) {
                endGame();
            }
        }

        if (heartRect.bottom >= containerRect.bottom) {
            heart.remove();
            clearInterval(checkCollision);
        }
    }, 10);
}

function startGame() {
    heartsCollected = 0;
    scoreElement.textContent = `Собрано сердечек: ${heartsCollected}`;
    gameInterval = setInterval(createHeart, 1000);
    playBackgroundMusic(); 
}

function endGame() {
    clearInterval(gameInterval);
    gameScreen.classList.add('hidden');
    loadingScreen.classList.remove('hidden');
    winSound.play();

    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        loadingProgress.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            loadingScreen.classList.add('hidden');
            finalScreen.classList.remove('hidden');
        }
    }, 300);
}


function disableYesButtonTemporarily() {
    yesButton.disabled = true;
    yesButton.style.backgroundColor = '#aaa';
    yesButton.style.cursor = 'not-allowed';

    if (yesButtonTimerInterval) {
        clearInterval(yesButtonTimerInterval);
        timeLeft += 3; 
    } else {
        timeLeft = 5;
    }

    let timerDisplay = yesButton.querySelector('.yes-button-timer');
    if (!timerDisplay) {
        timerDisplay = document.createElement('span');
        timerDisplay.classList.add('yes-button-timer');
        yesButton.appendChild(timerDisplay);
    }

    const updateTimer = () => {
        timerDisplay.textContent = ` (${timeLeft}s)`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(yesButtonTimerInterval);
            yesButton.disabled = false;
            yesButton.style.backgroundColor = '#ff4081';
            yesButton.style.cursor = 'pointer';
            timerDisplay.remove();
            yesButtonTimerInterval = null; 
        }
    };

    updateTimer(); 
    yesButtonTimerInterval = setInterval(updateTimer, 1000);
}


yesButton.addEventListener('click', () => {
    winSound.pause();
    winSound.currentTime = 0;
    noButtonSound.pause();
    noButtonSound.currentTime = 0;
    finalScreen.classList.add('hidden');
    loveScreen.classList.remove('hidden');
    noButtonClicked = false; 
    playBackgroundMusic();
});

noButton.addEventListener('click', () => {
    winSound.pause();
    winSound.currentTime = 0;
    noButtonSound.play();
    backgroundMusic.pause();
    noButtonClicked = true;
    disableYesButtonTemporarily();
    
     const finalScreenHeading = document.querySelector('#final-screen h1');
     if (finalScreenHeading) {
         finalScreenHeading.textContent = "Ох ты это зря... Даю время подумать😈";
     }
});

backgroundMusic.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

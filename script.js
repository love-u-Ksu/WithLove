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

const song = document.getElementById('song'); // Аудио для кнопки "Нет"

let heartsCollected = 0;
let isDragging = false;

// Начало игры
startButton.addEventListener('click', () => {
    welcomeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    startGame();
});

// Управление платформой на компьютере
gameContainer.addEventListener('mousedown', () => {
    isDragging = true;
});

gameContainer.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const x = e.clientX - player.offsetWidth / 2;
        const containerRect = gameContainer.getBoundingClientRect();
        const maxX = containerRect.width - player.offsetWidth;

        if (x >= 0 && x <= maxX) {
            player.style.left = `${x}px`;
        }
    }
});

gameContainer.addEventListener('mouseup', () => {
    isDragging = false;
});

// Управление платформой на телефоне
player.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Предотвращаем скролл
    isDragging = true;
});

player.addEventListener('touchmove', (e) => {
    if (isDragging) {
        const touch = e.touches[0];
        const x = touch.clientX - player.offsetWidth / 2;
        const containerRect = gameContainer.getBoundingClientRect();
        const maxX = containerRect.width - player.offsetWidth;

        if (x >= 0 && x <= maxX) {
            player.style.left = `${x}px`;
        }
    }
});

player.addEventListener('touchend', () => {
    isDragging = false;
});

// Создание сердечек
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    const containerRect = gameContainer.getBoundingClientRect();
    const maxX = containerRect.width - 30; // 30 - ширина сердечка

    heart.style.left = `${Math.random() * maxX}px`;
    heart.style.animationDuration = `${Math.random() * 2 + 1}s`;
    gameContainer.appendChild(heart);

    // Проверка столкновения
    const checkCollision = setInterval(() => {
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

            if (heartsCollected === 5) { // Цель - 5 сердечек
                endGame();
            }
        }

        // Удаление сердечка, если оно вышло за пределы контейнера
        if (heartRect.bottom >= containerRect.bottom) {
            heart.remove();
            clearInterval(checkCollision);
        }
    }, 10);
}

// Запуск игры
function startGame() {
    setInterval(createHeart, 1000);
}

// Завершение игры
function endGame() {
    gameScreen.classList.add('hidden');
    loadingScreen.classList.remove('hidden');

    // Анимация загрузки
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

// Обработка ответа "Да"
yesButton.addEventListener('click', () => {
    song.pause(); // Остановка музыки
    finalScreen.classList.add('hidden');
    loveScreen.classList.remove('hidden');
});

// Обработка ответа "Нет"
noButton.addEventListener('click', () => {
    song.play(); // Воспроизведение музыки
});
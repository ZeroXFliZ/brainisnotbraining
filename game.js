let gameState = {
    mode: 0,
    numbers: [],
    clickedNumbers: new Set(),
    nextNumber: 1,
    timerStarted: false,
    startTime: 0,
    timerInterval: null
};

function startGame(mode) {
    gameState.mode = mode;
    gameState.numbers = generateRandomNumbers(mode * mode);
    gameState.clickedNumbers = new Set();
    gameState.nextNumber = 1;
    gameState.timerStarted = false;
    gameState.startTime = 0;
    
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    document.getElementById('modeSelection').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    document.getElementById('completionScreen').classList.add('hidden');
    
    document.getElementById('currentMode').textContent = `${mode}x${mode}`;
    document.getElementById('nextNumber').textContent = '1';
    document.getElementById('timer').textContent = '0.00s';
    
    renderBoard();
}

function generateRandomNumbers(count) {
    const numbers = Array.from({length: count}, (_, i) => i + 1);
    
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    return numbers;
}

function renderBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    board.className = `game-board size-${gameState.mode}`;
    
    gameState.numbers.forEach((number, index) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = number;
        cell.dataset.number = number;
        cell.addEventListener('click', () => handleCellClick(number, cell));
        board.appendChild(cell);
    });
}

function handleCellClick(number, cell) {
    if (gameState.clickedNumbers.has(number)) {
        return;
    }
    
    if (!gameState.timerStarted) {
        startTimer();
        gameState.timerStarted = true;
    }
    
    if (number === gameState.nextNumber) {
        gameState.clickedNumbers.add(number);
        cell.classList.add('clicked');
        gameState.nextNumber++;
        document.getElementById('nextNumber').textContent = gameState.nextNumber;
        
        const totalNumbers = gameState.mode * gameState.mode;
        if (gameState.nextNumber > totalNumbers) {
            endGame();
        }
    } else {
        cell.classList.add('wrong');
        setTimeout(() => {
            cell.classList.remove('wrong');
        }, 500);
    }
}

function startTimer() {
    gameState.startTime = Date.now();
    gameState.timerInterval = setInterval(updateTimer, 10);
}

function updateTimer() {
    const elapsed = (Date.now() - gameState.startTime) / 1000;
    document.getElementById('timer').textContent = elapsed.toFixed(2) + 's';
}

function endGame() {
    clearInterval(gameState.timerInterval);
    const finalTime = ((Date.now() - gameState.startTime) / 1000).toFixed(2);
    
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('completionScreen').classList.remove('hidden');
    
    document.getElementById('finalTime').textContent = finalTime + 's';
    document.getElementById('completedMode').textContent = `${gameState.mode}x${gameState.mode}`;
}

function restartGame() {
    startGame(gameState.mode);
}

function backToMenu() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    document.getElementById('modeSelection').classList.remove('hidden');
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('completionScreen').classList.add('hidden');
}

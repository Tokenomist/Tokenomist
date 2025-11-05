const width = 10;
const height = 20;
const previewWidth = 4;
const previewHeight = 4;
const dropSpeeds = [1000, 900, 800, 700, 600, 500, 420, 360, 300, 260, 220, 200, 180, 160, 140];

const grid = document.getElementById('grid');
const miniGrid = document.getElementById('mini-grid');
const scoreDisplay = document.getElementById('score');
const linesDisplay = document.getElementById('lines');
const levelDisplay = document.getElementById('level');
const startButton = document.getElementById('start');
const restartButton = document.getElementById('restart');
const messageBox = document.getElementById('message');
const touchControls = document.querySelectorAll('.touch-controls button');

const squares = [];
const previewSquares = [];

for (let i = 0; i < width * height; i++) {
  const square = document.createElement('div');
  grid.appendChild(square);
  squares.push(square);
}

for (let i = 0; i < previewWidth * previewHeight; i++) {
  const square = document.createElement('div');
  miniGrid.appendChild(square);
  previewSquares.push(square);
}

const tetrominoes = [
  {
    name: 'I',
    color: '#38bdf8',
    rotations: [
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
        [2, 3],
      ],
    ],
    preview: [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
    ],
  },
  {
    name: 'J',
    color: '#3b82f6',
    rotations: [
      [
        [0, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [2, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
        [2, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [0, 2],
        [1, 2],
      ],
    ],
    preview: [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
  },
  {
    name: 'L',
    color: '#f97316',
    rotations: [
      [
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
        [0, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [1, 2],
      ],
    ],
    preview: [
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
  },
  {
    name: 'O',
    color: '#facc15',
    rotations: [
      [
        [1, 0],
        [2, 0],
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [2, 0],
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [2, 0],
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [2, 0],
        [1, 1],
        [2, 1],
      ],
    ],
    preview: [
      [1, 0],
      [2, 0],
      [1, 1],
      [2, 1],
    ],
  },
  {
    name: 'S',
    color: '#4ade80',
    rotations: [
      [
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
      ],
      [
        [1, 0],
        [1, 1],
        [2, 1],
        [2, 2],
      ],
      [
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
      ],
      [
        [1, 0],
        [1, 1],
        [2, 1],
        [2, 2],
      ],
    ],
    preview: [
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
    ],
  },
  {
    name: 'T',
    color: '#a855f7',
    rotations: [
      [
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [1, 1],
        [2, 1],
        [1, 2],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
        [1, 2],
      ],
      [
        [1, 0],
        [0, 1],
        [1, 1],
        [1, 2],
      ],
    ],
    preview: [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
  },
  {
    name: 'Z',
    color: '#ef4444',
    rotations: [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [0, 1],
        [1, 1],
        [0, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [0, 1],
        [1, 1],
        [0, 2],
      ],
    ],
    preview: [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
  },
];

let timerId = null;
let score = 0;
let lines = 0;
let level = 1;
let isRunning = false;
let isGameOver = false;

let currentPiece = null;
let nextPiece = null;
let currentRotation = 0;
let currentPosition = { x: 3, y: 0 };

function getCells(position = currentPosition, rotationIndex = currentRotation, piece = currentPiece) {
  return piece.rotations[rotationIndex].map(([x, y]) => ({
    x: position.x + x,
    y: position.y + y,
  }));
}

function cellsToIndexes(cells) {
  return cells.map(({ x, y }) => y * width + x);
}

function isValidPosition(position, rotationIndex = currentRotation, piece = currentPiece) {
  return getCells(position, rotationIndex, piece).every(({ x, y }) => {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return false;
    }
    const index = y * width + x;
    return !squares[index].classList.contains('taken');
  });
}

function drawPiece() {
  const indexes = cellsToIndexes(getCells());
  indexes.forEach((index) => {
    const square = squares[index];
    square.classList.add('tetromino');
    square.style.setProperty('--block-color', currentPiece.color);
  });
}

function clearPiece() {
  const indexes = cellsToIndexes(getCells());
  indexes.forEach((index) => {
    const square = squares[index];
    square.classList.remove('tetromino');
    square.style.removeProperty('--block-color');
  });
}

function freezePiece() {
  const indexes = cellsToIndexes(getCells());
  indexes.forEach((index) => {
    const square = squares[index];
    square.classList.remove('tetromino');
    square.classList.add('taken');
    square.style.setProperty('--block-color', currentPiece.color);
  });
  checkForCompletedLines();
  spawnPiece();
}

function checkForCompletedLines() {
  let linesCleared = 0;

  for (let row = 0; row < height; row++) {
    const start = row * width;
    const rowCells = squares.slice(start, start + width);
    if (rowCells.every((cell) => cell.classList.contains('taken'))) {
      linesCleared += 1;
      rowCells.forEach((cell) => {
        cell.classList.remove('taken', 'tetromino');
        cell.style.removeProperty('--block-color');
      });
      const removed = squares.splice(start, width);
      squares.unshift(...removed);
      squares.forEach((cell) => grid.appendChild(cell));
    }
  }

  if (linesCleared > 0) {
    const lineScores = [0, 100, 300, 500, 800];
    score += lineScores[linesCleared] * level;
    lines += linesCleared;
    const newLevel = Math.floor(lines / 10) + 1;
    if (newLevel !== level) {
      level = newLevel;
      updateSpeed();
    }
    updateScoreboard();
  }
}

function updateScoreboard() {
  scoreDisplay.textContent = score.toLocaleString('ru-RU');
  linesDisplay.textContent = lines;
  levelDisplay.textContent = level;
}

function updateSpeed() {
  if (timerId) {
    clearInterval(timerId);
  }
  const speedIndex = Math.min(level - 1, dropSpeeds.length - 1);
  const interval = dropSpeeds[speedIndex];
  timerId = setInterval(moveDown, interval);
}

function spawnPiece() {
  currentPiece = nextPiece || getRandomPiece();
  nextPiece = getRandomPiece();
  currentRotation = 0;
  currentPosition = { x: 3, y: 0 };

  updatePreview();
  if (!isValidPosition(currentPosition)) {
    endGame();
    return;
  }
  drawPiece();
}

function getRandomPiece() {
  const index = Math.floor(Math.random() * tetrominoes.length);
  return tetrominoes[index];
}

function moveDown() {
  if (!isRunning || isGameOver) {
    return;
  }
  const newPosition = { x: currentPosition.x, y: currentPosition.y + 1 };
  if (isValidPosition(newPosition)) {
    clearPiece();
    currentPosition = newPosition;
    drawPiece();
  } else {
    freezePiece();
  }
}

function moveHorizontal(direction) {
  if (!isRunning || isGameOver) {
    return;
  }
  const newPosition = { x: currentPosition.x + direction, y: currentPosition.y };
  if (isValidPosition(newPosition)) {
    clearPiece();
    currentPosition = newPosition;
    drawPiece();
  }
}

function rotatePiece() {
  if (!isRunning || isGameOver) {
    return;
  }
  const nextRotation = (currentRotation + 1) % currentPiece.rotations.length;
  const kicks = [0, -1, 1, -2, 2];
  for (const kick of kicks) {
    const testPosition = { x: currentPosition.x + kick, y: currentPosition.y };
    if (isValidPosition(testPosition, nextRotation)) {
      clearPiece();
      currentRotation = nextRotation;
      currentPosition = testPosition;
      drawPiece();
      return;
    }
  }
}

function softDrop() {
  if (!isRunning || isGameOver) {
    return;
  }
  moveDown();
}

function hardDrop() {
  if (!isRunning || isGameOver) {
    return;
  }
  while (isValidPosition({ x: currentPosition.x, y: currentPosition.y + 1 })) {
    clearPiece();
    currentPosition.y += 1;
    drawPiece();
  }
  freezePiece();
}

function updatePreview() {
  previewSquares.forEach((cell) => {
    cell.classList.remove('tetromino');
    cell.style.removeProperty('--block-color');
  });
  if (!nextPiece) {
    return;
  }
  const previewIndexes = nextPiece.preview.map(([x, y]) => y * previewWidth + x);
  previewIndexes.forEach((index) => {
    const cell = previewSquares[index];
    if (cell) {
      cell.classList.add('tetromino');
      cell.style.setProperty('--block-color', nextPiece.color);
    }
  });
}

function handleKeyDown(event) {
  if (event.repeat) {
    return;
  }
  switch (event.code) {
    case 'ArrowLeft':
      event.preventDefault();
      moveHorizontal(-1);
      break;
    case 'ArrowRight':
      event.preventDefault();
      moveHorizontal(1);
      break;
    case 'ArrowDown':
      event.preventDefault();
      softDrop();
      break;
    case 'ArrowUp':
    case 'KeyW':
      event.preventDefault();
      rotatePiece();
      break;
    case 'Space':
      event.preventDefault();
      hardDrop();
      break;
    case 'KeyP':
      event.preventDefault();
      togglePause();
      break;
  }
}

document.addEventListener('keydown', handleKeyDown);

touchControls.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    switch (action) {
      case 'left':
        moveHorizontal(-1);
        break;
      case 'right':
        moveHorizontal(1);
        break;
      case 'down':
        softDrop();
        break;
      case 'rotate':
        rotatePiece();
        break;
      case 'drop':
        hardDrop();
        break;
    }
  });
});

function togglePause() {
  if (isGameOver) {
    return;
  }
  if (!isRunning) {
    startGame();
  } else {
    pauseGame();
  }
}

function startGame() {
  if (isGameOver) {
    return;
  }
  if (!currentPiece) {
    spawnPiece();
  }
  isRunning = true;
  messageBox.textContent = '';
  messageBox.classList.remove('visible');
  updateSpeed();
}

function pauseGame() {
  isRunning = false;
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  messageBox.textContent = 'Пауза';
  messageBox.classList.add('visible');
}

function endGame() {
  isRunning = false;
  isGameOver = true;
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  messageBox.textContent = 'Игра окончена';
  messageBox.classList.add('visible');
}

function resetBoard(showStartMessage = false) {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  squares.forEach((cell) => {
    cell.classList.remove('tetromino', 'taken');
    cell.style.removeProperty('--block-color');
  });
  previewSquares.forEach((cell) => {
    cell.classList.remove('tetromino');
    cell.style.removeProperty('--block-color');
  });
  score = 0;
  lines = 0;
  level = 1;
  updateScoreboard();
  isGameOver = false;
  isRunning = false;
  currentPiece = null;
  nextPiece = getRandomPiece();
  currentRotation = 0;
  currentPosition = { x: 3, y: 0 };
  if (nextPiece) {
    updatePreview();
  }
  if (showStartMessage) {
    messageBox.textContent = 'Нажмите «Старт», чтобы играть';
    messageBox.classList.add('visible');
  } else {
    messageBox.textContent = '';
    messageBox.classList.remove('visible');
  }
}

function restartGame() {
  resetBoard();
  startGame();
}

startButton.addEventListener('click', togglePause);
restartButton.addEventListener('click', restartGame);
window.addEventListener('blur', () => {
  if (isRunning) {
    pauseGame();
  }
});

resetBoard(true);

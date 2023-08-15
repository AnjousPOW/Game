const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const gridSize = 4;
const tileMargin = 10;
const tileSize = (canvas.width - (gridSize + 1) * tileMargin) / gridSize;

const colors = {
  0: '#CDC1B4',
  2: '#EEE4DA',
};

let grid = [];
let score = 0;

// Инициализация игры
function init() {
  grid = [];
  score = 0;

  // Заполнение сетки пустыми значениями
  for (let row = 0; row < gridSize; row++) {
    grid[row] = [];
    for (let col = 0; col < gridSize; col++) {
      grid[row][col] = 0;
    }
  }

  // Добавление двух случайных плиток
  addRandomTile();
  addRandomTile();
}

// Добавление случайной плитки (2 или 4) в свободную ячейку
function addRandomTile() {
  const availableCells = getAvailableCells();
  if (availableCells.length > 0) {
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    const newValue = Math.random() < 0.9 ? 2 : 4;
    const { row, col } = randomCell;
    grid[row][col] = newValue;
  }
}

// Получение свободных ячеек
function getAvailableCells() {
  const availableCells = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col] === 0) {
        availableCells.push({ row, col });
      }
    }
  }
  return availableCells;
}

// Отрисовка сетки и плиток
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Отрисовка плиток
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      drawTile(row, col);
    }
  }
}

// Отрисовка плитки
function drawTile(row, col) {
  const value = grid[row][col];

  // Вычисление координат плитки
  const x = col * (tileSize + tileMargin) + tileMargin;
  const y = row * (tileSize + tileMargin) + tileMargin;

  // Отрисовка плитки
  ctx.fillStyle = colors[value] || colors[0];
  ctx.fillRect(x, y, tileSize, tileSize);

  // Отрисовка значения плитки
  if (value > 0) {
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#776E65';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(value.toString(), x + tileSize / 2, y + tileSize / 2);
  }
}

// Обработка нажатий клавиш
document.addEventListener('keydown', function(event) {
  const key = event.key;

  if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
    event.preventDefault();

    const moved = moveTiles(key);

    if (moved) {
      addRandomTile();
      draw();

      if (!canMove()) {
        alert('Game Over!');
        init();
        draw();
      }
    }
  }
});

// Передвижение плиток
function moveTiles(direction) {
  let moved = false;

  // Поворот сетки для обработки передвижений во всех направлениях
  if (direction === 'ArrowLeft' || direction === 'ArrowRight') {
    rotateGrid();
  }

  if (direction === 'ArrowUp' || direction === 'ArrowLeft') {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        moved = slideTile(row, col, -1, 0) || moved;
      }
    }
  } else if (direction === 'ArrowDown' || direction === 'ArrowRight') {
    for (let row = gridSize - 1; row >= 0; row--) {
      for (let col = gridSize - 1; col >= 0; col--) {
        moved = slideTile(row, col, 1, 0) || moved;
      }
    }
  }

  // Поворот сетки обратно после передвижений
  if (direction === 'ArrowLeft' || direction === 'ArrowRight') {
    rotateGrid();
  }

  return moved;
}

// Поворот сетки
function rotateGrid() {
  const newGrid = [];

  for (let col = 0; col < gridSize; col++) {
    newGrid[col] = [];
    for (let row = 0; row < gridSize; row++) {
      newGrid[col][row] = grid[row][col];
    }
  }

  grid = newGrid;
}

// Сдвиг плитки в определенном направлении
function slideTile(startRow, startCol, dirRow, dirCol) {
  let moved = false;
  let row = startRow;
  let col = startCol;

  while (isValidCell(row + dirRow, col + dirCol)) {
    const current = grid[row][col];
    const next = grid[row + dirRow][col + dirCol];

    if (next === 0) {
      grid[row][col] = 0;
      grid[row + dirRow][col + dirCol] = current;
      row += dirRow;
      col += dirCol;
      moved = true;
    } else if (current === next) {
      grid[row][col] = 0;
      grid[row + dirRow][col + dirCol] = current * 2;
      score += current * 2;
      moved = true;
      break;
    } else {
      break;
    }
  }

  return moved;
}

// Проверка валидности ячейки
function isValidCell(row, col) {
  return row >= 0 && row < gridSize && col >= 0 && col < gridSize;
}

// Проверка возможности совершения хода
function canMove() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const current = grid[row][col];

      if (current === 0) {
        return true;
      }

      const neighbors = [
        { row: row - 1, col },
        { row: row + 1, col },
        { row, col: col - 1 },
        { row, col: col + 1 }
      ];

      for (const neighbor of neighbors) {
        if (isValidCell(neighbor.row, neighbor.col) && grid[neighbor.row][neighbor.col] === current) {
          return true;
        }
      }
    }
  }

  return false;
}

init();
draw();
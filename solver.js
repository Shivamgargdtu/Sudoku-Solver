const boardDiv = document.getElementById('board');
// everything in the box
for (let i = 0; i < 81; i++) {
  const cell = document.createElement('input');
  cell.type = 'text';
  cell.maxLength = 1;
  cell.style.color = '#fff';
  cell.style.backgroundColor = '#222';
  cell.style.textAlign = 'center';
  boardDiv.appendChild(cell);
  cell.addEventListener('input', () => {
    const val = cell.value;
    if (!val.match(/^[1-9.]?$/)) {
      cells.forEach(c => (c.value = ''));
    }
  });
}
const cells = document.querySelectorAll('#board input');

function getBoard() {
  let board = [];
  for (let i = 0; i < 9; i++) {
    let row = [];
    for (let j = 0; j < 9; j++) {
      let val = cells[i * 9 + j].value;
      row.push(val === '' ? '.' : val);
    }
    board.push(row);
  }
  return board;
}

function setBoard(board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      cells[i * 9 + j].value = board[i][j] === '.' ? '' : board[i][j];
    }
  }
}

function check(board, i, j, val) {
  const row = i - (i % 3);
  const col = j - (j % 3);
  for (let x = 0; x < 9; x++)
    if (board[x][j] === val) return false;
  for (let y = 0; y < 9; y++)
    if (board[i][y] === val) return false;
  for (let x = 0; x < 3; x++)
    for (let y = 0; y < 3; y++)
      if (board[row + x][col + y] === val) return false;
  return true;
}

function solve(board, empty, index, n) {
  if (index.value >= n) return true;
  let i = empty[index.value].first;
  let j = empty[index.value].second;
  for (let val = 1; val <= 9; val++) {
    let ch = val.toString();
    if (check(board, i, j, ch)) {
      board[i][j] = ch;
      index.value++;
      if (solve(board, empty, index, n)) return true;
      index.value--;
      board[i][j] = '.';
    }
  }
  return false;
}

function solveSudoku(board) {
  let empty = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === '.') empty.push({ first: i, second: j });
    }
  }
  let n = empty.length;
  let index = { value: 0 };
  return solve(board, empty, index, n);
}

function isValidBoard(board) {
  for (let i = 0; i < 9; i++) {
    let row = new Set(), col = new Set(), box = new Set();
    for (let j = 0; j < 9; j++) {
      if (board[i][j] !== '.') {
        if (row.has(board[i][j])) return false;
        row.add(board[i][j]);
      }
      if (board[j][i] !== '.') {
        if (col.has(board[j][i])) return false;
        col.add(board[j][i]);
      }
      const r = 3 * Math.floor(i / 3) + Math.floor(j / 3);
      const c = 3 * (i % 3) + (j % 3);
      if (board[r][c] !== '.') {
        if (box.has(board[r][c])) return false;
        box.add(board[r][c]);
      }
    }
  }
  return true;
}

document.getElementById('solveBtn').addEventListener('click', () => {
  let board = getBoard();
  if (!isValidBoard(board)) {
    cells.forEach(c => (c.value = ''));
    return;
  }
  if (!solveSudoku(board)) {
    cells.forEach(c => (c.value = ''));
    return;
  }
  setBoard(board);
});

document.getElementById('clear').addEventListener('click', () => {
  cells.forEach(c => (c.value = ''));
});

// Content Negotiation exercise

const fetchDiv = document.querySelector("#fetchResult");

fetchDiv.textContent = "Fetching result...";

const acceptHeaders = [
  "text/plain",
  "text/html",
  "application/json",
  "application/rainbows+unicorns",
];

acceptHeaders.map((header) => {
  fetch("https://eloquentjavascript.net/author", {
    headers: { accept: header },
  })
    .then((resp) => {
      return `<div>Header: ${header} Code: ${resp.status} Text: ${resp.statusText}</div>`;
    })
    .then((text) => (fetchDiv.innerHTML += text));
});

// A JavaScript WorkBench Exercise

const codeTextArea = document.querySelector("#code");
const buttonRunCode = document.querySelector("#button");
let codeOutput = document.querySelector("#output");

buttonRunCode.addEventListener("click", () => {
  let code = "";
  try {
    code = Function(codeTextArea.value)();
  } catch (err) {
    code = err;
  }
  codeOutput.appendChild(document.createTextNode(`${code}\n`));
});

// Conway's Game of Life exercise

const conwayGrid = document.querySelector("#grid");
const nextButton = document.querySelector("#next");
const autoRunButton = document.querySelector("#autoRun");

class Matrix {
  constructor(width, height, element = (x, y) => undefined) {
    this.width = width;
    this.height = height;
    this.content = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.content[y * width + x] = element(x, y);
      }
    }
  }

  get(x, y) {
    return this.content[y * this.width + x];
  }
  set(x, y, value) {
    this.content[y * this.width + x] = value;
  }
}
const MATRIX_WIDTH = 15;
const MATRIX_HEIGHT = 15;

const initialGrid = new Matrix(MATRIX_WIDTH, MATRIX_HEIGHT);
for (let i = 0; i < MATRIX_HEIGHT; i++) {
  for (let j = 0; j < MATRIX_WIDTH; j++) {
    let checkbox = Math.random() < 0.25 ? true : false;
    initialGrid.set(j, i, checkbox);
  }
}

function createCheckboxFromGrid(grid) {
  for (let i = 0; i < MATRIX_HEIGHT; i++) {
    for (let j = 0; j < MATRIX_WIDTH; j++) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = grid.get(j, i);
      conwayGrid.appendChild(checkbox);
    }
    conwayGrid.appendChild(document.createElement("br"));
  }
}

function createGridFromCheckboxes(nodeElement) {
  let checkboxState = Array.from(nodeElement.querySelectorAll("input")).map(
    (item) => item.checked
  );
  const grid = new Matrix(MATRIX_WIDTH, MATRIX_HEIGHT);
  for (let i = 0; i < MATRIX_HEIGHT; i++) {
    for (let j = 0; j < MATRIX_WIDTH; j++) {
      let checkbox = checkboxState[j + i * MATRIX_WIDTH];
      grid.set(j, i, checkbox);
    }
  }
  return grid;
}

createCheckboxFromGrid(initialGrid);

function generateNextGrid(previousGrid) {
  const nextGrid = new Matrix(MATRIX_WIDTH, MATRIX_HEIGHT);
  for (let y = 0; y < MATRIX_HEIGHT; y++) {
    for (let x = 0; x < MATRIX_WIDTH; x++) {
      let neighborCells = countNeighborCells(previousGrid, x, y);
      if (!previousGrid.get(x, y) && neighborCells === 3) nextGrid.set(x, y, true);
      if (previousGrid.get(x, y) && (neighborCells === 2 || neighborCells === 3))
        nextGrid.set(x, y, true);
      if (previousGrid.get(x, y) && (neighborCells < 2 || neighborCells > 3))
        nextGrid.set(x, y, false);
    }
  }
  while (conwayGrid.firstChild) {
    conwayGrid.removeChild(conwayGrid.firstChild);
  }
  createCheckboxFromGrid(nextGrid);
}

function countNeighborCells(grid, x, y) {
  let neighborCells = 0;
  for (
    let y1 = Math.max(0, y - 1);
    y1 <= Math.min(MATRIX_HEIGHT - 1, y + 1);
    y1++
  ) {
    for (
      let x1 = Math.max(0, x - 1);
      x1 <= Math.min(MATRIX_WIDTH - 1, x + 1);
      x1++
    ) {
      if ((x1 != x || y1 != y) && grid.get(x1, y1)) {
        neighborCells++;
      }
    }
  }
  return neighborCells;
}

function run() {
  generateNextGrid(createGridFromCheckboxes(conwayGrid));
}
nextButton.addEventListener("click", () => run());

let running = null;
autoRunButton.addEventListener("click", () => {
  if (running) {
    clearInterval(running);
    running = null;
  } else {
    running = setInterval(run, 500);
  }
});

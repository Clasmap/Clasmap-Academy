
const canvas = document.getElementById('wordSearchCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 10;
const cellSize = 40;
canvas.width = gridSize * cellSize;
canvas.height = gridSize * cellSize;

const words = ['APPLE', 'ORANGE', 'BANANA', 'GRAPE', 'LEMON', 'CHERRY', 'PEACH', 'MANGO', 'KIWI', 'PLUM'];
const grid = [];
let selectedCells = [];

// Initialize the grid with empty cells
for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
        grid[i][j] = '';
    }
}

// Function to draw the grid
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            ctx.fillStyle = "#e0f7fa";
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            ctx.strokeStyle = "#00838f";
            ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);

            const letter = grid[i][j];
            if (letter) {
                ctx.fillStyle = "#000";
                ctx.fillText(letter, j * cellSize + cellSize / 2, i * cellSize + cellSize / 2);
            }
        }
    }
}

// Function to place words in the grid
function placeWords() {
    words.forEach(word => {
        let placed = false;
        while (!placed) {
            const direction = Math.floor(Math.random() * 2); // 0: horizontal, 1: vertical
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);

            if (direction === 0 && col + word.length <= gridSize) {
                let canPlace = true;
                for (let i = 0; i < word.length; i++) {
                    if (grid[row][col + i]) {
                        canPlace = false;
                        break;
                    }
                }
                if (canPlace) {
                    for (let i = 0; i < word.length; i++) {
                        grid[row][col + i] = word[i];
                    }
                    placed = true;
                }
            } else if (direction === 1 && row + word.length <= gridSize) {
                let canPlace = true;
                for (let i = 0; i < word.length; i++) {
                    if (grid[row + i][col]) {
                        canPlace = false;
                        break;
                    }
                }
                if (canPlace) {
                    for (let i = 0; i < word.length; i++) {
                        grid[row + i][col] = word[i];
                    }
                    placed = true;
                }
            }
        }
    });
}

// Function to fill the grid with random letters
function fillEmptySpaces() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (!grid[i][j]) {
                grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Random uppercase letter
            }
        }
    }
}

// Function to handle cell clicks
function handleClick(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);
    
    if (selectedCells.find(cell => cell.row === row && cell.col === col)) {
        return; // No permitir seleccionar la misma celda dos veces
    }

    selectedCells.push({ row, col });
    drawGrid();
    selectedCells.forEach(cell => {
        ctx.fillStyle = "orange";
        ctx.fillRect(cell.col * cellSize, cell.row * cellSize, cellSize, cellSize);
        ctx.strokeStyle = "#00838f";
        ctx.strokeRect(cell.col * cellSize, cell.row * cellSize, cellSize, cellSize);
        ctx.fillStyle = "#000";
        ctx.fillText(grid[cell.row][cell.col], cell.col * cellSize + cellSize / 2, cell.row * cellSize + cellSize / 2);
    });

    checkWord();
}

// Function to check if the selected cells form a valid word
function checkWord() {
    const selectedWord = selectedCells.map(cell => grid[cell.row][cell.col]).join('');
    const reversedSelectedWord = selectedWord.split('').reverse().join('');

    if (words.includes(selectedWord) || words.includes(reversedSelectedWord)) {
        selectedCells.forEach(cell => {
            ctx.fillStyle = "orange";
            ctx.fillRect(cell.col * cellSize, cell.row * cellSize, cellSize, cellSize);
            ctx.strokeStyle = "#00838f";
            ctx.strokeRect(cell.col * cellSize, cell.row * cellSize, cellSize, cellSize);
            ctx.fillStyle = "#000";
            ctx.fillText(grid[cell.row][cell.col], cell.col * cellSize + cellSize / 2, cell.row * cellSize + cellSize / 2);
        });

        markWordAsFound(selectedWord);
        selectedCells = [];
    } else if (selectedWord.length === gridSize) {
        selectedCells = []; // Reiniciar si se selecciona más de una palabra
    }
}

// Function to mark the word as found in the word list
function markWordAsFound(word) {
    const wordListItems = document.querySelectorAll('#wordList div');
    wordListItems.forEach(item => {
        if (item.textContent === word || item.textContent === word.split('').reverse().join('')) {
            item.classList.add('found');
        }
    });
}

// Display the list of words
function displayWordList() {
    const wordList = document.getElementById('wordList');
    wordList.innerHTML = '<h2>Find these words:</h2>';
    words.forEach(word => {
        const wordItem = document.createElement('div');
        wordItem.textContent = word;
        wordList.appendChild(wordItem);
    });
}

// Initialize the game
function init() {
    placeWords();
    fillEmptySpaces();
    drawGrid();
    displayWordList();
    canvas.addEventListener('click', handleClick);
}

init();

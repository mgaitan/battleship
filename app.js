const BOARD_SIZE = 10;
const CELL_SIZE = 50;
const MARGIN = 30;
const TEXT_SIZE = 15;
const SHIP_COLOR = "lightgray";

const SHIPS = {
    'carrier': 5,
    'battleship': 4,
    'cruiser1': 3,
    'cruiser2': 3,
    'destroyer1': 2,
    'destroyer2': 2
};

function createEmptyBoard() {
    let board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        board.push(new Array(BOARD_SIZE).fill('-'));
    }
    return board;
}

function isValidPlacement(board, shipSize, row, col, orientation) {
    if (orientation === "horizontal") {
        if (col + shipSize > BOARD_SIZE) return false;
        for (let i = 0; i < shipSize; i++) {
            if (board[row][col + i] !== '-') return false;
        }
    } else {
        if (row + shipSize > BOARD_SIZE) return false;
        for (let i = 0; i < shipSize; i++) {
            if (board[row + i][col] !== '-') return false;
        }
    }
    return true;
}

function placeShip(board, shipSize, row, col, orientation) {
    for (let i = 0; i < shipSize; i++) {
        if (orientation === "horizontal") {
            board[row][col + i] = "#";
        } else {
            board[row + i][col] = "#";
        }
    }
}

function randomPlaceShips(board) {
    for (const ship in SHIPS) {
        let placed = false;
        while (!placed) {
            let row = Math.floor(Math.random() * BOARD_SIZE);
            let col = Math.floor(Math.random() * BOARD_SIZE);
            let orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            if (isValidPlacement(board, SHIPS[ship], row, col, orientation)) {
                placeShip(board, SHIPS[ship], row, col, orientation);
                placed = true;
            }
        }
    }
}

function boardToSVG(board, offsetX = 0) {
    const svg = document.getElementById('battleBoard');
    for (let i = 0; i < BOARD_SIZE; i++) {
        const textNum = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textNum.setAttribute("x", (offsetX + (i + 0.5) * CELL_SIZE).toString());
        textNum.setAttribute("y", (MARGIN - 5).toString());
        textNum.setAttribute("font-size", TEXT_SIZE.toString());
        textNum.setAttribute("text-anchor", "middle");
        textNum.textContent = (i + 1).toString();
        svg.appendChild(textNum);

        const textLetter = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textLetter.setAttribute("x", (offsetX - 5).toString());
        textLetter.setAttribute("y", (MARGIN + (i + 0.5) * CELL_SIZE + 5).toString());
        textLetter.setAttribute("font-size", TEXT_SIZE.toString());
        textLetter.setAttribute("text-anchor", "end");
        textLetter.textContent = String.fromCharCode(65 + i);
        svg.appendChild(textLetter);
    }

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            cell.setAttribute("x", (offsetX + col * CELL_SIZE).toString());
            cell.setAttribute("y", (MARGIN + row * CELL_SIZE).toString());
            cell.setAttribute("width", CELL_SIZE.toString());
            cell.setAttribute("height", CELL_SIZE.toString());
            cell.setAttribute("fill", "white");
            cell.setAttribute("stroke", "black");
            svg.appendChild(cell);
            
            if (board[row][col] === "#") {
                const shipRect = cell.cloneNode();
                shipRect.setAttribute("fill", SHIP_COLOR);
                svg.appendChild(shipRect);
            }
        }
    }
}

const boardWithShips = createEmptyBoard();
randomPlaceShips(boardWithShips);
const boardEmpty = createEmptyBoard();

document.getElementById('battleBoard').setAttribute("width", (2 * BOARD_SIZE * CELL_SIZE + 3 * MARGIN).toString());
document.getElementById('battleBoard').setAttribute("height", (BOARD_SIZE * CELL_SIZE + 2 * MARGIN).toString());

boardToSVG(boardWithShips, MARGIN);
boardToSVG(boardEmpty, BOARD_SIZE * CELL_SIZE + 2 * MARGIN);

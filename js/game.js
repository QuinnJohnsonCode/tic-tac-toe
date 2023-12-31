// gameBoard is a Module that contains the board and has functions corresponding to the board
let gameBoard = (function() {
    // Private
    const board = Array(9).fill("-"); // Fill array with 9 "empty" values

    return {
        // Public
        getBoardRepresentation: function() {
            let boardRepresentation = "";
            for (let i = 0; i < board.length; ++i) {
                if (i % 3 === 0) { boardRepresentation += "\n"; }
                boardRepresentation += board[i];
            }
            return boardRepresentation;
        },

        resetBoard: function() {
            board.fill("-");
        },

        getBoard: () => board,

        updateBoard: function(marker, index) {
            board[index] = marker;
        },

        isTaken: function(index) {
            return board[index] !== "-";
        },

        checkEndGame: function() {
            // Check win -> returns marker
            // Horizontal
            for (let i = 0; i < 9; i += 3) {
                if (board[i] !== "-" && board[i] === board[i + 1] && board[i] === board[i + 2]) {
                    return board[i];
                }
            }

            // Vertical
            for (let i = 0; i < 3; ++i) {
                if (board[i] !== "-" && board[i] === board[i + 3] && board[i] === board[i + 6]) {
                    return board[i];
                }
            }

            // Diagonal
            if (board[0] !== "-" && board[0] === board[4] && board[0] === board[8]) {
                return board[0];
            }
            if (board[2] !== "-" && board[2] === board[4] && board[2] === board[6]) {
                return board[2];
            }

            // Check draw -> returns "D" otherwise "-" for non-draw
            for (let i = 0; i < board.length; ++i) {
                if (board[i] === "-") {
                    return "-";
                }
            }

            return "D";
        }
    };
})();

// PlayerFactory creates players with their marker and stats
let PlayerFactory = marker => {
    // Store player wins/losses/draws
    let wins = 0;
    let losses = 0;
    let draws = 0;

    const updateStats = function(endState) {
        if (endState === "D") {
            draws++;
        }
        else if (endState === marker) {
            wins++;
        }
        else {
            losses++;
        }
    };

    const getMarker = () => marker;

    const getStats = function() {
        return { wins, losses, draws };
    };

    return { getMarker, updateStats, getStats, };
};

// displayController is a Module that will update the DOM according to changes to the gameBoard
let displayController = (function(document) {
    // Private
    const gameGrid = document.getElementById("game-grid");
    const squares = Array.from(gameGrid.children);
    const resetButton = document.getElementById("reset-button");
    const endText = document.getElementById("end-text");

    const xWin = document.getElementById("x-w");
    const xLose = document.getElementById("x-l");
    const xDraw = document.getElementById("x-d");
    const oWin = document.getElementById("o-w");
    const oLose = document.getElementById("o-l");
    const oDraw = document.getElementById("o-d");

    return {
        // Public
        updateGridFromBoard: function(board) {
            for (let i = 0; i < board.length; ++i) {
                // If the DOM has been changed, stop updating grid
                if (i > squares.length) { break; }
                // If the value is empty, do not draw it
                if (board[i] === "-") { 
                    squares[i].textContent = "";
                    continue;
                }
                
                // Update the text in the grid matching the board
                squares[i].textContent = board[i];
            }
        },
        updateEndText: function(endGameState) {
            if (endGameState === "D") {
                endText.textContent = "Draw!"
            }
            else {
                endText.textContent = endGameState + " wins!";
            }
        },
        updateStats: function(statsForX, statsForO) {
            xWin.textContent = statsForX.wins;
            xLose.textContent = statsForX.losses;
            xDraw.textContent = statsForX.draws;

            oWin.textContent = statsForO.wins;
            oLose.textContent = statsForO.losses;
            oDraw.textContent = statsForO.draws;
        },
        clearEndText: function() {
            endText.textContent = "";
        },
        getSquares: () => squares,
        getResetButton: () => resetButton,
    };
})(document);

// game is a Module controlling gameflow and state
let game = (function(gameBoard, displayController) {
    // Private

    // Handles the click event for the individual squares of the grid
    let squareClick = function(event) {
        // Call the move function with the index
        const indexOfSquare = Number(event.target.getAttribute("data-attribute"));
        playerMove(indexOfSquare);
    };

    // Handles the logic of a turn
    let playerMove = function(index) {
        // If the game has ended, cancel move
        if (gameEnded) { return; }

        // Check to see if the square is taken and cancel move if so
        if (gameBoard.isTaken(index)) { return; }
        // Update the board with the current player's marker
        gameBoard.updateBoard(players[turn].getMarker(), index);

        // Update the display with the new board state
        displayController.updateGridFromBoard(gameBoard.getBoard());

        // Check for an end game state
        const endGameState = gameBoard.checkEndGame();
        if (endGameState !== "-") {
            endGame(endGameState);
        }

        // Invert the turn (0 -> 1 or 1 -> 0)
        changeTurn();
    };

    let changeTurn = function() {
        turn = (turn === X_TURN) ? O_TURN : X_TURN;
    };

    let endGame = function(endGameState) {
        gameEnded = true;

        // Update player stats
        xPlayer.updateStats(endGameState);
        oPlayer.updateStats(endGameState);

        // Update player stats text
        displayController.updateStats(xPlayer.getStats(), oPlayer.getStats());

        // Update end text
        displayController.updateEndText(endGameState);
    }

    let reset = function() {
        gameEnded = false;
        turn = X_TURN;

        gameBoard.resetBoard();

        displayController.clearEndText();
        displayController.updateGridFromBoard(gameBoard.getBoard());
    }
    
    // Create and store players
    const xPlayer = PlayerFactory("X");
    const oPlayer = PlayerFactory("O");
    const players = [xPlayer, oPlayer]; // turn = 0: X, turn = 1: O 

    // Turns
    const X_TURN = 0;
    const O_TURN = 1;
    let turn = X_TURN;
    let gameEnded = false;

    // Initialize the grid in the displayController
    displayController.updateGridFromBoard(gameBoard.getBoard());

    // Add event listeners to the squares
    displayController.getSquares().forEach((square) => square.addEventListener("click", squareClick));

    // Add event listener for reset button
    displayController.getResetButton().addEventListener("click", reset);

    return {
        // Public
    };
})(gameBoard, displayController);


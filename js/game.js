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

        getBoard: () => board,

        updateBoard: function(marker, index) {
            board[index] = marker;
        },
    };
})();

// PlayerFactory creates players with their marker and stats
let PlayerFactory = marker => {
    // Store player wins/losses/draws
    let wins = 0;
    let losses = 0;
    let draws = 0;

    const win =  () => ++wins;
    const lose = () => ++losses;
    const draw = () => ++draws;
    const getMarker = () => marker;

    return { getMarker, win, lose, draw};
};

// displayController is a Module that will update the DOM according to changes to the gameBoard
let displayController = (function(document) {
    // Private
    const gameGrid = document.getElementById("game-grid");
    const squares = Array.from(gameGrid.children);
    return {
        // Public
        updateGridFromBoard: function(board) {
            for (let i = 0; i < board.length; ++i) {
                // If the DOM has been changed, stop updating grid
                if (i > squares.length) { break; }
                
                // Update the text in the grid matching the board
                squares[i].textContent = board[i];
            }
        },
    };
})(document);

// game is a Module controlling gameflow and state
let game = (function(gameBoard, displayController) {
    // Private
    const xPlayer = PlayerFactory("X");
    const oPlayer = PlayerFactory("O");
    const players = [xPlayer, oPlayer];

    // Initialize the grid in the displayController
    displayController.updateGridFromBoard(gameBoard.getBoard());


    return {
        // Public
    };
})(gameBoard, displayController);


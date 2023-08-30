let gameBoard = (function() {
    // Private Functions
    const board = Array(9).fill("-"); // Fill array with 9 "empty" values

    return {
        // Public Functions
        getBoardRepresentation: function() {
            let boardRepresentation = "";
            for (let i = 0; i < board.length; ++i) {
                if (i % 3 === 0) { boardRepresentation += "\n"; }
                boardRepresentation += board[i];
            }
            return boardRepresentation;
        },
    };
})();

console.log(gameBoard.getBoardRepresentation());
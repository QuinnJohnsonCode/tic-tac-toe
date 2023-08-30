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
    };
})();

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

// game is a Module controlling gameflow and state
let game = (function(gameBoard) {
    // Private
    const xPlayer = PlayerFactory("X");
    const oPlayer = PlayerFactory("O");

    console.log(xPlayer.win());

    return {
        // Public
    };
})(gameBoard);


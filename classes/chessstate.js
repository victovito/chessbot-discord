class ChessState
{

    static row = ["a", "b", "c", "d", "e", "f", "g", "h"];
    static collumn = [1, 2, 3, 4, 5, 6, 7, 8];

    constructor(){
        this.board = [];
        for (let i = 0; i < 8; i++){
            let collumn = [];
            for (let j = 0; j < 8; j++){
                collumn.push(null);
            }
            this.board.push(collumn);
        }
    }

    static getTableCoords(position){
        return [
            ChessState.collumn.indexOf(position[0]),
            ChessState.row.indexOf(position[1])
        ];
    }

    defaultPlaces(){
        board[0][0]
    }

}
module.exports = ChessState

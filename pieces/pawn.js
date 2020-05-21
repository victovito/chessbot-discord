const ChessState = require("../classes/chessstate");

class Pawn
{
    static isValidMove(origin, destiny, board){
        let origin = ChessState.getTableCoords(origin);
        let destiny = ChessState.getTableCoords(destiny);

        if (destiny[1] == origin[1]){
            if (destiny[0] == origin[0]){
                if (board[destiny[0]][destiny[1]] == null){
                    return true;
                }
            }
            if (destiny[0] == origin[0] + 1){
                if (board[destiny[0] + 1] != null){
                    return true;
                }
            }
            if (destiny[0] == origin[0] - 1){
                if (board[destiny[0] - 1] != null){
                    return true;
                }
            }
        }
        return false;
    }
}
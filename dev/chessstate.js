// const { Canvas, loadImage } = require("canvas");

class ChessState
{

    static player = {
        WHITE: 0,
        BLACK: 1
    }

    static row = ["a", "b", "c", "d", "e", "f", "g", "h"];
    static collumn = ["1", "2", "3", "4", "5", "6", "7", "8"];

    constructor(){
        this.board = [];
        for (let i = 0; i < 8; i++){
            let collumn = [];
            for (let j = 0; j < 8; j++){
                collumn.push(null);
            }
            this.board.push(collumn);
        }

        this.class = ChessState;

        this.defaultPlaces();

        this.lastMove = [];


        // this.whiteKingCoords = ChessState.getTableCoords("e1");
        // this.blackKingCoords = ChessState.getTableCoords("e8");

    }

    static getTableCoords(position){
        return [
            ChessState.row.indexOf(position[0]),
            ChessState.collumn.indexOf(position[1])
        ];
    }

    isInCheck(player){

        let kingPos;
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                const piece = this.board[i][j];
                if (piece){
                    if (piece.name == "king" && piece.color == player){
                        kingPos = [i, j];
                        break;
                    }
                }
            }
        }
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                const piece = this.board[i][j];
                if (piece){
                    if (piece.color != player){
                        if (piece.isValidMove([i, j], kingPos).valid){
                            return true;
                        }
                    }
                }
            }
        }
        return false;

    }

    getMoveInfo(origin, destiny){
        if (typeof(origin) == "string"){
            origin = ChessState.getTableCoords(origin);
        }
        if (typeof(destiny) == "string"){
            destiny = ChessState.getTableCoords(destiny);
        }

        const difference = [destiny[0] - origin[0], destiny[1] - origin[1]];
        let direction = [
            difference[0] / Math.max.apply(Math, difference.map(Math.abs)) || 0,
            difference[1] / Math.max.apply(Math, difference.map(Math.abs)) || 0
        ];
        if (
            !(
                Number.isInteger(direction[0]) && Math.abs(direction[0]) <= 1 &&
                Number.isInteger(direction[1]) && Math.abs(direction[1]) <= 1
            )
            || (direction[0] == 0 && direction[1] == 0)
        ){
            direction = null;
        }

        let steps = (direction) ? Math.max.apply(Math, difference.map(Math.abs)) : null;

        let knightMove = Math.abs(difference[0]) + Math.abs(difference[1]) == 3;

        let hasPath = true;
        if (steps){
            for (let i = 1; i <= steps; i++){
                const nextPos = [origin[0] + direction[0], origin[1] + direction[1]];
                const tPiece = this.board[nextPos[0]][nextPos[1]];
                if (tPiece){
                    if (i != steps){
                        hasPath = false;
                    }
                    break;
                }
                origin = nextPos;
            }
        }
        if (hasPath && (!direction && !knightMove)){
            hasPath = false;
        }

        const target = (hasPath || knightMove) ? this.board[destiny[0]][destiny[1]] : null

        return {
            direction: direction,
            steps: steps,
            hasPath: hasPath,
            knightMove: knightMove,
            target: target
        };
    }

    playMove(origin, destiny, turnOf){

        if (typeof(origin) == "string"){
            origin = ChessState.getTableCoords(origin);
        }
        if (typeof(destiny) == "string"){
            destiny = ChessState.getTableCoords(destiny);
        }

        let response = {
            valid: true,
            message: null,
        };
        
        const piece = this.board[origin[0]][origin[1]];

        const temp = [];
        for (let arr of this.board){
            const newArr = [];
            for (let square of arr){
                newArr.push(square);
            }
            temp.push(newArr);
        }

        if (piece == null){
            response.message = "No piece to move in origin position";
            response.valid = false;
            return response;
        }

        if (piece.color != turnOf){
            response.message = "This is not your piece";
            response.valid = false;
            return response;
        }

        const validMove = piece.isValidMove(
            origin, destiny
        );

        if (!validMove.valid){
            response.message = "This movement is illegal";
            response.valid = false;
            return response;
        }

        this.placePiece(destiny, piece);
        this.placePiece(origin, null);

        if (validMove.castling){
            validMove.castling.rook.hasMoved = true;
            this.placePiece(validMove.castling.rookDestiny, validMove.castling.rook);
            this.placePiece(validMove.castling.rookPos, null);
        }
        
        if (this.isInCheck(turnOf)){
            this.board = temp;
            response.message = "This movement is illegal";
            response.valid = false;
            return response;
        }

        this.lastMove = [origin, destiny];
        
        return response;

    }

    placePiece(coord, piece){
        if (typeof(coord) == "string"){
            coord = ChessState.getTableCoords(coord);
        }
        this.board[coord[0]][coord[1]] = piece;
    }

    defaultPlaces(){
        this.placePiece("a2", new Pawn(this, ChessState.player.WHITE));
        this.placePiece("b2", new Pawn(this, ChessState.player.WHITE));
        this.placePiece("c2", new Pawn(this, ChessState.player.WHITE));
        this.placePiece("d2", new Pawn(this, ChessState.player.WHITE));
        this.placePiece("e2", new Pawn(this, ChessState.player.WHITE));
        this.placePiece("f2", new Pawn(this, ChessState.player.WHITE));
        this.placePiece("g2", new Pawn(this, ChessState.player.WHITE));
        this.placePiece("h2", new Pawn(this, ChessState.player.WHITE));
        this.placePiece("a1", new Rook(this, ChessState.player.WHITE));
        this.placePiece("b1", new Knight(this, ChessState.player.WHITE));
        this.placePiece("c1", new Bishop(this, ChessState.player.WHITE));
        this.placePiece("d1", new Queen(this, ChessState.player.WHITE));
        this.placePiece("e1", new King(this, ChessState.player.WHITE));
        this.placePiece("f1", new Bishop(this, ChessState.player.WHITE));
        this.placePiece("g1", new Knight(this, ChessState.player.WHITE));
        this.placePiece("h1", new Rook(this, ChessState.player.WHITE));

        this.placePiece("a7", new Pawn(this, ChessState.player.BLACK));
        this.placePiece("b7", new Pawn(this, ChessState.player.BLACK));
        this.placePiece("c7", new Pawn(this, ChessState.player.BLACK));
        this.placePiece("d7", new Pawn(this, ChessState.player.BLACK));
        this.placePiece("e7", new Pawn(this, ChessState.player.BLACK));
        this.placePiece("f7", new Pawn(this, ChessState.player.BLACK));
        this.placePiece("g7", new Pawn(this, ChessState.player.BLACK));
        this.placePiece("h7", new Pawn(this, ChessState.player.BLACK));
        this.placePiece("a8", new Rook(this, ChessState.player.BLACK));
        this.placePiece("b8", new Knight(this, ChessState.player.BLACK));
        this.placePiece("c8", new Bishop(this, ChessState.player.BLACK));
        this.placePiece("d8", new Queen(this, ChessState.player.BLACK));
        this.placePiece("e8", new King(this, ChessState.player.BLACK));
        this.placePiece("f8", new Bishop(this, ChessState.player.BLACK));
        this.placePiece("g8", new Knight(this, ChessState.player.BLACK));
        this.placePiece("h8", new Rook(this, ChessState.player.BLACK));
    }

    getBoardImageBuffer(flip = false){
        // const canvas = new Canvas(2048, 2048);
        /**
         *  TEM Q COMENTAR ISSO DPS KKK LOL
         * @type {HTMLCanvasElement}
         */
        const canvas = document.getElementById("canvas");
        canvas.width = 2048;
        canvas.height = 2048;

        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const margin = 150;

        const squareSize = (canvas.width - margin * 2) / 8;

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.fillRect(
            margin - 30, margin - 30, squareSize * 8 + 60, squareSize * 8 + 60
        );

        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){

                ctx.beginPath();

                if (i % 2 == j % 2){
                    ctx.fillStyle = "#ECECEC";
                } else {
                    ctx.fillStyle = "#424242";
                }

                ctx.fillRect(
                    margin + squareSize * i,
                    margin + squareSize * j,
                    squareSize,
                    squareSize
                );

                for (let move of this.lastMove){
                    if (move[0] == (flip ? 7-i : i) && move[1] == (flip ? j : 7-j)){
                        ctx.globalAlpha = 1;
                        ctx.fillStyle = "#77E077";
                        ctx.beginPath();
                        ctx.fillRect(
                            margin + squareSize * i,
                            margin + squareSize * j,
                            squareSize,
                            squareSize
                        );
                        ctx.globalAlpha = 1;
                    }
                }

                let piece;
                if (!flip){
                    piece = this.board[i][7 - j];
                } else {
                    piece = this.board[7 - i][j];
                }

                if (piece){
                    if (piece.name == "king"){
                        if (this.isInCheck(piece.color)){
                            ctx.globalAlpha = 1;
                            ctx.fillStyle = "#F05454";
                            ctx.beginPath();
                            ctx.fillRect(
                                margin + squareSize * i,
                                margin + squareSize * j,
                                squareSize,
                                squareSize
                            );
                            ctx.globalAlpha = 1;
                        }
                    }
                    ctx.beginPath();
                    ctx.drawImage(
                        piece.color == ChessState.player.WHITE ?
                        pieces[piece.name].sprites.white : pieces[piece.name].sprites.black,
                        margin + squareSize * i,
                        margin + squareSize * j,
                        squareSize,
                        squareSize
                    );
                }

            }
        }

        ctx.fillStyle = "black";
        ctx.font = "72px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let i = 0; i < 8; i++){
            let text;
            if (!flip){
                text = ChessState.collumn[7 - i].toUpperCase();
            } else {
                text = ChessState.collumn[i].toUpperCase();
            }

            ctx.beginPath();
            ctx.fillText(
                text,
                (margin - 30) - (margin - 30) / 2,
                margin + squareSize * (i + 1) - squareSize / 2
            );
            ctx.fillText(
                text,
                canvas.width - ((margin - 30) - (margin - 30) / 2),
                margin + squareSize * (i + 1) - squareSize / 2
            );
        }
        for (let i = 0; i < 8; i++){
            let text;
            if (!flip){
                text = ChessState.row[i].toUpperCase();
            } else {
                text = ChessState.row[7 - i].toUpperCase();
            }
            
            ctx.beginPath();
            ctx.fillText(
                text,
                margin + squareSize * (i + 1) - squareSize / 2,
                canvas.height - ((margin - 30) - (margin - 30) / 2)
            );
            ctx.fillText(
                text,
                margin + squareSize * (i + 1) - squareSize / 2,
                (margin - 30) - (margin - 30) / 2
            );
        }


        // return canvas.toBuffer("image/png");

    }

}

class King
{
    constructor(chessState, color){
        this.chessState = chessState;
        this.color = color;
        this.hasMoved = false;
        this.name = "king";
    }
    isValidMove(origin, destiny){
        const moveInfo = this.chessState.getMoveInfo(origin, destiny);
        const response = {
            valid: false,
            origin: origin,
            destiny: destiny,
        }

        if (!moveInfo.direction || !moveInfo.hasPath){
            return response;
        }
        if (moveInfo.steps > 1){
            if (moveInfo.direction[1] != 0){
                return response;
            }
            if (this.hasMoved){
                return response;
            }
            if (moveInfo.steps > 2){
                return response;
            }
            if (moveInfo.target){
                return response;
            }
            const rookPos = [
                moveInfo.direction[0] == 1 ? 7 : 0,
                this.color == ChessState.player.WHITE ? 0 : 7
            ]
            const rook = this.chessState.board[rookPos[0]][rookPos[1]];
            if (rook){
                if (rook.hasMoved){
                    return response;
                }
            } else {
                return response;
            }
            response.castling = {
                rook: rook,
                rookPos: rookPos,
                rookDestiny: [destiny[0] - moveInfo.direction[0], destiny[1]]
            };
        }
        if (moveInfo.target){
            if (moveInfo.target.color == this.color){
                return response;
            }
        }
        
        response.valid = true;
        return response;
    }
}
class Pawn
{
    constructor(chessState, color){
        this.chessState = chessState;
        this.color = color;
        this.hasMoved = false;
        this.name = "pawn";
    }
    isValidMove(origin, destiny){
        const moveInfo = this.chessState.getMoveInfo(origin, destiny);
        const response = {
            valid: false,
            origin: origin,
            destiny: destiny,
        }

        if (!moveInfo.direction || !moveInfo.hasPath){
            return response;
        }
        if (
            this.color == ChessState.player.WHITE ?
            (moveInfo.direction[1] != 1) :
            (moveInfo.direction[1] != -1) ||
            moveInfo.direction[1] == 0
        ){
            return response;
        }
        if (moveInfo.direction[0] != 0){
            if (moveInfo.steps > 1){
                return response;
            } else {
                if (!moveInfo.target){
                    return response;
                }
                if (moveInfo.target.color == this.color){
                    return response;
                }
            }
        } else {
            if (moveInfo.steps > 1){
                if (this.hasMoved){
                    return response;
                } else {
                    if (moveInfo.steps > 2){
                        return response;
                    }
                }
            }
        }
        
        response.valid = true;
        return response;
    }
}
class Queen
{
    constructor(chessState, color){
        this.chessState = chessState;
        this.color = color;
        this.hasMoved = false;
        this.name = "queen";
    }
    isValidMove(origin, destiny){
        const moveInfo = this.chessState.getMoveInfo(origin, destiny);
        const response = {
            valid: false,
            origin: origin,
            destiny: destiny,
        }

        if (!moveInfo.direction || !moveInfo.hasPath){
            return response;
        }
        if (moveInfo.target){
            if (moveInfo.target.color == this.color){
                return response;
            }
        }

        response.valid = true;
        return response;
    }
}
class Rook
{
    constructor(chessState, color){
        this.chessState = chessState;
        this.color = color;
        this.hasMoved = false;
        this.name = "rook";
    }
    isValidMove(origin, destiny){
        const moveInfo = this.chessState.getMoveInfo(origin, destiny);
        const response = {
            valid: false,
            origin: origin,
            destiny: destiny,
        }

        if (!moveInfo.direction || !moveInfo.hasPath){
            return response;
        }
        if (!moveInfo.direction.includes(0)){
            return response;
        }
        if (moveInfo.target){
            if (moveInfo.target.color == this.color){
                return response;
            }
        }

        response.valid = true;
        return response;
    }
}
class Bishop
{
    constructor(chessState, color){
        this.chessState = chessState;
        this.color = color;
        this.hasMoved = false;
        this.name = "bishop";
    }
    isValidMove(origin, destiny){
        const moveInfo = this.chessState.getMoveInfo(origin, destiny);
        const response = {
            valid: false,
            origin: origin,
            destiny: destiny,
        }

        if (!moveInfo.direction || !moveInfo.hasPath){
            return response;
        }
        if (moveInfo.direction.includes(0)){
            return response;
        }
        if (moveInfo.target){
            if (moveInfo.target.color == this.color){
                return response;
            }
        }

        response.valid = true;
        return response;
    }
}
class Knight
{
    constructor(chessState, color){
        this.chessState = chessState;
        this.color = color;
        this.hasMoved = false;
        this.name = "knight";
    }
    isValidMove(origin, destiny){
        const moveInfo = this.chessState.getMoveInfo(origin, destiny);
        const response = {
            valid: false,
            origin: origin,
            destiny: destiny,
        }

        if (!moveInfo.knightMove){
            return response;
        }
        if (moveInfo.target){
            if (moveInfo.target.color == this.color){
                return response;
            }
        }

        response.valid = true;
        return response;
    }
}

// module.export = {
//     ChessState: ChessState,
//     pieces: {
//         bishop: Bishop,
//         king: King,
//         knight: Knight,
//         pawn: Pawn,
//         queen: Queen,
//         rook: Rook
//     }
// }

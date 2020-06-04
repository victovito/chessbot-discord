const ChessRoom = require("./chessrooms");
const { ChessState } = require("./chess.js");
const Discord = require("discord.js");

class Match
{
    constructor(room, players){
        this.room = room;
        this.players = players;

        this.chessState = new ChessState();

        this.whites = null;
        this.blacks = null;

        this.turnOf = null;

    }

    static makeAMove(message, args){

        const match = ChessRoom.getMatchByRoom(message.channel);

        if (!match){
            message.channel.send("No match is being played in this room :confused:");
            return;
        }

        if (!match.players.includes(message.author)){
            message.channel.send("You are not playing this match :thinking:");
            return;
        }

        if (message.author != (
            match.turnOf == ChessState.player.WHITE ? match.whites : match.blacks
        )){
            message.channel.send("It's not your turn yet :sweat_smile:");
            return;
        }

        const pattern = /[a-h][1-8][a-h][1-8]/;
        if (!pattern.test(args[0])){
            match.room.send("Not a valid notation");
            return;
        }

        const play = match.chessState.playMove(
            args[0].slice(0, 2),
            args[0].slice(2, 4),
            match.turnOf
        );

        if (play.valid){
            match.room.send(`${message.author} played.`);
            match.changeTurn();
        } else {
            match.room.send(play.message);
        }
    }

    static getBoardImage(message){

        const match = ChessRoom.getMatchByRoom(message.channel);

        if (!match){
            message.channel.send("No match is being played in this room :confused:");
            return;
        }

        const imageBuffer = match.chessState.getBoardImageBuffer();
        const image = new Discord.MessageAttachment(imageBuffer, "board.png");
        message.channel.send(image);

    }

    sendBoardImage(){
        const imageBuffer = this.chessState.getBoardImageBuffer(
            this.turnOf == ChessState.player.BLACK
        );
        const image = new Discord.MessageAttachment(imageBuffer, "board.png");
        this.room.send(image);
    }

    changeTurn(){

        this.room.send("__***----------------------------------------------------------------------------------------------------***__");

        if (this.turnOf == null){
            this.turnOf = ChessState.player.WHITE;
        } else {
            if (this.turnOf == ChessState.player.WHITE){
                this.turnOf = ChessState.player.BLACK;
            } else {
                this.turnOf = ChessState.player.WHITE;
            }
        }
        
        const whites = this.turnOf == ChessState.player.WHITE;
        this.room.send(`:chess_pawn: ${
            whites ? ":white_circle:" : ":black_circle:"
        } ${
            whites ? "Whites" : "Blacks"
        } turn! <@${
            whites ? this.whites.id : this.blacks.id
        }> :chess_pawn:`);
        this.sendBoardImage();
    }

    start(){
        this.chooseSides();
        this.room.send(
            `:white_circle: White pieces: <@${this.whites.id}>\n` +
            `:black_circle: Black pieces: <@${this.blacks.id}>`
        );
        this.changeTurn();
    }

    chooseSides(){
        let n = Math.floor(Math.random() * 2);
        this.whites = this.players[n];
        this.blacks = this.players[Math.abs(n - 1)];
    }

}
module.exports = Match;

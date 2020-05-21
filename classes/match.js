class Match
{
    constructor(room, players){
        this.room = room;
        this.players = players;

        this.chessState = null;

        this.whites = null;
        this.blacks = null;
    }

    start(){
        this.chooseSides();
        this.room.send(
            `:white_small_square: White pieces: <@${this.whites.id}>\n` +
            `:black_small_square: Black pieces: <@${this.blacks.id}>`
        )
    }

    chooseSides(){
        let n = Math.floor(Math.random() * 2);
        this.whites = this.players[n];
        this.blacks = this.players[Math.abs(n - 1)];
    }

}
module.exports = Match;

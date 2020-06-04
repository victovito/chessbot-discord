const ChessRoom = require("./chessrooms");
const MatchMaking = require("./matchmaking");
const Match = require("./match");
const Discord = require("discord.js");

module.exports = {
    "room": {
        "create": ChessRoom.createRoom,
        "createcategory": ChessRoom.createCategory,
    },
    "match": {
        "challenge": MatchMaking.challenge,
        "c": MatchMaking.challenge,
        "accept": MatchMaking.accept,
        "a": MatchMaking.accept,
        "refuse": MatchMaking.refuse,
        "r": MatchMaking.refuse,
        "cancel": MatchMaking.cancel,
    },
    "play": Match.makeAMove,
    "p": Match.makeAMove,
    "test": function(message, args){
        const pattern = /[a-h][1-8][a-h][1-8]/;
        message.channel.send(pattern.test(args[0]));
    }
    // "flood": Generics.flood,
}

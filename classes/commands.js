const ChessRoom = require("./chessrooms");
const Generics = require("./generics");
const MatchMaking = require("./matchmaking");

module.exports = {
    "room": {
        "create": ChessRoom.createRoom,
        "createcategory": ChessRoom.createCategory,
    },
    "match": {
        "challenge": MatchMaking.challenge,
        "accept": MatchMaking.accept,
        "denny": MatchMaking.deny,
        "cancel": MatchMaking.cancel,
    }
    // "flood": Generics.flood,
}

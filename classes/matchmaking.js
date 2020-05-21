const { challenges, matches } = require("../localdata");
const ChessRoom = require("./chessrooms");
const Challenge = require("./challenge");
const Match = require("./match");

class MatchMaking
{

    // c!match challenge @viquitor
    static challenge(message){
        const challenger = message.author;
        const mentions = message.mentions.users;
        if (mentions.size > 1){
            message.channel.send("You can challenge only one person :neutral_face:");
            return;
        }
        if (mentions.first() == challenger){
            message.channel.send("You cannot challenge yourself :nerd:");
            return;
        }

        const room = ChessRoom.findEmptyRoom(message);

        if (!room){
            message.channel.send(`No room available. You can create rooms using "room create".`);
            return;
        }

        const challenge = new Challenge(
            room,
            Date.now() + message.guild.id,
            challenger,
            mentions.first()
        );

        challenges.push(
            challenge
        );

        room.send(`<@${mentions.first().id}> was challenged by <@${challenger.id}> for a chess match! :chess_pawn: :fire:`);
        mentions.first().send(`Your were challenged by <@${challenger.id}> for a chess match in <#${room.id}>! :chess_pawn: :fire:`);

    }

    static accept(message){
        
        const challenge = ChessRoom.getChallengeByRoom(message.channel);

        if (!challenge){
            message.channel.send("No challenge found in this room :confused:");
            return;
        }

        if (message.author != challenge.challenged){
            message.channel.send("You cannot accept this challenge :yawning_face:");
            return;
        }

        const match = new Match(
            challenge.room,
            [
                challenge.challenger,
                challenge.challenged
            ]
        );

        matches.push(
            match
        );

        message.channel.send(`:chess_pawn: A match between <@${challenge.challenger.id}> and <@${challenge.challenged.id}> has started :chess_pawn:`)
        match.start();

        challenges.splice(challenges.indexOf(challenge), 1);
        
        challenge.room.overwritePermissions([
            {
                id: challenge.room.guild.roles.everyone.id,
                deny: ["SEND_MESSAGES"]
            },
            {
                id: challenge.challenger,
                allow: ["SEND_MESSAGES"]
            },
            {
                id: challenge.challenged,
                allow: ["SEND_MESSAGES"]
            }
        ]);

    }

    static deny(){

    }

    static cancel(){

    }

    static startMatch(room, players){

    }
}
module.exports = MatchMaking;

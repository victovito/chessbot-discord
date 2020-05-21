const { Discord, client } = require("../index");
const { rooms } = require("../config.json");
const { prefix } = require("../config.json");
const { challenges } = require("../localdata");

class ChessRoom
{

    static roomName = "chessroom-"

    static async createRoom(message){

        const channels = message.guild.channels;
        const category = channels.cache.find(
            channel => channel.type == "category" && channel.name == "CHESS ROOMS"
        );

        if (!category){
            message.channel.send(
                `No category named "CHESS ROOMS" exists. First, use the command "${prefix}room createcategory" to create it.`
            );
            return;
        }

        const textChannels = channels.cache.filter(
            channel => channel.type == "text" && channel.parentID == category.id
        ).array();
        let roomNum = 1;
        for (let i = 0; i < textChannels.length; i++){
            const channel = textChannels[i];
            if (channel.name.startsWith(ChessRoom.roomName) && channel.type == "text"){
                const end = parseInt(channel.name.split("-")[1]);
                if (!isNaN(end)){
                    if (end == roomNum){
                        roomNum = end + 1;
                        i = -1;
                    }
                };
            }
        }
        channels.create(`${ChessRoom.roomName}${roomNum}`, { type: "text", parent: category });
    }

    static async createCategory(message){
        const channels = message.guild.channels;
        let category = channels.cache.find(
            channel => channel.type == "category" && channel.name == "CHESS ROOMS"
        );
        if (!category){
            channels.create("CHESS ROOMS", { type: "category" });
        } else {
            message.channel.send("Category alread exists!");
        }
    }

    static findEmptyRoom(message){
        const category = message.guild.channels.cache.filter(
            channel => channel.name == "CHESS ROOMS" && channel.type == "category"
        ).first();

        if (!category){
            message.channel.send(`"Chess Rooms" category not found. Create it using "room createcategory".`);
            return;
        }
        
        const channels = message.guild.channels.cache.filter(
            channel => channel.name.startsWith(ChessRoom.roomName) &&
            channel.parentID == category.id
        ).array();

        roomloop: for (let channel of channels){
            for (let challenge of challenges){
                if (channel == challenge.room){
                    continue roomloop;
                }
            }
            return channel;
        }
        return undefined;
    }

    static getChallengeByRoom(room){
        for (let challenge of challenges){
            if (challenge.room == room){
                return challenge;
            }
        }
        return undefined;
    }

}
module.exports = ChessRoom;

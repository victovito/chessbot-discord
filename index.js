const Discord = require("discord.js");
const { prefix, token, rooms } = require("./config.json");
const ChessRoom = require("./classes/chessrooms");
const commands = require("./classes/commands");
const client = new Discord.Client();
require("./classes/commands");

module.exports = {
    Discord: Discord,
    client: client
};

client.login(token);

client.once("ready", () => {
    console.log("Ready!");
});

client.on("message", message => {

    if (!message.content.startsWith(prefix)){
        return;
    }
    
    const args = message.content.split(" ");
    args[0] = args[0].replace(prefix, "");

    let actualCommand = null;
    let command = commands;
    let i = 0;
    for (i; i < args.length; i++){
        const nexCommand = command[args[i]];
        if (!nexCommand){
            message.channel.send("Command not found! :pensive:");
            return;
        }
        actualCommand = args[i];
        command = nexCommand;
        if (typeof(command) == "function"){
            break;
        }
    }
    if (typeof(command) == "function"){
        command(message, args.slice(i + 1));
    } else {
        message.channel.send(
            `Available commands in "${actualCommand}": ` +
            "```" + Object.keys(command).join(", ") + "```"
        );
    }

});



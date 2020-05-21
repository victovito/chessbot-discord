class Generics
{

    static flood(message){
        const users = message.mentions.users.array();
        let mentions = "";
        for (let u of users){
            mentions += `<@${u.id}> `;
        }
        message.channel.send("Vou fazer uma maldade :smiling_imp: " + mentions);

        const amount = 10;

        const sendMessageRecursively = function(user, amount){
            if (amount == 0){
                return;
            }
            user.send(`<@${user.id}> VOCE ESTÁ SENDO CHAMADO POR <@${message.author.id}> EM <#${message.channel.id}>`);
            setTimeout(() => sendMessageRecursively(user, amount - 1), 1000)
        }
        
        if (message.author.id == "333046970551762945"){
            message.channel.send(`DAVI AQUI NÃO KKKKKKKKKKKKKKKKKKK, VO TE FLOODAR <@${message.author.id}> :smiling_imp::smiling_imp::smiling_imp::smiling_imp:`);
            sendMessageRecursively(message.author, amount);
            return;
        }

        for (let user of users){
            sendMessageRecursively(user, amount);
        }
    }
}
module.exports = Generics;

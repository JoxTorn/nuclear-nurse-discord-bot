const { GuildAuditLogsEntry } = require("discord.js");

exports.run = (client, message, args) => {

    var member = message.guild.members.cache.find(memebr => memebr.id == message.author.id);
    var guild = message.guild;

    /*
    if(!member.roles.find(role => role.name === client.config.verified_role)){
        return message.reply(`You need to be verified to use this command, please type ${client.config.prefix}verify for verification`);
    }
    */
    
    if(message.channel.name == 'general'){
        return message.reply(`Can't execute this command on this channel`);
    }
    

    var mantionRole = guild.roles.cache.find(role => role.name === client.config.revive_command_mention[guild.id]);
    //var mantionRole = '<@&617337809228922881>';


    var author = message.author;
    /************************************/

    var currentChannel = message.channel.name;
    var respenseChannel = message.channel;

    //for(var rediresct of client.config.revive_request_redirect)
    var redirect = client.config.revive_request_redirect.find(function(element) {return element.from == currentChannel;})
    if(redirect){
        respenseChannel = guild.channels.cache.find(channel => channel.name == redirect.to);
        if(!respenseChannel){
            respenseChannel = message.channel;
            redirect = undefined;
        }
    }
    
    /************************************/

    if(message.mentions.users.first()){
        mentionedMember = message.guild.members.get(message.mentions.users.first().id);

        var id = getIdFormNickname(mentionedMember.nickname || mentionedMember.user.username);
    
            if(id){
                //message.channel.send(`${mantionRole}, please revive ${mentionedMember.nickname || mentionedMember.user.username}\nhttps://www.torn.com/profiles.php?XID=${id}#/`);
                respenseChannel.send(`${mantionRole}, please revive ${mentionedMember.nickname || mentionedMember.user.username}\n<https://www.torn.com/profiles.php?XID=${id}#/>\n_Requested by **${author}**_`);
                if(redirect){message.reply('Your request is passed to revivers').then(responseMessage => {setTimeout(function() {responseMessage.delete().catch(console.error);}, 3000);})}
            }
            else{
                message.reply('Can\'t send that message, I didn\'t found ID of mentioned member');
            }
    }
    else{
        if(args[0]){
            if(isNaN(args[0])){
                //message.channel.send(`${mantionRole}, please revive player with name ${args[0]}\nhttps://www.torn.com/profiles.php?NID=${args[0]}#/`);
                respenseChannel.send(`${mantionRole}, please revive player with name ${args[0]}\n<https://www.torn.com/profiles.php?NID=${args[0]}#/>\n_Requested by **${author}**_`);
                if(redirect){message.reply('Your request is passed to revivers').then(responseMessage => {setTimeout(function() {responseMessage.delete().catch(console.error);}, 3000);})}
            }
            else{
                //message.channel.send(`${mantionRole}, please revive player with id ${args[0]}\nhttps://www.torn.com/profiles.php?XID=${args[0]}#/`);
                respenseChannel.send(`${mantionRole}, please revive player with id ${args[0]}\n<https://www.torn.com/profiles.php?XID=${args[0]}#/>\n_Requested by **${author}**_`);
                if(redirect){message.reply('Your request is passed to revivers').then(responseMessage => {setTimeout(function() {responseMessage.delete().catch(console.error);}, 3000);})}
            }
        }
        else{
            var id = getIdFormNickname(member.nickname || member.user.username);
    
            if(id){
                //message.channel.send(`${mantionRole}, please revive ${member.nickname || member.user.username}\nhttps://www.torn.com/profiles.php?XID=${id}#/`);
                respenseChannel.send(`${mantionRole}, please revive ${member.nickname || member.user.username}\n<https://www.torn.com/profiles.php?XID=${id}#/>\n_Requested by **${author}**_`);
                if(redirect){message.reply('Your request is passed to revivers').then(responseMessage => {setTimeout(function() {responseMessage.delete().catch(console.error);}, 3000);})}
            }
            else{
                message.reply('Can\'t send that message, I didn\'t found your ID');
            }
        }
    }
    
    setTimeout(function() {
        message.delete().catch(console.error);
    }, 3000);



    //Function for finding id from nickname name[id]
    function getIdFormNickname(name){
        var re = /.+\[(\d+)\]/gm;
        var parsed = name.split(re);
        return parsed[1];
    }
}

exports.run = (client, message, args) => {

    var member = message.guild.members.cache.find(memebr => memebr.id == message.author.id);

    if(!member.roles.cache.find(role => role.name === client.config.verified_role)){
        return message.reply(`You need to be verified to use this command, please type ${client.config.prefix}verify for verification`);
    }
    
    if(message.mentions.users.first()){
        mentionedMember = message.guild.members.get(message.mentions.users.first().id);

        var id = getIdFormNickname(mentionedMember.nickname || mentionedMember.user.username);
    
            if(id){
                message.channel.send(`<https://www.torn.com/profiles.php?XID=${id}#/>`);
            }
            else{
                message.reply('Can\'t send that message, I didn\'t found ID of mentioned member');
            }
    }
    else{
        if(args[0]){
            if(isNaN(args[0])){
                message.channel.send(`<https://www.torn.com/profiles.php?NID=${args[0]}#/>`);
            }
            else{
                message.channel.send(`<https://www.torn.com/profiles.php?XID=${args[0]}#/>`);
            }
        }
        else{
            var id = getIdFormNickname(member.nickname || member.user.username);
    
            if(id){
                message.channel.send(`<https://www.torn.com/profiles.php?XID=${id}#/>`);
            }
            else{
                message.reply('Can\'t send that message, I didn\'t found your ID');
            }
        }
    }

    setTimeout(function() {
        message.delete().catch(console.error);
     }, 5000);
    

    //Function for finding id from nickname name[id]
    function getIdFormNickname(name){
        var re = /.+\[(\d+)\]/gm;
        var parsed = name.split(re);
        return parsed[1];
    }
}

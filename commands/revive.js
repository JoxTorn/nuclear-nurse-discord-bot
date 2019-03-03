exports.run = (client, message, args) => {

    if(!message.member.roles.find(role => role.name === client.config.verified_role)){
        return message.reply(`You need to be verified to use this command, please type ${client.config.prefix}verify for verification`);
    }
    
    if(message.channel.name == 'general'){
        return message.reply(`Can't execute this command on this channel`);
    }

    var member = message.member;
    var guild = message.guild;
    var mantionRole = guild.roles.find(role => role.name === client.config.revive_command_mention);

    if(message.mentions.users.first()){
        mentionedMember = message.guild.members.get(message.mentions.users.first().id);

        var id = getIdFormNickname(mentionedMember.nickname || mentionedMember.user.username);
    
            if(id){
                message.channel.send(`${mantionRole}, please revive ${mentionedMember.nickname || mentionedMember.user.username}\nhttps://www.torn.com/profiles.php?XID=${id}#/`);
            }
            else{
                message.reply('Can\'t send that message, I didn\'t found ID of mentioned member');
            }
    }
    else{
        if(args[0]){
            if(isNaN(args[0])){
                message.channel.send(`${mantionRole}, please revive player with name ${args[0]}\nhttps://www.torn.com/profiles.php?NID=${args[0]}#/`);
            }
            else{
                message.channel.send(`${mantionRole}, please revive player with id ${args[0]}\nhttps://www.torn.com/profiles.php?XID=${args[0]}#/`);
            }
        }
        else{
            var id = getIdFormNickname(member.nickname || member.user.username);
    
            if(id){
                message.channel.send(`${mantionRole}, please revive ${member.nickname || member.user.username}\nhttps://www.torn.com/profiles.php?XID=${id}#/`);
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

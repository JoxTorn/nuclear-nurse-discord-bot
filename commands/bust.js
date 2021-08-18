exports.run = (client, message, args) => {

    var member = message.guild.members.cache.find(memebr => memebr.id == message.author.id);

    if(!member.roles.cache.find(role => role.name == client.config.verified_role)){
        return message.reply(`You need to be verified to use this command, please type ${client.config.prefix}verify for verification`);
    }
    
    if(message.channel.name == 'general'){
        return message.reply(`Can't execute this command on this channel`);
    }
    
    var guild = message.guild;
    //var mantionRole = guild.roles.find(role => role.name === client.config.revive_command_mention);
    var mantionRole = '<@&695958006462152774>';

    
    /************************************/

    var currentChannel = message.channel.name;
    var respenseChannel = message.channel;

    var redirect = client.config.bust_request_redirect.find(function(element) {return element.from == currentChannel;})
    if(redirect){
        respenseChannel = guild.channels.find(channel => channel.name == redirect.to);
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
                respenseChannel.send(`${mantionRole}, please bust ${mentionedMember.nickname || mentionedMember.user.username}\nhttps://www.torn.com/profiles.php?XID=${id}#/`);
                if(redirect){message.reply('Your request is passed to busters').then(responseMessage => {setTimeout(function() {responseMessage.delete().catch(console.error);}, 3000);})}
            }
            else{
                message.reply('Can\'t send that message, I didn\'t found ID of mentioned member');
            }
    }
    else{
        if(args[0]){
            if(isNaN(args[0])){
                respenseChannel.send(`${mantionRole}, please bust player with name ${args[0]}\nhttps://www.torn.com/profiles.php?NID=${args[0]}#/`);
                if(redirect){message.reply('Your request is passed to busters').then(responseMessage => {setTimeout(function() {responseMessage.delete().catch(console.error);}, 3000);})}
            }
            else{
                respenseChannel.send(`${mantionRole}, please bust player with id ${args[0]}\nhttps://www.torn.com/profiles.php?XID=${args[0]}#/`);
                if(redirect){message.reply('Your request is passed to busters').then(responseMessage => {setTimeout(function() {responseMessage.delete().catch(console.error);}, 3000);})}
            }
        }
        else{
            var id = getIdFormNickname(member.nickname || member.user.username);
    
            if(id){
                respenseChannel.send(`${mantionRole}, please bust ${member.nickname || member.user.username}\nhttps://www.torn.com/profiles.php?XID=${id}#/`);
                if(redirect){message.reply('Your request is passed to busters').then(responseMessage => {setTimeout(function() {responseMessage.delete().catch(console.error);}, 3000);})}
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

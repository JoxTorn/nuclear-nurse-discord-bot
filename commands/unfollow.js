exports.run = (client, message, args) => {
 
    let roles = [];
    let roleNames = '';

    var member = message.guild.members.cache.find(memebr => memebr.id == message.author.id);

    for(let i = 0; i < args.length; i++){
        if(client.config.follow_roles.includes(args[i].toLowerCase())){
            roles.push(message.guild.roles.cache.find(role => role.name.toLowerCase() === args[i].toLowerCase()));
            roleNames += (roleNames == '' ? '' : ', ') + args[i];
        }
    }

    if(roles.length > 0){
        member.roles.remove(roles).then(m => {
            message.channel.send(`${m}, you have removed ${roleNames} role${roles.length > 1 ? 's' : ''}.`).then(responseMessage => {setTimeout(function() {responseMessage.delete().catch(console.error);}, 3000);}).catch(console.error);
        }).catch(error => {
            if(error.code == 50013){
                message.channel.send(`I don't have permission to modify roles for ${member}`).then(responseMessage => {setTimeout(function() {responseMessage.delete().catch(console.error);}, 3000);}).catch(console.error);
            }
            else{
                console.log(error);
            }
        });
    }
    else{
        message.channel.send(`No roles to remove`).then(responseMessage => {setTimeout(function() {responseMessage.delete().catch(console.error);}, 3000);}).catch(console.error);
    }

    
    setTimeout(function() {
        message.delete().catch(console.error);
    }, 2000);
}

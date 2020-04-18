exports.run = (client, message, args) => {
 
    let roles = [];
    let roleNames = '';

    for(let i = 0; i < args.length; i++){
        if(client.config.follow_roles.includes(args[i])){
            roles.push(message.guild.roles.find(role => role.name === args[i]));
            roleNames += (roleNames == '' ? '' : ', ') + args[i];
        }
    }

    if(roles.length > 0){
        message.member.removeRoles(roles).then(m => {
            message.channel.send(`${m}, you have removed ${roleNames} role${roles.length > 1 ? 's' : ''}.`).catch(console.error);
        }).catch(error => {
            if(error.code == 50013){
                message.channel.send(`I don't have permission to modify roles for ${message.member}`).catch(console.error);
            }
            else{
                console.log(error);
            }
        });
    }
    else{
        message.channel.send(`No roles to remove`).catch(console.error);
    }
}
module.exports = (client, member) => {
   //Send welcome message to defaul channel (default channel is defined in config)
   member.guild.channels.find(channel => channel.name == client.config.welcome_channel).send(`Welcome <@${member.id}>, please type ${client.config.prefix}verify for verification`); 
}
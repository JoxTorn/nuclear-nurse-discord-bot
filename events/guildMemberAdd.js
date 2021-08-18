module.exports = (client, member) => {
   //Send welcome message to defaul channel (default channel is defined in config)
   setTimeout(function() {
      member.guild.channels.cache.find(channel => channel.name == client.config.welcome_channel).send(`Welcome <@${member.id}>, please type ${client.config.prefix}verify for verification`); 
   }, 5000);
   
}
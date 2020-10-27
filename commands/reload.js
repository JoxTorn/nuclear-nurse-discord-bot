exports.run = async (client, message, args) => {

  var member = await message.guild.fetchMember(message.author.id, false);

  //This command is available only for members with administrative role
  if(!member.roles.find(role => role.name === client.config.admin_role)){
    return message.reply("You don\'t have permission to execute this command");
  }

  if(!args || args.size < 1) return message.reply("Must provide a command name to reload.");
  const commandName = args[0];
  // Check if the command exists and is valid
  if(client.commands[commandName] == undefined) {
    return message.reply("That command does not exist");
  }
  // the path is relative to the *current folder*, so just filename.js
  delete require.cache[require.resolve(`./${commandName}.js`)];
  // We also need to delete and reload the command from the client commands Enmap
  delete client.commands[commandName];
  const props = require(`./${commandName}.js`);
  client.commands[commandName]= props;
  message.reply(`The command ${commandName} has been reloaded`);
};
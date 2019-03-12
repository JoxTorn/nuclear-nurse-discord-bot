const Discord = require("discord.js");
const fs = require('fs');
var path = require('path');

//Initating discord client
const  client = new Discord.Client({forceFetchUsers: true}); 
//If there is no force fatch users some users will not be fetch and will have problem if i tyr to access then ove guild members list
//https://github.com/discordjs/discord.js/issues/230

const config = require("./config.json");
// We also need to make sure we're attaching the config to the CLIENT so it's accessible everywhere!
client.config = config;

//Set bot token 
client.config.token = process.env.token;

//Set torn api key
client.config.torn_api_key = process.env.torn_api_key;

//Set random.org api keu
client.config.random_org_api = process.env.random_org_api;

//setting export path to go to export directory
client.config.exportPath = __dirname;

client.commands = {};

//Loading all commands
fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        console.log(`Attempting to load command ${commandName}`);
        client.commands[commandName]= props;
    });
});

//Loading all events
fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        console.log(`Attempting to load event ${eventName}`);
        client.on(eventName, event.bind(null, client));
    });
});

//Log in to discord
client.login(client.config.token);

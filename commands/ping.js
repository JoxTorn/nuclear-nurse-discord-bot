exports.run = (client, message, args) => {
    //Ping back
    message.channel.send("pong").catch(console.error);
}
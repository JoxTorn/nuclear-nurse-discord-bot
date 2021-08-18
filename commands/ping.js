exports.run = (client, message, args) => {
    //Ping back
    message.channel.send("Pong!").then(m => {
        // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
        // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
        m.edit(`Pong!\nLatency is ${m.createdTimestamp - message.createdTimestamp}ms.\nAPI Latency is ${Math.round(client.ws.ping)}ms`)
    }).catch(console.error);
}
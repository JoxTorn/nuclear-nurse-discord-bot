exports.run = (client, message, args) => {
    //Ping back
    message.channel.send("pong").then((msg) => {
        msg.react("🚑").then(() => {
            msg.react("👍").then(() => {
                let botReactions = msg.reactions.filter(reaction => reaction.users.has(client.user.id));

                console.log(botReactions.size);
                /*
                console.log(msg.reactions.filter(reaction => {
                    //console.log(reaction.emoji.name, reaction.users)
                    reaction.users.has(client.user.id)
                }));
                //let userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(client.user.id));
                //console.log(userReactions);
                */
            })
        });
    }).catch(console.error);

    
    
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    //const m = await message.channel.send("Ping?");
    //m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
}
const https = require('https');

exports.run = async (client) => {

    var interval = 1000 /*miliseconds*/ * 30 /*seconds*/ ;
    repeat = undefined; //undefined = forever
    repeatCount = 0;

    var job = setInterval(checkMessages, interval);

    function checkMessages() {
        try {
            var guild = client.guilds.cache.find(guild => {
                return guild.id == '545317324089982976'
            });
            if (guild) {
                var channels = guild.channels.cache.filter(channel => {
                    return channel.name == 'reviving' || channel.name == 'reviving-public' || channel.name == 'jux' ||
                        channel.name == 'jfk' || channel.name == 'ns' || channel.name == 'ak' || channel.name == 'elimination' || channel.name == 'illuminati' ||
                        channel.name == 'pt-family' || channel.name == 'da' || channel.name == 'cr' || channel.name == 'vulpes' || channel.name == 'monarch' ||
                        channel.name == 'dystopia' || channel.name == 'nuke' || channel.name == 'thedeepend' || channel.name == 'warbirds' || channel.name == 'mss' ||
                        channel.name == 'bloodbathandbeyond' || channel.name == 'legacy' || channel.name == 'premium-revive'
                });
                var startTime = Date.now();

                channels.each(channel => {
                    channel.messages.fetch({
                        limit: 50
                    }).then(messages => {

                        var messagesToDelete = messages.filter(message => {
                            if (message.author.id == '300686645370421248') {
                                return false;
                            } else {
                                let botReactions = message.reactions.cache.filter(reaction => {
                                    let bool = reaction.me;
                                    return bool;
                                });
                                if (botReactions.size > 1) {
                                    return true;
                                }
                            }

                            return false;
                        })

                        channel.bulkDelete(messagesToDelete);

                    });

                    channel.messages.fetch({
                        limit: 50
                    }).then(messages => {

                        var messagesToCheck = messages.filter(message => {
                            if (message.author.id == '300686645370421248') {
                                return false;
                            } else {
                                let botReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(client.user.id));
                                if (botReactions.size > 1) {
                                    console.log('Message already checked, skip', message.id, botReactions.size);
                                    return false;
                                } else {
                                    console.log('Message NOT checked, Test IT', message.id, botReactions.size);
                                    return true;
                                }
                            }
                        })

                        messagesToCheck.each(message => {
                            var re = /(https:\/\/www\.torn\.com\/profiles\.php\?XID=)(\d+)/gm;
                            var found = re.exec(message.content);
                            var test = false;
                            if (found && found.length == 3) {
                                test = true;
                            }
                            if (test) {
                                testReviveMessage(found[2], message)
                            } else {
                                var channelsForDeletedMessages = guild.channels.cache.filter(channel => {
                                    return channel.name == 'deleted-reviving-messages'
                                });

                                channelsForDeletedMessages.each(channel => {
                                    channel.send('No player id found, Delete IT')
                                    channel.send(message.content)
                                })

                                message.delete().catch(console.error);
                            }
                        })
                    })
                })
            } else {
                console.warn('checkMessages', 'No guild found...');
            }

            repeatCount++;
            if (repeatCount == repeat) {
                clearInterval(job);
            }
        } catch (error) {
            console.error(error);
        }
    }

    function testReviveMessage(playerID, msg) {

        var startTime = Date.now();

        var url = `https://www.nukefamily.org/dev/playerProfile.php?id=${playerID}`;

        https.get(url, function (res) {
            var body = '';

            res.on('data', function (chunk) {
                body += chunk;
            });

            res.on('end', function () {
                try {

                    //console.log(`Data recieved from torn api for ${playerID}. Time needed ${Date.now()-startTime}`);

                    var guild = client.guilds.cache.find(guild => {
                        return guild.id == '545317324089982976'
                    });
                    //console.log('message:' , msg);

                    var obj = JSON.parse(body);

                    if (obj.error) {
                        console.log(obj.error, msg.id);
                    } else {

                        //console.log(`Hospital time remainig for ${playerID}: ${obj.states.hospital_timestamp}`);

                        if (obj.states.hospital_timestamp == 0) {
                            //console.log('Hospital time 0, Delete IT', obj.states.hospital_timestamp, obj.name);
                            var channelsForDeletedMessages = guild.channels.cache.filter(channel => {
                                return channel.name == 'deleted-reviving-messages'
                            });
                            channelsForDeletedMessages.each(channel => {
                                console.log('Hospital time 0, Delete IT');
                                //channel.send('Hospital time 0, Delete IT')
                                msg.react("🚑").then(() => {
                                    msg.react("👍").then(() => {
                                        msg.react("❤️").then(() => { //"549268101473239040"
                                            channel.send(msg.content)
                                        }).catch(console.error)
                                    }).catch(console.error)
                                }).catch(console.error);
                            })

                            //msg[1].delete().catch(console.error);
                            //deleteMessage(msg[1]);
                        } else {
                            console.log('Hospital time not 0, Leave IT', obj.states.hospital_timestamp, obj.name);
                        }

                        //check is travel
                        if (obj.basicicons && obj.basicicons.icon71) {
                            msg.react("✈️");
                        }
                    }
                } catch (error) {
                    console.log(error, msg.id);
                }

            });
        }).on('error', function (error, tornID) {
            console.log(error);
        });
    }

    //function deleteMessage(msg){
    //    setTimeout(function() {msg.delete().catch(console.error);}, 60000);
    //}
}

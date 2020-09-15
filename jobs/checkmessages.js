const https = require('https');

exports.run = (client) => {
    
    var interval = 1000 /*miliseconds*/ * 10 /*seconds*/;
    repeat = undefined; //undefined = forever
    repeatCount = 0;

    var job = setInterval(checkMessages, interval);

    function checkMessages(){
        var guild = client.guilds.get('545317324089982976');
        if(guild){
            var channels = guild.channels.filter(channel => { return channel.name == 'reviving' || channel.name == 'jux' || channel.name == 'jfk' || channel.name == 'ns' || channel.name == 'ak' || channel.name == 'elimination' || channel.name == 'pt-family' || channel.name == 'da' || channel.name == 'cr'});
            var startTime = Date.now();

            for(var channel of channels){
                //console.log('channel', channel);
                channel[1].fetchMessages({limit: 50}).then( messages => {
                    var checkPoint1 = Date.now(); 
                    
                    //console.log(`Message fatch time for channel ${messages.first().channel.name}: ${checkPoint1 -startTime}`);
                    for(msg of messages){
                        if(msg[1].author.id == '300686645370421248'){
                            //console.log('This message will be skipped because its created by ', msg[1].author.username, msg[1].content);
                        }
                        else{
                            var re = /(https:\/\/www\.torn\.com\/profiles\.php\?XID=)(\d+)/gm;
                            var found = re.exec(msg[1].content);
                            var test = false;
                            if(found && found.length == 3){
                                test = true;
                            }
                            if(test){
                                //console.log(msg[0], msg[1].content, msg[1].createdTimestamp,  'TEST IT');
                                testReviveMessage(found[2], msg)
                            }
                            else{
                                //console.log(msg[0], msg[1].content, msg[1].createdTimestamp, 'DELETE IT');
                                var channelsForDeletedMessages = guild.channels.filter(channel => { return channel.name == 'deleted-reviving-messages'});
                                for(var channelDel of channelsForDeletedMessages){
                                    channelDel[1].send('No player id found, Delete IT');
                                    channelDel[1].send(msg[1].content);
                                }
                                msg[1].delete().catch(console.error);
                            }
                        }
                    }
                    var checkPoint2 = Date.now(); 
                    //console.log(`Message porecessing time for channel ${messages.first().channel.name}: ${checkPoint2-checkPoint1}`);
                })
            }
        }
        else{
            console.warn('checkMessages', 'No guild found...');
        }

        repeatCount++;
        if(repeatCount == repeat){
            clearInterval(job);
        }
    }

    function testReviveMessage(playerID, msg){

        var startTime = Date.now();

        var url = `https://www.nukefamily.org/dev/playerProfile.php?id=${playerID}`;

        https.get(url, function(res){
            var body = '';
        
            res.on('data', function(chunk){
                body += chunk;
            });
        
            res.on('end', function(){
                try {

                    //console.log(`Data recieved from torn api for ${playerID}. Time needed ${Date.now()-startTime}`);

                    var guild = client.guilds.get('545317324089982976');
                    //console.log('message:' , msg);

                    var obj = JSON.parse(body);
            
                    if(obj.error){
                        console.log(obj.error, msg[0]);
                    }
                    else{

                        //console.log(`Hospital time remainig for ${playerID}: ${obj.states.hospital_timestamp}`);

                        if(obj.states.hospital_timestamp == 0){
                            //console.log('Hospital time 0, Delete IT', obj.states.hospital_timestamp, obj.name);
                            var channelsForDeletedMessages = guild.channels.filter(channel => { return channel.name == 'deleted-reviving-messages'});
                            for(var channelDel of channelsForDeletedMessages){
                                console.log('Hospital time 0, Delete IT');
                                channelDel[1].send('Hospital time 0, Delete IT');
                                channelDel[1].send(msg[1].content);
                            }
                            msg[1].react(":ambulance:");
                            //msg[1].delete().catch(console.error);
                            deleteMessage(msg[1]);
                        }
                        else{
                            console.log('Hospital time not 0, Leave IT', obj.states.hospital_timestamp, obj.name);
                        }
                    }
                } catch (error) {
                    console.log(error, msg[0]);
                }
        
            });
        }).on('error', function(error, tornID){
            console.log(error);
        });
    }

    deleteMessage(msg){
        setTimeout(function() {msg.delete().catch(console.error);}, 3000);
    }
}

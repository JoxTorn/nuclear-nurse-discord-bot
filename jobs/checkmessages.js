const https = require('https');

exports.run = (client) => {
    
    var interval = 1000 /*miliseconds*/ * 10 /*seconds*/;
    repeat = undefined; //undefined = forever
    repeatCount = 0;

    var job = setInterval(checkMessages, interval);

    function checkMessages(){
        var guild = client.guilds.get('545317324089982976');
        if(guild){
            var channels = guild.channels.filter(channel => { return channel.name == 'reviving' || channel.name == 'ns'});
            
            for(var channel of channels){
                //console.log('channel', channel);
                channel[1].fetchMessages({limit: 50}).then( messages => {
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
                                msg[1].delete().catch(console.error);
                            }
                        }
                    }
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


        var url = `https://www.nukefamily.org/dev/playerProfile.php?id=${playerID}`;

        https.get(url, function(res){
            var body = '';
        
            res.on('data', function(chunk){
                body += chunk;
            });
        
            res.on('end', function(){
                try {

                    //console.log('message:' , msg);

                    var obj = JSON.parse(body);
            
                    if(obj.error){
                        console.log(obj.error, msg[0]);
                    }
                    else{
                        if(obj.states.hospital_timestamp == 0){
                            //console.log('Hospital time 0, Delete IT', obj.states.hospital_timestamp, obj.name);
                            msg[1].delete().catch(console.error);
                        }
                        else{
                            //console.log('Hospital time not 0, Leave IT', obj.states.hospital_timestamp, obj.name);
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

}
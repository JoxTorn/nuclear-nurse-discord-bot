exports.run = (client) => {

    var interval = 1000 /*miliseconds*/ * 60 /*seconds*/ * 1 /*minutes*/;
    var deleteAfter = 1000 /*miliseconds*/ * 60 /*seconds*/ * 1 /*minutes*/
 
    var job = setInterval(cleenAssitChannel, interval);


    function cleenAssitChannel(){

        var guild = client.guilds.get('307223431924023296');
        if(guild){
            var channelAssist = guild.channels.filter(channel => { return channel.name == 'attack-assisting'}).first();

            //console.log(channelAssist);

            channelAssist.fetchMessages({limit: 50}).then( messages => {
                
                for(msg of messages){
                    if(msg[1].author.id == '300686645370421248'){
                        //console.log('This message will be skipped because its created by ', msg[1].author.username, msg[1].content);
                    }
                    else{
                        if((Date.now() - msg[1].createdTimestamp) > deleteAfter){
                            msg[1].delete().catch(console.error);
                        }
                    }
                }
            })
        }
        else{
            console.warn('assist cleenup', 'No guild found...');
        }
    }

}
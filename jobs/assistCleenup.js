exports.run = (client) => {

    var interval = 1000 /*miliseconds*/ * 60 /*seconds*/ * 1 /*minutes*/;
    var deleteAfter = 1000 /*miliseconds*/ * 60 /*seconds*/ * 1 /*minutes*/
 
    var job = setInterval(cleenAssitChannel, interval);

    //setTimeout(cleenAssitChannel, interval);

    function cleenAssitChannel(){

        var guild = client.guilds.cache.find(guild => {
            return guild.id == '307223431924023296'
        });
        if(guild){
            var channelAssist = guild.channels.cache.filter(channel => { return channel.name == 'attack-assisting'}).first();

            channelAssist.messages.fetch({limit: 50}).then( messages => {
                
                let MessageForDelete = messages.filter(msg => {
                    if(msg.author.id == '300686645370421248'){
                        return false;
                    }
                    else{
                        if((Date.now() - msg.createdTimestamp) > deleteAfter){
                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                })

                channelAssist.bulkDelete(MessageForDelete);
            })
        }
        else{
            console.warn('assist cleenup', 'No guild found...');
        }
    }

}
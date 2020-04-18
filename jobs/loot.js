const https = require('https');

exports.run = (client) => {

    //Template for jobs, use this code as starting point for new job
    
    var interval = 1000 /*miliseconds*/ * 60 /*seconds*/ * 2 /*minutes*/;
    var ping_uder = 60 /*seconds*/ * 5 /*minutes*/;
 
    var job = setInterval(checkLoot, interval);

    const npcImage = {
        "4" : "https://profileimages.torn.com/4d661456-1798-ad32-4.png",
        "7" : "https://profileimages.torn.com/4d661456-17e6-65aa-7.png",
        "10" : "https://profileimages.torn.com/50bdc916-3fc2-d678-10.png",
        "15" : "https://profileimages.torn.com/4d661456-17bc-2098-15.png",
        "19" : "https://profileimages.torn.com/4d661456-205b-349e-19.png"
    }

    function checkLoot(){
        webRequest(`https://yata.alwaysdata.net/loot/timings/`, parseData);
    }

    function parseData(json){
        let data = JSON.parse(json);

        var guild = client.guilds.get('454591553432846336');
        if(guild){
            var channelLoot = guild.channels.filter(channel => { return channel.name == 'loot'}).first();

            const entries = Object.entries(data);
            for (const [id, npc] of entries) {

                if(npc.levels.current == 3 || npc.levels.current == 4){
                    if(npc.timings[npc.levels.next].due > ping_uder){
                        //If due is bigger then ping under skip...
                        continue;
                    }
                }
                else{
                    //if current lvl is not 3 or 4 skip...
                    continue;
                }

                const msgEmbed = {
                    color: 0x0099ff,
                    title: `${npc.name} Loot level ${npc.levels.current}`,
                    //url: `https://www.torn.com/profiles.php?XID=${id}`,
                    // author: {
                    //     name: 'Some name',
                    //     icon_url: 'https://i.imgur.com/wSTFkRM.png',
                    //     url: 'https://discord.js.org',
                    // },
                    description: `https://www.torn.com/profiles.php?XID=${id}`,
                    thumbnail: {
                        url: npcImage[id],
                    },
                    fields: [
                        {
                            name: `Loot level ${npc.levels.next}`,
                            value: `${secondsToTime(npc.timings[npc.levels.next].due)}`,
                            inline: true,
                        },
                        {
                            name: `At`,
                            value: `${timeConverter(npc.timings[npc.levels.next].ts)}`,
                            inline: true,
                        },
                    ],
                    // image: {
                    //     url: 'https://i.imgur.com/wSTFkRM.png',
                    // },
                    timestamp: new Date(),
                    footer: {
                        text: `Data updated ${timeConverter(npc.update)}\n`,
                        //icon_url: 'https://i.imgur.com/wSTFkRM.png',
                    },
                };
                
                channelLoot.send('<@&701052827031699496>', { embed: msgEmbed });
            }
            console.log('Loot test...');
        }
        else{
            console.warn('Loot', 'No guild found...');
        }
    }

    function timeConverter(UNIX_timestamp){
        if(UNIX_timestamp){
            var a = new Date(UNIX_timestamp * 1000);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getUTCFullYear();
            var month = months[a.getUTCMonth()];
            var date = `0${a.getUTCDate()}`.slice(-2);
            var hour = `0${a.getUTCHours()}`.slice(-2);
            var min = `0${a.getUTCMinutes()}`.slice(-2);
            var sec = `0${a.getUTCSeconds()}`.slice(-2);
            var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
            return time;
        }
        else{
            return 'undefined';
        }
    }

    function secondsToTime(secs)
    {
        secs = Math.round(secs);
        var hours = Math.floor(secs / (60 * 60));

        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);

        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);

        var obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };


        return `${obj.h}h ${obj.m}m ${obj.s}s`;
    }
        

    function webRequest(url, callback){
        https.get(url, function(res){
            var body = '';
        
            res.on('data', function(chunk){
                body += chunk;
            });
        
            res.on('end', function(){
                try {
                    //var obj = JSON.parse(body);
                    callback(body);
                } catch (error) {
                    console.log(error);
                }
            });
        }).on('error', function(error){
            console.log(error);
        });
    }

}
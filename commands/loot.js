const https = require('https');

exports.run = (client, message, args) => {


    const npcImage = {
        "4" : "https://profileimages.torn.com/4d661456-1798-ad32-4.png",
        "7" : "https://profileimages.torn.com/4d661456-17e6-65aa-7.png",
        "10" : "https://profileimages.torn.com/50bdc916-3fc2-d678-10.png",
        "15" : "https://profileimages.torn.com/4d661456-17bc-2098-15.png",
        "19" : "https://profileimages.torn.com/4d661456-205b-349e-19.png"
    }

    let url = `https://yata.alwaysdata.net/loot/timings/`;

    https.get(url, function(res){
        let body = '';
    
        res.on('data', function(chunk){
            body += chunk;
        });
    
        res.on('end', function(){
            parseData(body);
        });
    }).on('error', function(error){
        console.log(error);
    });

    function parseData(json){
        let data = JSON.parse(json);

        const entries = Object.entries(data);
        for (const [id, npc] of entries) {
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
                    text: `Data updated ${timeConverter(npc.update)}`,
                    //icon_url: 'https://i.imgur.com/wSTFkRM.png',
                },
            };
            
            message.channel.send({ embed: msgEmbed });
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
}

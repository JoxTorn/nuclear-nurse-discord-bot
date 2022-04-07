const https = require('https');

exports.run = (client, message, args) => {

    if(message.channel.name !== 'contracts'){
        return message.reply(`Can't execute this command on this channel`);
    }

    const type = (args[0] && args[0] == 'up') ? 'UNPAID' : 'ACTIVE'
    const data = type == 'UNPAID' ? JSON.stringify({paid: 0}) : JSON.stringify({only_completed: 1})

    const options = {
        hostname: 'www.nukefamily.org',
        port: 443,
        path: '/dev/revivecontractlist.php?api=cfeed49473e34cc6a5ef1257c957b55a',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

    const req = https.request(options, res => {
        var body = '';

        res.on('data', chunk => {
            body += chunk;
        })

        res.on('end', function(){
            createMessage(body);
        });
    })

    req.on('error', error => {
        console.error(error)
    })

    req.write(data)
    req.end()
    
    
    function createMessage(json){

        //console.log('data',json);
        let data = JSON.parse(json);
        var timestamp = Math.round((new Date()).getTime() / 1000);
        data.sort((a,b) => a.start - b.start);
        
        let msgEmbed = {
            color: 0x00ff55,
            title: `Revive contract list [${type}]`,
            description: `This is list of ${type.toLowerCase()} contracts`,
            fields: [],
            timestamp: new Date()
        };

        let logText = '';
        let space = ' ';
        let dot = ' ';
        let header = ``;
        /*
        msgEmbed.fields.push({
            name: '\u200b',
            value: header,
            inline: false
        });
        */
        data.forEach(element => {
            let boldTime = true;
            if(element.end && timestamp > element.end){ boldTime = false; }
            logText += `${logText.length ? '\n' : ''}[${element.description}](https://www.nukefamily.org/dev/revivecontract.php?uuid=${element.uuid}) @ ${boldTime ? '' : '**'}${timeConverter(element.start)}${boldTime ? '' : '**'}\n${element.note}\n${element.status ? element.status : ''}` + (element.chance ? ` < ${element.chance}%` : '') + (element.limit ? ` limit: ${element.limit}` : '');
            //console.log(logText);
            if(logText.length > 800){
                //Add to field
                msgEmbed.fields.push({
                    name: '\u200b',
                    value: logText,
                    inline: false
                });
                //reset value
                logText = '';
            }
        });


       msgEmbed.fields.push({
            name: '\u200b',
            value: logText,
            inline: false
        });

        message.channel.send({ embed: msgEmbed });

        
        /*
        data.forEach(element => {
            msg += `${msg.length ? '\n' : ''}[${element.description}](https://www.nukefamily.org/dev/revivecontract.php) @ **${timeConverter(element.start)}**\n${element.status ? element.status : ''}` +  (element.chance ? `< ${element.chance}%` : '');

            if(msg.length > 1500){
                message.channel.send({ embed: msgEmbed });
                msg = '';
            }
        });

        message.reply({ embed: msgEmbed });
        */
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
}
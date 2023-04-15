const https = require('https');
const Discord = require("discord.js");

exports.run = (client, message, args) => {

    if(message.channel.name !== client.config.reward_system.shop_channel){
        if(message.channel.name !== client.config.reward_system.admin_channel){
            return message.reply(`Can't execute this command on this channel`);
        }
    }

    var url = `https://www.nukefamily.org/dev/CoinShop.json`;

    https.get(url, function(res){
        var body = '';
    
        res.on('data', function(chunk){
            body += chunk;
        });
    
        res.on('end', function(){
            createMessage(body);
        });
    }).on('error', function(error){
        console.log(error);
    });


    function createMessage(json){
        let data = JSON.parse(json);

        let msgEmbed = {
            color: 0x00ff55,
            title: 'Nuclear Rads Shop',
            description: `Welcome to **Nuke Rads Shop** where you can exchange your Rads with items, to buy an item use the command: **!Buy itemID**, Example: **!buy 90**`,
            fields: [],
            timestamp: new Date()
        };

        let logText = '';
        let space = ' ';
        let dot = ' ';
        let header = `[${('ID' + space.repeat(2)).slice(0,2)}  ${('Item' + space.repeat(35)).slice(0,35)} ${(space.repeat(8) + 'Price').slice(-8)}]\n`;

        msgEmbed.fields.push({
            name: '\u200b',
            value: '```css\n'+ header + '```',
            inline: false
        });

        data.forEach(element => {
            logText += ` #${(element.id + space.repeat(2)).slice(0,2)} ${(element.item + space + dot.repeat(35)).slice(0,35)} ${(dot.repeat(9) + space + element.price).slice(-9)} \n`;
            //console.log(logText);
            if(logText.length > 900){
                //Add to field
                msgEmbed.fields.push({
                    name: '\u200b',
                    value: '```css\n' /*+ header*/ + logText + '```',
                    inline: false
                });
                //reset value
                logText = '';
            }
        });


       msgEmbed.fields.push({
            name: '\u200b',
            value: '```css\n' /*+ header*/ + logText + '```',
            inline: false
        });

        message.channel.send({ embed: msgEmbed });
    }


/*
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
*/


}

const https = require('https');

exports.run = (client, message, args) => {

    if(message.channel.name !== client.config.reward_system.shop_channel){
        if(message.channel.name !== client.config.reward_system.admin_channel){
            return message.reply(`Can't execute this command on this channel`);
        }
    }

    if(message.channel.name !== client.config.reward_system.admin_channel && args && args[0]){
        return //message.reply(`Can't execute this command on this channel with additional arguments`);
    }

    var member = message.member;
    var guild = message.guild;
    var tornId = args[0] || getIdFormNickname(member.nickname || member.user.username);


    console.log('TornID:', tornId);

    const data = JSON.stringify({
        Action: 'wallet',
        playerID: tornId
    })

    const options = {
        hostname: 'www.nukefamily.org',
        port: 443,
        path: '/dev/coins.php',
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
        let data = JSON.parse(json);

        let msgEmbed = {
            color: 0x0099ff,
            title: `Rads Wallet ${data.player}`,
            description: `
**${parseFloat(data.quantity)}** rad${Math.abs(data.quantity) > 1 ? 's' : ''} total\n
**${parseFloat(data.reserved)}** rad${Math.abs(data.reserved) > 1 ? 's' : ''} reserved\n
**${parseFloat(data.quantity) - parseFloat(data.reserved)}** rad${Math.abs(parseFloat(data.quantity) - parseFloat(data.reserved)) > 1 ? 's' : ''} available
                `,
            fields: [],
            timestamp: new Date()
        };

        let logText = '';

        data.logs.forEach(element => {
            logText += `**${Math.abs(parseFloat(element.quantity))}** rad${Math.abs(data.quantity) > 1 ? 's' : ''} ${element.quantity >= 0 ? 'earned' : 'spent'} ${timeConverter(element.timestamp)} ${element.reason_description} \n`;
        });


        msgEmbed.fields.push({
            name: 'Logs',
            value: logText.length ? logText : 'There are no recent logs',
            inline: false
        });


        let orderText = '';

        data.orders.forEach(element => {
            orderText += `Order **${parseInt(element.id)}** at ${timeConverter(element.timestamp)} for **${element.itme_name}** at cost ${parseFloat(element.price)}\n`;
        });


        msgEmbed.fields.push({
            name: 'Pending Orders',
            value: orderText.length ? orderText : 'There are no pending orders',
            inline: false
        });

        message.reply({ embed: msgEmbed });
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
    
    //Function for finding id from nickname name[id]
    function getIdFormNickname(name){
        var re = /.+\[(\d+)\]/gm;
        var parsed = name.split(re);
        return parsed[1];
    }
}

const https = require('https');

exports.run = (client, message, args) => {

    if(message.channel.name !== client.config.reward_system.channel){
        return message.reply(`Can't execute this command on this channel`);
    }

    if(!message.member.roles.some(role => role.name === client.config.reward_system.admin_role)){
        return message.reply(`This command is only for adminstrators`);
    }

    const data = JSON.stringify({
        Action: 'orders'
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
            color: 0x55ff00,
            title: 'Orders',
            description: `List of all pending orders`,
            fields: [],
            timestamp: new Date()
        };

        let orderText = '';

        data.forEach(element => {
            orderText += `[${timeConverter(element.timestamp)}] Order **${parseInt(element.id)}**  for **${element.itme_name}** by **${element.discord_name}** at cost ${parseInt(element.price)}\n`;
        });


        msgEmbed.fields.push({
            name: 'Orders',
            value: orderText,
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

}

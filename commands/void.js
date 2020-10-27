const https = require('https');

exports.run = async (client, message, args) => {

    var member = await message.guild.fetchMember(message.author.id, false);

    if(message.channel.name !== client.config.reward_system.admin_channel){
        return message.reply(`Can't execute this command on this channel`);
    }

    if(!member.roles.some(role => role.id === client.config.reward_system.admin_role)){
        return message.reply(`This command is only for adminstrators`);
    }
    
    var orderID = Number(args[0]);

    if(!Number.isInteger(orderID)){
        message.reply(`Order number must be integer, supplied ${args[0]}`);
        return;
    }

    const data = JSON.stringify({
        Action: 'void',
        orderID: orderID,
        discordName: member.nickname || member.user.username
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

        //console.log(json);

        let data = JSON.parse(json);
        let mgs = '';

        switch(Number(data.rezult)){
            case 1:
                msg = '**COMPLETED**';
                break;
            case -1:
                msg = `**ERROR**`;;
                break;
            default:
                msg = '**UNKNOWN**';
        }

        let msgEmbed = {
            color: 0x00ff55,
            title: 'Void Report',
            description: `Order **${orderID}**\n${msg}`,
            fields: [],
            timestamp: new Date()
        };

        message.reply({ embed: msgEmbed });
    }

}

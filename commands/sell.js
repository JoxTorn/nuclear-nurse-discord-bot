const https = require('https');

exports.run = (client, message, args) => {

    if(message.channel.name !== client.config.reward_system.channel){
        return message.reply(`Can't execute this command on this channel`);
    }

    if(!message.member.roles.some(role => role.name === client.config.reward_system.admin_role)){
        return message.reply(`This command is only for adminstrators`);
    }
    
    var member = message.member;
    var guild = message.guild;
    var tornId = getIdFormNickname(member.nickname || member.user.username);
    var orderID = Number(args[0]);

    if(!Number.isInteger(orderID)){
        message.reply(`Order number must be integer, supplied ${args[0]}`);
        return;
    }

    const data = JSON.stringify({
        Action: 'sell',
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
                msg = `**ERROR**: Insufficient funds`;;
                break;
            case -9:
                msg = `**ERROR**: Order does not exist\'s or it\'s already completed`;
                break;
            default:
                msg = '**UNKNOWN**';
        }

        let msgEmbed = {
            color: 0x00ff55,
            title: 'Sell Report',
            description: `Order **${orderID}**\n${msg}`,
            fields: [],
            timestamp: new Date()
        };

        message.reply({ embed: msgEmbed });
    }

    //Function for finding id from nickname name[id]
    function getIdFormNickname(name){
        var re = /.+\[(\d+)\]/gm;
        var parsed = name.split(re);
        return parsed[1];
    }

}

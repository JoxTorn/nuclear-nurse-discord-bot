const https = require('https');

exports.run = (client, message, args) => {

    var member = message.guild.members.cache.find(memebr => memebr.id == message.author.id);

    if(message.channel.name !== client.config.reward_system.admin_channel){
        return message.reply(`Can't execute this command on this channel`);
    }

    if(!member.roles.cache.find(role => role.id == client.config.reward_system.admin_role)){
        return message.reply(`This command is only for adminstrators`);
    }

    if(args.length >= 2 && Number.isInteger(Number(args[0])) && !Number.isNaN(Number(args[1]))){

        let arr = [];
        let msg = client.config.reward_system.buyebb_message;
        let price = client.config.reward_system.buyebb_price;
        arr.push({player_id: Number(args[0]), quantity: Number(args[1]) * price, description: msg});
        sendData(arr);
    }
    else{
        message.reply('insufficent arguments or worong format, need PlayerID [number], Rads [number], Reason [text]');
    }

    function sendData(arr){
        const data = JSON.stringify({
            Action: 'reward',
            discordName: member.nickname || member.user.username,
            reward: arr
        })

        console.log('data to send', data);
    
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
    }

    function createMessage(json){

        console.log(json);

        let data = JSON.parse(json);
        let mgs = '';
        console.log(data);

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
            title: 'Reward Report',
            description: `${msg}`,
            fields: [],
            timestamp: new Date()
        };

        message.reply({ embed: msgEmbed });
    }

}

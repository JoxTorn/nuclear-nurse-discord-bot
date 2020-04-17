const https = require('https');

exports.run = (client, message, args) => {

    if(message.channel.name !== client.config.reward_system.shop_channel){
        if(message.channel.name !== client.config.reward_system.admin_channel){
            return message.reply(`Can't execute this command on this channel`);
        }
    }

    var member = message.member;
    var guild = message.guild;
    var tornId = getIdFormNickname(member.nickname || member.user.username);

    const data = JSON.stringify({
        Action: 'buy',
        playerID: tornId,
        discordID: member.id,
        discordName: member.nickname || member.user.username,
        shopID: args[0].replace('#','')
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
            processMessage(body);
        });
    })

    req.on('error', error => {
        console.error(error)
    })

    req.write(data)
    req.end()

    function processMessage(json){
        let data = JSON.parse(json);
        //console.log(json);
        message.reply(data.message);
        adminChannel = guild.channels.find(channel => channel.name == client.config.reward_system.admin_channel);
        if(adminChannel){
            adminChannel.send(`${message.author} bought from shop. ${data.message}`);
        }
    }

    //Function for finding id from nickname name[id]
    function getIdFormNickname(name){
        var re = /.+\[(\d+)\]/gm;
        var parsed = name.split(re);
        return parsed[1];
    }
}
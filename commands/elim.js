const https = require('https');

exports.run = (client, message, args) => {
    
    var url = `https://www.nukefamily.org/dev/competition.json`;

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
            title: data.competition.competition,
            description: ``,
            fields: [],
            timestamp: new Date()
        };

        let logText = '';
        let space = ' ';

        data.competition.teams.forEach(element => {
            logText += ` #${(element.position + space.repeat(3)).slice(0,3)} ${(element.name + space.repeat(20)).slice(0,35)} ${(space.repeat(8) + element.lives).slice(-8)} ${(space.repeat(8) + element.participants).slice(-8)} ${(space.repeat(8) + element.score).slice(-8)} ${(space.repeat(8) + element.wins).slice(-8)} ${(space.repeat(6) + element.losses).slice(-8)} \n`;
            //console.log(logText);
        });


       msgEmbed.fields.push({
            name: '\u200b',
            value: '```css\n' + `[${('Pos' + space.repeat(3)).slice(0,3)}  ${('Team' + space.repeat(20)).slice(0,20)} ${(space.repeat(8) + 'Lives').slice(-8)} ${(space.repeat(8) + 'Players').slice(-8)} ${(space.repeat(8) + 'Score').slice(-8)} ${(space.repeat(8) + 'Wins').slice(-8)} ${(space.repeat(8) + 'Loses').slice(-8)}]\n` + logText + '```',
            inline: true
        });

        message.reply({ embed: msgEmbed });
    }

}

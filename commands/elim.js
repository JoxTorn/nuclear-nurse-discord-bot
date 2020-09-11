const https = require('https');
const { start } = require('repl');

exports.run = (client, message, args) => {

    var url = `https://www.nukefamily.org/dev/competition.php`;

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
            //description: ``,
            fields: [],
            timestamp: new Date()
        };

        let logText = '';
        let space = ' ';

        data.competition.teams.forEach(element => {
            logText += ` #${(element.position + space.repeat(3)).slice(0,3)} ${(element.name + space.repeat(17)).slice(0,17)} ${(space.repeat(5) + element.lives).slice(-5)} ${(space.repeat(5) + element.score).slice(-5)} ${(space.repeat(8) + element.participants).slice(-8)} ${(space.repeat(6) + element.wins).slice(-6)} ${(space.repeat(6) + element.losses).slice(-6)} \n`;
            //console.log(logText);
        });


       msgEmbed.fields.push({
            name: '\u200b',
            value: '```css\n' + `[${('Pos' + space.repeat(3)).slice(0,3)}  ${('Team' + space.repeat(17)).slice(0,17)} ${(space.repeat(5) + 'Lives').slice(-5)} ${(space.repeat(5) + 'Score').slice(-5)} ${(space.repeat(8) + 'Players').slice(-8)} ${(space.repeat(6) + 'Wins').slice(-6)} ${(space.repeat(6) + 'Loses').slice(-6)}]\n` + logText + '```',
            inline: true
        });

        message.channel.send({ embed: msgEmbed });
    }

}

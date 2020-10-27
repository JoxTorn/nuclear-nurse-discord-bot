const https = require('https');
const fs = require('fs');
const path = require('path');

exports.run = (client, message, args) => {

    if(message.channel.name !== client.config.gym.channel){
        return message.reply(`Can't execute this command on this channel`);
    }
    
    var query = ``;

    if(args.length == 0){
        message.reply('Insufficent arguments need PlayerID [number] or Faction Acronym [string][2]');
    }
    else{
        if(Number.isInteger(Number(args[0]))){
            query = `member=${args[0]}`;
        }
        else{
            query = `faction=${args[0]}`;
        }

        sendData();
    }

    function sendData(){
        const data = '';

        const options = {
            hostname: 'www.nukefamily.org',
            port: 443,
            path: `/dev/gymStatsJSON.php?${query}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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

        let gymData = JSON.parse(json);
        
        //Preparing data for export
        var csv = "";


        for(var i=0; i<gymData.length; i++){

            if(i == 0){
                var j = 0;
                for(var dataheader in gymData[i]){
                    csv += (j==0 ? "" : ",") + dataheader;
                    j++;
                }
                csv += "\n";
            }

            var x = 0;
            for(var data in gymData[i]){
                csv += (x == 0 ? "" : ",") + (typeof gymData[i][data] === 'string' ? "\"" : "") + gymData[i][data] + (typeof gymData[i][data] === 'string' ? "\"" : "");
                x++;
            }
            csv += "\n";

        }


        //EXPORTING DATA

        //Setting file name
        var exportName = `Gym-${query}-` + Date.now() + '.csv';

        var exportPath = path.join(client.config.exportPath, exportName);

        //Writing file to disk
        fs.writeFile(exportPath, csv, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!", exportName);

            //Sending file to discord
            message.reply(`Gym data for ${query}`, {file: exportName}).then(
                (msg) => {
                    //Deleting file
                    fs.unlink(exportName, (err) => {
                        if(err) {
                            return console.log(err);
                        }
                        console.log("The file was deleted!", exportName);
                    });
                }
            );
        });
    }

}

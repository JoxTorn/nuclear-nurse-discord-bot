const https = require('https');

exports.verify = (client, discordID, callback) => {

    var url = `https://api.torn.com/user/${discordID}?selections=discord&key=${client.config.torn_api_key}`

    https.get(url, function(res){
        var body = '';
    
        res.on('data', function(chunk){
            body += chunk;
        });
    
        res.on('end', function(){
            try {
                var obj = JSON.parse(body);
        
                if(obj.error){
                    console.log(obj.error);
                    callback("Cant verify user. Error accessing Torn API. Please try again later");
                }
                else{
                    if(obj.discord && obj.discord.userID){
                        callback(obj.discord.userID)
                    }
                    else{
                        callback("Cant verify user. Discord account is not verified by Torn. Please join Torn official Discord to verify account there first.");
                    }
                }
            } catch (error) {
                console.log(error);
                callback("Cant verify user. Error accessing Torn API. Please try again later");
            }
    
        });
    }).on('error', function(error){
        console.log(error);
        callback("Cant verify user. Error accessing Torn API. Please try again later");
    });
}
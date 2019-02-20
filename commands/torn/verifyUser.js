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
                    callback("Account couldn't be verified. Error accessing Torn API [1]. Please try again later.");
                }
                else{
                    if(obj.discord && obj.discord.userID !== '' && obj.discord.discordID !== ''){
                        callback(obj.discord.userID)
                    }
                    else{
                        callback(`I can't verify the account. This Discord account isn't verified by Torn.`);
                    }
                }
            } catch (error) {
                console.log(error);
                callback("Account couldn't be verified. Error accessing Torn API [2]. Please try again later.");
            }
    
        });
    }).on('error', function(error){
        console.log(error);
        callback("Account couldn't be verified. Error accessing Torn API [3]. Please try again later.");
    });
}

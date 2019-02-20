const https = require('https');

exports.getUserName = (client, tornID, callback) => {

    var url = `https://api.torn.com/user/${tornID}?selections=profile&key=${client.config.torn_api_key}`

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
                    callback(false, "Cant verify user. Error accessing Torn API [4]. Please try again later");
                }
                else{
                    if(obj.player_id && obj.name && obj.faction && obj.faction.faction_id && obj.faction.faction_name){
                        /*
                        if(obj.faction && obj.faction.faction_id && client.config.factions.indexOf(obj.faction.faction_id) != -1){
                            callback(true, `${obj.name} [${obj.player_id}]`);
                        }
                        else{
                            callback(false, "Cant verify user. Do you belong to this family?");
                        }
                        */
                       callback(true, `${obj.name} [${obj.player_id}]`, obj.faction.faction_id, obj.faction.faction_name);
                    }
                    else{
                        callback(false, "Cant verify user. Cant get your data. Please try again later");
                    }
                }
            } catch (error) {
                console.log(error);
                callback(false, "Cant verify user. Error accessing Torn API [5]. Please try again later");
            }
    
        });
    }).on('error', function(error){
        console.log(error);
        callback(false, "Cant verify user. Error accessing Torn API [6]. Please try again later");
    });
}

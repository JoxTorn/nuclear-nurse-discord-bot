const https = require('https');

exports.getMembers = (client, callback) => {

    var url = `https://www.nukefamily.org/dev/FactionMembers.json`

    https.get(url, function(res){
        var body = '';
    
        res.on('data', function(chunk){
            body += chunk;
        });
    
        res.on('end', function(){
            try {
                var obj = JSON.parse(body);
                callback(obj);
            } catch (error) {
                console.log(error);
                callback("Error loading data");
            }
        });
    }).on('error', function(error){
        console.log(error);
        callback("Error loading data");
    });
}

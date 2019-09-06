const https = require('https');

exports.run = (client, message, args) => {

    if(args[0]){
        var url = `https://www.nukefamily.org/dev/revivecontractdata.php?uuid=${args[0]}`;

        https.get(url, function(res){
            var body = '';
        
            res.on('data', function(chunk){
                body += chunk;

            });
        
            res.on('end', function(){
                try {
                    var obj = JSON.parse(body);

                    
                } catch (error) {
                    console.log(error);
                }
            });
        }).on('error', function(error){
            console.log(error);
        });
    }
    
}
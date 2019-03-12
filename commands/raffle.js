const https = require('https');

exports.run = (client, message, args) => {
    if(args.length == 2 && !isNaN(args[0]) && !isNaN(args[1]) && args[1] > args[0]){
        var randomRequest = {
            "jsonrpc": "2.0",
            "method": "generateIntegers",
            "params": {
                "apiKey": client.config.random_org_api,
                "n": 1,
                "min": args[0],
                "max": args[1],
                "replacement": false
            },
            "id": 0
        }

        var post_data = JSON.stringify(randomRequest);

        //console.log('post_data: ', post_data);

        var options = {
            hostname: 'api.random.org',
            port: 443,
            path: '/json-rpc/2/invoke',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': post_data.length
           }
        };
          
        var req = https.request(options, (res) => {
            var body = '';
        
            res.on('data', function(chunk){
                body += chunk;
            });
        
            res.on('end', function(){
                try {
                    var rng = JSON.parse(body);

                    //console.log(rng)
            
                    if(rng){
                        message.reply(`Random number in range ${args[0]} - ${args[1]} is ${rng.result.random.data[0]}`);
                    }
                    else{
                        message.reply("Error reading data from Random.org [1]. Please try again later.");
                    }
                } catch (error) {
                    console.log(error);
                    message.reply("Error reading data from Random.org [2]. Please try again later.");
                }
        
            });
        });
        
        req.on('error', function(error){
            console.log(error);
            message.reply("Error reading data from Random.org [3]. Please try again later.");
        });
        
        // write data to request body
        req.write(post_data);
        req.end();
    }
    else{
        message.reply('This command ecpect 2 numbers where second number is greather then first');
    }
}
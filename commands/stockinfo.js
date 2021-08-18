/*
const https = require('https');

exports.run = (client, message, args) => {
      
    var shares = "";

    for(arg of args){
        shares += (shares.length > 0 ? "," : "") + arg.toUpperCase();
    }

    var url = `https://www.nukefamily.org/hq/old/StockInfo.php?stocks=${shares}`;

    https.get(url, function(res){
        var body = '';
    
        res.on('data', function(chunk){
            body += chunk;
        });
    
        res.on('end', function(){
    
        });
    }).on('error', function(error){
        console.log(error);
    });
}
*/
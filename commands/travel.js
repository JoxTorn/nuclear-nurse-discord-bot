const https = require('https');

exports.run = (client, message, args) => {

    var url = `https://yata.alwaysdata.net/bazaar/abroad/export/`;

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
            title: 'Travel Report',
            description: `Country, Item, Qty, Report time\n[more info...](https://yata.alwaysdata.net/bazaar/abroad/)`,
            fields: [],
            timestamp: new Date()
        };

        let logText = '';
        let space = ' ';

        data.stocks.sort(function (a, b) {
            var nameA = a.country_name.toUpperCase(); // ignore upper and lowercase
            var nameB = b.country_name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
          })

        data.stocks.forEach(
            element => {
                if(element.abroad_quantity > 0 && (element.item_type == 'Flower' || element.item_type == 'Plushie' || (element.country_name == "South Africa" && element.item_name == 'Xanax')) && element.item_name != "Dozen White Roses") {

                    let flag = '';

                    switch(element.country_name){
                        case "UAE": 
                            flag = `:flag_ae:`;
                            break;
                        case "Japan": 
                            flag = `:flag_jp:`;
                            break; 
                        case "China": 
                            flag = `:flag_cn:`;

                            break; 
                        case "Switzerland": 
                            flag = `:flag_ch:`;
                            break; 
                        case "South Africa": 
                            flag = `:flag_za:`;
                            break; 
                        case "Cayman Islands": 
                            flag = `:flag_ky:`;
                            break; 
                        case "Argentina": 
                            flag = `:flag_ar:`;
                            break;
                        case "United Kingdom": 
                            flag = `:flag_gb:`;
                            break; 
                        case "Canada": 
                            flag = `:flag_ca:`;
                            break; 
                        case "Hawaii": 
                            flag = `:flag_lr:`;
                            break; 
                        case "Mexico": 
                            flag = `:flag_mx:`;
                            break; 
                    }

                    logText += `${flag}  ${element.item_name} **${element.abroad_quantity}** ${Math.floor(((Date.now() / 1000) - element.timestamp)/60)}min \n`;
                }
            }
        );

        /*
        data.forEach(element => {
            logText += ` #${(element.id + space.repeat(2)).slice(0,2)} ${(element.item + space.repeat(35)).slice(0,35)} ${(space.repeat(6) + element.price).slice(-6)} \n`;
            //console.log(logText);
        });

        */
       msgEmbed.fields.push({
            name: '\u200b',
            value: logText,
            inline: true
        });

        

        //console.log(data);

        message.reply({ embed: msgEmbed });
    }

    function timeConverter(UNIX_timestamp){
        if(UNIX_timestamp){
            var a = new Date(UNIX_timestamp * 1000);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getUTCFullYear();
            var month = months[a.getUTCMonth()];
            var date = `0${a.getUTCDate()}`.slice(-2);
            var hour = `0${a.getUTCHours()}`.slice(-2);
            var min = `0${a.getUTCMinutes()}`.slice(-2);
            var sec = `0${a.getUTCSeconds()}`.slice(-2);
            var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
            return time;
        }
        else{
            return 'undefined';
        }
    }

}

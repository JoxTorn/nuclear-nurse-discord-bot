const https = require('https');

exports.run = async (client, message, args) => {

    var member = await message.guild.fetchMember(message.author.id, false);

    if(message.channel.name !== client.config.reward_system.admin_channel){
        return message.reply(`Can't execute this command on this channel`);
    }

    if(!member.roles.some(role => role.id === client.config.reward_system.admin_role)){
        return message.reply(`This command is only for adminstrators`);
    }

    var guild = message.guild;

    if(message.attachments.first()){
        getFileContent(message.attachments.first().url);
    }
    else{
        message.reply('No file in attachment');
    }

    function sendData(arr){
        const data = JSON.stringify({
            Action: 'reward',
            discordName: member.nickname || member.user.username,
            reward: arr
        })

        console.log('data to send', data);
    
        const options = {
            hostname: 'www.nukefamily.org',
            port: 443,
            path: '/dev/coins.php',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
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

        console.log(json);

        let data = JSON.parse(json);
        let mgs = '';
        console.log(data);

        switch(Number(data.rezult)){
            case 1:
                msg = '**COMPLETED**';
                break;
            case -1:
                msg = `**ERROR**`;;
                break;
            default:
                msg = '**UNKNOWN**';
        }

        let msgEmbed = {
            color: 0x00ff55,
            title: 'Reward Report',
            description: `${msg}`,
            fields: [],
            timestamp: new Date()
        };

        message.reply({ embed: msgEmbed });
    }


    function getFileContent(url){
        https.get(url, function(res){
            var body = '';
        
            res.on('data', function(chunk){
                body += chunk;

            });
        
            res.on('end', function(){
                try {
                    processFile(body);
                } catch (error) {
                    console.log(error);
                }
            });
        }).on('error', function(error){
            console.log(error);
        });
    }

    function processFile(file){
        let data = CSVToArray(file);
        let arr = [];
        //console.log(data);
        if(data.length > 0){
            data.forEach(row => {
                //console.log(row, row.length, Number.isInteger(Number(row[0])), Number.isInteger(Number(row[1])));
                if(row.length == 3 && Number.isInteger(Number(row[0])) && !Number.isNaN(Number(row[1]))){
                    arr.push({player_id: Number(row[0]), quantity: Number(row[1]), description: row[2]});
                }
            });

            //console.log(arr);
        }

        sendData(arr);
    }

    // This will parse a delimited string into an array of
	// arrays. The default delimiter is the comma, but this
	// can be overriden in the second argument.
	function CSVToArray( strData, strDelimiter ){
		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		strDelimiter = (strDelimiter || ",");

		// Create a regular expression to parse the CSV values.
		var objPattern = new RegExp(
			(
				// Delimiters.
				"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

				// Quoted fields.
				"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

				// Standard fields.
				"([^\"\\" + strDelimiter + "\\r\\n]*))"
			),
			"gi"
			);

		// Create an array to hold our data. Give the array
		// a default empty first row.
		var arrData = [[]];

		// Create an array to hold our individual pattern
		// matching groups.
		var arrMatches = null;

		// Keep looping over the regular expression matches
		// until we can no longer find a match.
		while (arrMatches = objPattern.exec( strData )){

			// Get the delimiter that was found.
			var strMatchedDelimiter = arrMatches[ 1 ];

			// Check to see if the given delimiter has a length
			// (is not the start of string) and if it matches
			// field delimiter. If id does not, then we know
			// that this delimiter is a row delimiter.
			if (
				strMatchedDelimiter.length &&
				(strMatchedDelimiter != strDelimiter)
				){

				// Since we have reached a new row of data,
				// add an empty row to our data array.
				arrData.push( [] );

			}

			// Now that we have our delimiter out of the way,
			// let's check to see which kind of value we
			// captured (quoted or unquoted).
			if (arrMatches[ 2 ]){

				// We found a quoted value. When we capture
				// this value, unescape any double quotes.
				var strMatchedValue = arrMatches[ 2 ].replace(
					new RegExp( "\"\"", "g" ),
					"\""
					);

			} else {

				// We found a non-quoted value.
				var strMatchedValue = arrMatches[ 3 ];

			}

			// Now that we have our value string, let's add
			// it to the data array.
			arrData[ arrData.length - 1 ].push( strMatchedValue );
		}

		// Return the parsed data.
		return( arrData );
	}

}

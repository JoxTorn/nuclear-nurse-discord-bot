const https = require('https');

exports.run = (client) => {
    
    
    var interval = 1000 /*miliseconds*/ * 6 /*seconds*/;

    var job = setInterval(checkTerritories, interval);

    function checkTerritories(){
        webRequest(`https://www.nukefamily.org/dev/territoryInfo.php`, parseTerritoryData);
    }

    function parseTerritoryData(data){
        var guild = client.guilds.cache.find(guild => {
            return guild.id == '307223431924023296'
        });
        if(guild){
            var channelTerritories = guild.channels.cache.filter(channel => { return channel.name == 'territories'}).first();
            var channelRackets = guild.channels.cache.filter(channel => { return channel.name == 'rackets'}).first();

            //console.log(channelTerritories)

            data.territories.forEach(element => {
                if(element.newFaction == 0){
                    let msgEmbed = {
                        color: 0x000000,
                        description: `**[${element.oldFactionName}](https://www.torn.com/factions.php?step=profile&ID=${element.oldFaction})** abandoned **[${element.territory}](https://www.torn.com/city.php#terrName=${element.territory})** in sector **${element.sector} ${element.position}**`,
                        timestamp: new Date()
                    };
    
                    channelTerritories.send({ embed: msgEmbed });
                }
                else{
                    let msgEmbed = {
                        color: 0x000000,
                        description: `**[${element.newFactionName}](https://www.torn.com/factions.php?step=profile&ID=${element.newFaction})** have claimed **[${element.territory}](https://www.torn.com/city.php#terrName=${element.territory})** in sector **${element.sector} ${element.position}** ${element.oldFaction == 0 ? '' : 'from **[' + element.oldFactionName + '](https://www.torn.com/factions.php?step=profile&ID=' + element.oldFaction + ')**'}`,
                        timestamp: new Date()
                    };
    
                    channelTerritories.send({ embed: msgEmbed });
                }
            });
            
            data.rackets.forEach(element => {
                let msgEmbed = {
                    color: 0xff99ff,
                    title: `${element.event} Racket`,
                    description: `**${element.name}** on territory [${element.territory}](https://www.torn.com/city.php#terrName=${element.territory})`,
                    fields: [],
                    timestamp: new Date(),
                };

                if(element.event == 'Changed'){

                    //Level changed
                    if(element.level != element.level_old){
                        msgEmbed.title = 'Change in Level'
                        msgEmbed.description = `**${element.name_old}** at [${element.territory}](https://www.torn.com/city.php#terrName=${element.territory}) changed to level **${element.level}**`
                    }

                    //Reward change
                    if(element.reward == element.reward_old){
                        msgEmbed.fields.push(
                            {
                                name: 'Reward',
                                value: element.reward
                            }
                        );
                    }
                    else{
                        msgEmbed.fields.push(
                            {
                                name: 'Old Reward',
                                value: element.reward_old,
                                inline: true
                            }
                        );
                        msgEmbed.fields.push(
                            {
                                name: 'New Reward',
                                value: element.reward,
                                inline: true
                            }
                        );
                    }

                    //Faction change
                    if(element.factionName == element.factionName_old){
                        msgEmbed.fields.push(
                            {
                                name: 'Faction',
                                value: `[${element.factionName}](https://www.torn.com/factions.php?step=profile&ID=${element.faction})`,
                            }
                        );
                    }
                    else{
                        msgEmbed.fields.push(
                            {
                                name: 'Old Faction',
                                value: (element.faction_old == 0 ? element.factionName_old : `[${element.factionName_old}](https://www.torn.com/factions.php?step=profile&ID=${element.faction_old})`),
                                inline: true,
                            }
                        );
                        msgEmbed.fields.push(
                            {
                                name: 'New Faction',
                                value: (element.faction == 0 ? element.factionName : `[${element.factionName}](https://www.torn.com/factions.php?step=profile&ID=${element.faction})`),
                                inline: true,
                            }
                        );
                    }
                }
                else{

                    if(element.event == 'New'){
                        msgEmbed.description = `**${element.name}** has spawned at [${element.territory}](https://www.torn.com/city.php#terrName=${element.territory})`
                    }

                    if(element.event == 'Removed'){
                        msgEmbed.description = `**${element.name}** at [${element.territory}](https://www.torn.com/city.php#terrName=${element.territory}) has gone`
                    }

                    msgEmbed.fields.push(
                        {
                            name: 'Reward',
                            value: element.reward
                        }
                    );
                    msgEmbed.fields.push(
                        {
                            name: 'Faction',
                            value: `[${element.factionName}](https://www.torn.com/factions.php?step=profile&ID=${element.faction})`
                        }
                    );
                }
                //channelRackets.send(JSON.stringify(element));
                channelRackets.send({ embed: msgEmbed });
            });
            console.log('Territory and Racket test...');
        }
        else{
            console.warn('territoryTracker', 'No guild found...');
        }
    }

    function webRequest(url, callback){
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
                }
            });
        }).on('error', function(error){
            console.log(error);
        });
    }

}
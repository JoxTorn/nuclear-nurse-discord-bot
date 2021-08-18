exports.run = (client, message, args) => {

    let verification = require(`./torn/verifyUser.js`);
    let userData = require(`./torn/getUserName.js`)

    var member = message.guild.members.cache.find(memebr => memebr.id == message.author.id);

    if(message.channel.name == 'general'){
        return message.reply(`Can't execute this command on this channel`).catch(console.error);;
    }

    //Setting default member to be verified to member that sent message
    var membersToVerify = member;

    //If in message there is mention verification will be done for mentioned member
    if(message.mentions.users.first()){
        verifyMember(message.guild.members.cache.find(memebr => memebr.id == message.mentions.users.first().id));
    }
    else{
       verifyMember(membersToVerify);
    }

    function verifyMember(membersToVerify){
        if(membersToVerify){
            //Remove all from member for verification
            membersToVerify.roles.remove(membersToVerify.roles.cache).then(
                
                //calling verification procedure
                verification.verify(client, membersToVerify.id, function(tornID){
    
                    //checking did i get response with tornID of discord members
                    if(isNaN(tornID)){
                        message.author.send(`${membersToVerify}, ` + tornID).catch(console.error);
                        
                        if(tornID.indexOf("This Discord account isn't verified by Torn") !== -1){
                            //membersToVerify.send(`Your account couldn't be verified because your Discord account isn't validated by Torn. Please validate your account following these steps:\n1 - Click this link to validate your account in Torn: https://www.torn.com/discord\n2 - Verify your Discord account in our server by running again the command !verify in the channel #door\n`).catch(console.error);
                            //message.reply('I have sent a DM with instructions to validate your account').catch(console.error);
                            message.reply(`Your Discord account isn't linked with Torn account yet, please follow the steps:\n1 - Join Torn Official Discord server: https://www.torn.com/discord\n2 - Verify your account in Torn Discord server by running: **!verify** and click on the link provided by Torn's bot in a private message \n3 - On Central Hospital, verify your account in #door channel by running the command: **!verify**`).catch(console.error);
                        }
                    }
                    else{
                        //If i got torn id, continuing with all member data check buy calling user data procedure
                        userData.getUserName(client, tornID, function(verified, name, factionID, factionName){
                            if(verified){
                                try {

                                    //NEW CODE ---------------------------------------------------------

                                    if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return message.channel.send('I don\'t have permission to change your nickname!');
                                    //Set neickname
                                    membersToVerify.setNickname(name).then(m => {
                                        ///Roles to add
                                        var roles = [];

                                        //Find verified role and give it to member
                                        roles.push(message.guild.roles.cache.find(role => role.name === client.config.verified_role));

                                        //check is member belong to predefined factons and give roles set in config
                                        if(client.config.factions[factionID]){
                                            for(roleToAssign of client.config.factions[factionID]){
                                                var role = message.guild.roles.cache.find(role => role.name === roleToAssign);
                                                if(role){
                                                    roles.push(role);
                                                }
                                            }
                                        }

                                        //Check is role exists for user faction
                                        var roleFaction = message.guild.roles.cache.find(role => role.name === factionName);
                                        if(roleFaction){
                                            console.log('Role for faction exists');
                                            roles.push(roleFaction);
                                            m.roles.add(roles).then(m => {
                                                message.channel.send(`${m}, you are now verified and you have permissions based on your current faction.`).catch(console.error);
                                            }).catch(error => {
                                                if(error.code == 50013){
                                                    message.channel.send(`I don't have permission to modify roles for ${membersToVerify}`).catch(console.error);
                                                }
                                                else{
                                                    console.log(error);
                                                    console.log('Roles to add:', roles);
                                                }
                                            });
                                        }
                                        else{
                                            console.log('Role for faction does not exist');
                                            m.roles.add(roles).then(m => {
                                                message.channel.send(`${m}, you are now verified and you have permissions based on your current faction.`).catch(console.error);
                                            }).catch(error => {
                                                if(error.code == 50013){
                                                    message.channel.send(`I don't have permission to modify roles for ${membersToVerify}`).catch(console.error);
                                                }
                                                else{
                                                    console.log(error);
                                                    console.log('Roles to add:', roles);
                                                }
                                            });
                                        }
                                    }).catch(error => {
                                        if(error.code == 50013){
                                            message.channel.send(`I don't have permission to modify nickname for ${membersToVerify}`).catch(console.error);
                                        }
                                        else{
                                            console.log(error);
                                        }
                                    });

                                } catch (error) {
                                    console.log(error);
                                    callback(false, "Cant verify user. Error while setting user nickname/roles");
                                }
                            }
                            else{
                                message.reply(`${name}`).catch(console.error);
                            }
                        })
                    }
                    
                })
            ).catch(console.error); //Removes all roles
        }
        else{
            console.log('No member to verify... wtf...', membersToVerify);
        }
    }
}

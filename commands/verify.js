exports.run = (client, message, args) => {

    let verification = require(`./torn/verifyUser.js`);
    let userData = require(`./torn/getUserName.js`)

    //Setting default member to be verified to member that sent message
    var membersToVerify = message.member;

    //If in message there is mention verification will be done for mentioned member
    if(message.mentions.users.first()){
        membersToVerify = message.guild.members.get(message.mentions.users.first().id);
    }
    
    if(message.channel.name == 'general'){
        return message.reply(`Can't execute this command on this channel`).catch(console.error);;
    }

    if(membersToVerify){
        //Remove all from member for verification
        membersToVerify.removeRoles(membersToVerify.roles).then(
            
            //calling verification procedure
            verification.verify(client, membersToVerify.id, function(tornID){

                //checking did i get response with tornID of discord members
                if(isNaN(tornID)){
                    message.author.send(tornID).catch(console.error);

                    if(tornID.indexOf("This Discord account isn't verified by Torn") !== -1){
                        membersToVerify.send(`Your account couldn't be verified because your Discord account isn't validated by Torn. Please validate your account following these steps:\n1 - Click this link to validate your account in Torn: https://www.torn.com/discord\n2 - Verify your Discord account in our server by running again the command !verify in the channel #door\n`).catch(console.error);
                        message.reply('I have sent a DM with instructions to validate your account').catch(console.error);
                    }
                }
                else{
                    //If i got torn id, continuing with all member data check buy calling user data procedure
                    userData.getUserName(client, tornID, function(verified, name, factionID, factionName){
                        if(verified){
                            try {
                                //Check is bot have permission to change nickname
                                if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return message.channel.send('I don\'t have permission to change your nickname!');
                                //Set neickname
                                membersToVerify.setNickname(name).catch(console.error);;

                                //Find verified role and give it to member
                                var roleVerified = message.guild.roles.find(role => role.name === client.config.verified_role);
                                membersToVerify.addRole(roleVerified).catch(console.error);;

                                //Check is role exists for user faction
                                var roleFaction = message.guild.roles.find(role => role.name === factionName);
                                if(roleFaction){
                                    membersToVerify.addRole(roleFaction).catch(console.error);;
                                }
                                else{
                                    // Create a new role with data
                                    message.guild.createRole({
                                        name: factionName
                                    })
                                        .then(newRole => {
                                            membersToVerify.addRole(newRole).catch(console.error);;
                                        })
                                        .catch(console.error)
                                }

                                //check is member belong to predefined factons and give roles set in config
                                if(client.config.factions[factionID]){
                                    for(roleToAssign of client.config.factions[factionID]){
                                        var role = message.guild.roles.find(role => role.name === roleToAssign);
                                        if(role){
                                            membersToVerify.addRole(role).catch(console.error);;
                                        }
                                    }
                                }
                                //Send welcome message to verified member
                                message.channel.send(`Welcome ${membersToVerify}`).catch(console.error);
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
        console.log('No member to verify... wtf...', membersToVerify, message.mentions.users.first().id);
    }

}

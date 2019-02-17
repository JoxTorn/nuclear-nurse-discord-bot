exports.run = (client, message, args) => {

    let verification = require(`./torn/verifyUser.js`);
    let userData = require(`./torn/getUserName.js`)

    //Setting default member to be verified to member that sent message
    var membersToVerify = message.member;

    //If in message there is mention verification will be done for mentioned member
    if(message.mentions.users.first()){
        membersToVerify = message.guild.members.get(message.mentions.users.first().id);
    }

    //Remove all from member for verification
    membersToVerify.removeRoles(membersToVerify.roles).then(
        
        //calling verification procedure
        verification.verify(client, membersToVerify.id, function(tornID){

            //checking did i get response with tornID of discord members
            if(isNaN(tornID)){
                message.author.send(tornID).catch(console.error);
            }
            else{
                //If i got torn id, continuing with all member data check buy calling user data procedure
                userData.getUserName(client, tornID, function(verified, name, factionID, factionName){
                    if(verified){
                        try {
                            //Check is bot have permission to change nickname
                            if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return message.channel.send('I don\'t have permission to change your nickname!');
                            //Set neickname
                            membersToVerify.setNickname(name);

                            //Find verified role and give it to member
                            var roleVerified = message.guild.roles.find(role => role.name === client.config.verified_role);
                            membersToVerify.addRole(roleVerified);

                            //Check is role exists for user faction
                            var roleFaction = message.guild.roles.find(role => role.name === factionName);
                            if(roleFaction){
                                membersToVerify.addRole(roleFaction);
                            }
                            else{
                                // Create a new role with data
                                message.guild.createRole({
                                    name: factionName
                                })
                                    .then(newRole => {
                                        membersToVerify.addRole(newRole);
                                    })
                                    .catch(console.error)
                            }

                            //check is member belong to predefined factons and give roles set in config
                            if(client.config.factions[factionID]){
                                for(roleToAssign of client.config.factions[factionID]){
                                    var role = message.guild.roles.find(role => role.name === roleToAssign);
                                    if(role){
                                        membersToVerify.addRole(role);
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
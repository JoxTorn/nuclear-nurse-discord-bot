const https = require('https');

exports.run = (client, message, args) => {

    return
    
    var guild = message.guild;

    var factions = ['Nuclear Armageddon', 'Nuclear Blast', 'Nuclear Clinic', 'Nuclear Dimension', 'Nuclear Development', 'Nuclear Engineering', 'Nuclear Fusion', 'Emergency Room', 'Torn Medical', 'Evolution']
    var spacialRoles = ['Nukers', 'Reviver'];
    let fm = require(`./torn/getFactionMembers.js`);

    fm.getMembers(client, function(factionMembers){
        if(typeof factionMembers == "object"){
            message.guild.members.fetch().then((members) => {
                members.forEach((member) => {
                    if(!member.user.bot){
                        let name = member.displayName;
                        let verified = member.roles.cache.find(role => role.name === client.config.verified_role);
                        let roles = member.roles.cache.filter(role => spacialRoles.includes(role.name) || factions.includes(role.name));
                        let rolesToRemove = roles; //all roles should be rmoved (this will clear later)
                        let rolesToAdd = [];

                        if(verified){
                            let uid = getIdFormNickname(name);
                            if(uid){
                                let factionMember = factionMembers.find(fm => fm.memberID == uid);
                                
                                if(factionMember){
                                    if(getNameFormNickname(name) != factionMember.name){
                                        member.setNickname(`${factionMember.name} [${factionMember.memberID}]`).catch(console.error);
                                    }

                                    //set all roles that memebr shoudl have
                                    rolesToAdd = guild.roles.cache.filter(role => client.config.factions[factionMember.factionID].includes(role.name) || factionMember.factionName == role.name);
                                    //remove those that shoud have form those that need to be removed
                                    rolesToRemove = rolesToRemove.filter(role => !rolesToAdd.has(role.id));

                                    if(rolesToAdd.size > 0 && rolesToRemove.size > 0){ //if it's not this way it will not work
                                        member.roles.add(rolesToAdd).then(r => member.roles.remove(rolesToRemove));
                                    }
                                    else{
                                        if(rolesToAdd.size > 0){
                                            member.roles.add(rolesToAdd);
                                        }

                                        if(rolesToRemove.size > 0){
                                            member.roles.remove(rolesToRemove);
                                        }
                                    }
                                }
                                else{
                                    //console.log(`${name} is not faction member`);
                                    //Remove all filtered roles
                                    member.roles.remove(rolesToRemove);
                                }
                            }
                            else{
                                //console.log(`${name} is without id`);
                                //Remove all filtered roles inculding verification role
                                let verifiedRole = guild.roles.cache.find(role => role.name === client.config.verified_role);
                                rolesToRemove.set(verifiedRole.id, verifiedRole);
                                member.roles.remove(rolesToRemove);
                            }
                        }
                        else{
                            //console.log(`${name} is not verified - remove all faciton roles`);
                            //Remove all filtered roles
                            member.roles.remove(rolesToRemove);
                        }
                        
                    }
                })
            }).catch(console.error);
        }
        else{
            message.reply("Error happend while loadeing data from server");
        }
    })

    //Function for finding id from nickname name [id]
    function getIdFormNickname(name){
        var re = /.+\[(\d+)\]/gm;
        var parsed = name.split(re);
        return parsed[1];
    }

    //Function for finding name from nickname name [id]
    function getNameFormNickname(name){
        var re = /(\S+) ?\[(\d+)\]/gm;
        var parsed = name.split(re);
        return parsed[1];
    }
}
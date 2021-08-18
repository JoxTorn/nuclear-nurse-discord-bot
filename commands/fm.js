/*
var fs = require('fs');
var path = require('path');

exports.run = async (client, message, args) => {
    //message.channel.send("pong").catch(console.error);

    var member = await message.guild.fetchMember(message.author.id, false);

    if(!member.roles.find(role => role.name === client.config.admin_role)){
        return message.reply("You don\'t have permission to execute this command");
    }

    let factionMembers = require(`./torn/getFactionMembers.js`);
    factionMembers.getMembers(client, function(familyMembers){
        if(typeof familyMembers == "object"){
            
            // Fetch guild members
            member.guild.fetchMembers().then(guild => {

                let discordMembers = {};

                //Going thrue all members of guild
                for(member of guild.members){
                    let id = getIdFormNickname(member[1].nickname || member[1].displayName);

                    if(id){
                        discordMembers[id] = {
                            id: id,
                            member: member[1].user.tag,
                            nickname: (member[1].nickname || member[1].displayName)
                        }
                    }
                }

                var csv = "";
                var headers = "id,name,member,faction";

                for(factionMember of familyMembers){
                    csv += "\n" + factionMember.memberID + "," + factionMember.name + "," + (discordMembers[factionMember.memberID] ? discordMembers[factionMember.memberID].member : 'NOT ON DISCORD') + "," + factionMember.factionName;
                }

                //EXPORTING DATA
                
                //Combining headers and data
                csv = headers + csv;

                //Setting file name
                var exportName = 'factionMembersList-' + Date.now() + '.csv';

                var exportPath = path.join(client.config.exportPath, exportName);

                //Writing file to disk
                fs.writeFile(exportPath, csv, function(err) {
                    if(err) {
                        return console.log(err);
                    }

                    console.log("The file was saved!", exportName);

                    //Sending file to discord
                    message.reply("Here is list of all members", {file: exportName}).then(
                        (msg) => {
                            //Deleting file
                            fs.unlink(exportName, (err) => {
                                if(err) {
                                    return console.log(err);
                                }
                                console.log("The file was deleted!", exportName);
                            });
                        }
                    );
                });
                
            }).catch(console.error);

        }
        else{
            message.reply("Error happend while loadeing data from server");
        }
    })

    //Function for finding id from nickname name[id]
    function getIdFormNickname(name){
        var re = /.+\[(\d+)\]/gm;
        var parsed = name.split(re);
        return parsed[1];
    }
}
*/
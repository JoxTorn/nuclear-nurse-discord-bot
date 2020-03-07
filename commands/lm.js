var fs = require('fs');
var path = require('path');

exports.run = (client, message, args) => {
    //message.channel.send("pong").catch(console.error);

    if(!message.member.roles.find(role => role.name === client.config.admin_role)){
        return message.reply("You don\'t have permission to execute this command");
    }

    let factionMembers = require(`./torn/getFactionMembers.js`);
    factionMembers.getMembers(client, function(familyMembers){
        if(typeof familyMembers == "object"){
            
            // Fetch guild members
            message.member.guild.fetchMembers().then(guild => {
                
                var maxRoles = 0;

                var csv = "";
                var headers = "member,nickname,faction";

                //Going thrue all members of guild
                for(member of guild.members){
                    csv += "\n" + member[1].user.tag + "," + (member[1].nickname || member[1].displayName);

                    let id = getIdFormNickname(member[1].nickname || member[1].displayName);
                    let memberFaction = familyMembers.filter(m => m.memberID == id);

                    csv +=  "," + (memberFaction[0] ? memberFaction[0].factionID : 'NOT MEMBER');

                    var i = 0;
                    //Going over each role of selected member
                    for(role of member[1].roles){
                        csv += "," + role[1].name;
                        i++;
                    }
                    //Checking maximum number of roles
                    if(i > maxRoles){maxRoles = i};
                }

                //creating headers for csv
                for(var i=0; i < maxRoles; i++){
                    headers += ",Role" + i;
                }

                //Combining headers and data
                csv = headers + csv;

                //EXPORTING DATA

                //Setting file name
                var exportName = 'membersList-' + Date.now() + '.csv';

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
/*
var fs = require('fs');
var path = require('path');

exports.run = async (client, message, args) => {
    //message.channel.send("pong").catch(console.error);

    var member = await message.guild.fetchMember(message.author.id, false);

    if(!member.roles.find(role => role.name === client.config.admin_role)){
        return message.reply("You don\'t have permission to execute this command");
    }

    // Fetch guild members
    message.guild.fetchMembers().then(guild => {
        var memberList = [];

        for(var member of guild.members){
            var obj = {};
            obj.member = member[1].user.tag;
            obj.nickname = (member[1].nickname || member[1].displayName);
            for(var role of message.guild.roles){
                obj[role[1].name] = (member[1].roles.get(role[1].id) ? true : false);
            }
            memberList.push(obj);
        }

        //Preparing data for export
        var csv = "";


        for(var i=0; i<memberList.length; i++){
    
            if(i == 0){
                var j = 0;
                for(var dataheader in memberList[i]){
                    csv += (j==0 ? "" : ",") + dataheader;
                    j++;
                }
                csv += "\n";
            }
    
            var x = 0;
            for(var data in memberList[i]){
                csv += (x == 0 ? "" : ",") + (typeof memberList[i][data] === 'string' ? "\"" : "") + memberList[i][data] + (typeof memberList[i][data] === 'string' ? "\"" : "");
                x++;
            }
            csv += "\n";
    
        }


        //EXPORTING DATA

        //Setting file name
        var exportName = 'membersRolesMatrix-' + Date.now() + '.csv';

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
*/
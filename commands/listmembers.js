var fs = require('fs');
var path = require('path');

exports.run = (client, message, args) => {
    //message.channel.send("pong").catch(console.error);

    if(!message.member.roles.find(role => role.name === client.config.admin_role)){
        return message.reply("You don\'t have permission to execute this command");
    }

    var guild = message.member.guild;

    var maxRoles = 0;

    var csv = "";
    var headers = "member";

    //Going thrue all members of guild
    for(member of guild.members){
        csv += "\n" + (member[1].nickname || member[1].displayName);
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
}
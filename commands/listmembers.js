var fs = require('fs');
var path = require('path');

exports.run = (client, message, args) => {
    //message.channel.send("pong").catch(console.error);

    var member = message.guild.members.cache.find(memebr => memebr.id == message.author.id);

    if(!member.roles.cache.find(role => role.name === client.config.admin_role)){
        return message.reply("You don\'t have permission to execute this command");
    }

    // Fetch guild members
    message.guild.members.fetch().then((members) => {
            var maxRoles = 0;

            var csv = "";
            var headers = "member,nickname";

            members.forEach((member) => {
                csv += "\n" + member.user.tag + "," + (member.nickname || member.displayName);
                var i = 0;
                //Going over each role of selected member
                member.roles.cache.forEach((role) => {
                    csv += "," + role.name;
                    i++;
                })
                
                //Checking maximum number of roles
                if(i > maxRoles){maxRoles = i};
            })

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
            message.reply("Here is list of all members", {files: [exportName] }).then(
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
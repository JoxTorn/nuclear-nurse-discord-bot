var fs = require('fs');
var path = require('path');

exports.run = (client, message, args) => {

    if(!message.member.roles.find(role => role.name === client.config.admin_role)){
        return message.reply("You don\'t have permission to execute this command");
    }

    var roles = {};

    for(let role of message.member.guild.roles){
        roles[role[1].name] = 0;
    }

    // Fetch guild members
    message.member.guild.fetchMembers().then(guild => {
        for(let member of guild.members){
            for(let role of member[1].roles){
                console.log(member[1].user.username, role[1].name);
                roles[role[1].name]++;
            }
        }
    
        sendMessage();
    }).catch(console.error);


    function sendMessage(){
        let rolesArray = [];
        
        for(let prop in roles){
            rolesArray.push({
                name: prop,
                number: roles[prop],
            })
        }

        rolesArray.sort((a,b) => {
            if(b.number - a.number == 0){
                return (a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1) ;
            }
            else{
                return b.number - a.number;
            }
        });

        let msg = '```\n';

        let roleNum = 0;
        let roleNumNoMemeners = 0;
        rolesArray.forEach(element => {
            msg += `${element.name} [${element.number}]\n`;
            if(msg.length > 1000){
                msg += '```';
                message.channel.send(msg);
                msg = '```\n';
            }
            roleNum++;
            if(element.number == 0){
                roleNumNoMemeners++
            }
        });

        msg += '```\n';
        message.channel.send(msg);
        message.channel.send('```' + `Total number of roles: ${roleNum}\nUnassigned roles: ${roleNumNoMemeners}` + '```');
    }
}
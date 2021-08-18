var fs = require('fs');
var path = require('path');

exports.run = (client, message, args) => {

    var member = message.guild.members.cache.find(memebr => memebr.id == message.author.id);

    if(!member.roles.cache.find(role => role.name === client.config.admin_role)){
        return message.reply("You don\'t have permission to execute this command");
    }

    var roles = {};

    message.guild.roles.cache.forEach(role => roles[role.name] = {number : 0, id : role.id})

    // Fetch guild members
    message.guild.members.fetch().then((members) => {

        members.forEach((member) => {
            //Going over each role of selected member
            member.roles.cache.forEach((role) => {
                roles[role.name].number++;
            })
        })
    
        sendMessage();
    }).catch(console.error);


    function sendMessage(){
        let rolesArray = [];
        
        for(let prop in roles){
            rolesArray.push({
                name: prop,
                id: roles[prop].id,
                number: roles[prop].number
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
            msg += `${element.name} <@&${element.id}> [${element.number}]\n`;
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
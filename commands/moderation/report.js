const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = {
    name:"report",
    category:"moderation",
    description:"reports a member",
    usage:"<mention | id>",
    run: async (client, message, args) => {
    
        let rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!rMember) {
            message.reply("User not found.");
            message.delete();
            return;
        }

        if(rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot){
            message.reply("Cannot report that member.");
            message.delete();
            return;
        }
            


        if(!args[1]){
            message.reply("Please provide a reason for the report.");
            message.delete();
            return;
        }
            
        const reportsChannel = message.guild.channels.cache.find(channel => channel.name === "reports");

        if(!reportsChannel)
        {
            return message.reply("\'#reports\' channel not found.");
            message.delete();
            return;
        }
            
        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setDescription(stripIndents`**> Member:** ${rMember} (${rMember.id})
                **> Reported by:** ${message.member} (${rMember.id})
                **> Reported in:** ${message.channel}
                **> Reason:** ${args.slice(1).join(" ")}`)
            .setTitle('Report Recieved!')
            .setURL(message.url)
            
        message.channel.send("Report sent!");
    
        message.delete();

        return reportsChannel.send(embed);
    }

}
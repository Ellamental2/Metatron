const { getMember, formatDate } = require("../../functions.js");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "whois",
    aliases: ["userinfo", "user", "who"],
    category: "info",
    description: "Returns user information.",
    usage: "[username | id, | mention]",
    run: async (client, message, args) => {
        const member = getMember(message, args.join(" "));

        // Member Variables
        const joined = formatDate(member.joined);
        const roles = member.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => r)
            .join(", ") ||"none";

        // User Variables
        const created = formatDate(member.user.created);

        const embed = new MessageEmbed()
            .setFooter(member.displayName, member.user.AvatarURL)
            .setThumbnail(member.user.AvatarURL)
            .setColor(member.displayHexColor)
            
            .addField('Member Information', stripIndents`**> Display name:** ${member.displayName}
            **> Joined at: ** ${joined}
            ** Roles:** ${roles}`,true)

            .addField('User Information', stripIndents`**>ID:** ${member.user.id}
            **>Username:** ${member.user.username}
            **>Discord Tag:** ${member.user.tag}
            **>Created at:** ${created}`, true)
        
        if(member.user.presence.game)
            embed.addField('Currently playing', `test ${member.user.presence.game.name}`);
        else
            console.log('no activity')

        message.channel.send(embed);
    }
}
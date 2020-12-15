const { MessageEmbed, Message } = require('discord.js');
const { stripIndents } = require('common-tags');
const { promptMessage } = require('../../functions');

module.exports = {
    name: "kick",
    category: "moderation",
    description: "Kicks the member",
    usage: "<id | mention>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.cache.find(c => c.name === "admin-log") || message.channel;

        //no author permissions
        if(!message.member.hasPermission("KICK_MEMBERS")){
            return message.reply("⚠️ You do not have permission to kick members from this server. Please use the report command to report this member.")
                .then(m => {m.delete({timeout: 5000})}).then(message.delete({timeout: 1000}));
        }

        //no bot permissions
        if(!message.guild.me.hasPermission("KICK_MEMBERS")){
            return message.reply("⚠️ I do not have permission to kick members from this server. Please contact an admin.")
                .then(m => {m.delete({timeout: 5000})}).then(message.delete({timeout: 1000}));
        }

        //No mention
        if (!args[0]) {
            return message.reply("Please provide a user to kick.")
                .then(m => {m.delete({timeout: 5000})}).then(message.delete({timeout: 1000}));
        }

        //No mention
        if (!args[1]) {
            return message.reply("Please provide a reason to kick.")
                .then(m => {m.delete({timeout: 5000})}).then(message.delete({timeout: 1000}));
        }

        

        const toKick = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        //no member found
        if (!toKick){
            message.reply("couldn't find that member, try again!").then(m => {m.delete({timeout:5000})}).then(message.delete({timeout: 1000}));
            return;
        }

        //stop kicking yourself
        if(message.author.id === toKick.id){
            return message.reply("stop kicking yourself!").then(m => m.delete({timeout:5000}));
        }

        //kickable
        if(!toKick.kickable){
            return message.reply("I can't kick that person due to the role hierarchy").then(m => m.delete({timeout:5000}));
        }

        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(toKick.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**>> Kicked member:** ${toKick} (${toKick.id})
                **> Kicked by:** ${message.author} (${message.author.id})
                **> Reason:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor("This verification becomes invalid after 30s")
            .setDescription(`Do you want to kick ${toKick}?`)

        message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ['👍','👎']);

            if (emoji === '👍'){
                msg.delete();

                toKick.kick(args.slice(1).join(" "))
                    .catch(err => {
                        if(err) return message.channel.send("error kicking user.").then(m => {
                            m.delete({timeout:5000});
                        })
                    })

                logChannel.send(embed);
            } else if (emoji === '👎'){
                msg.delete();

                message.reply('User cancelled.').then(m => {m.delete({timeout: 5000})});
            } else {
                msg.delete();
            }
        });

        message.delete({timeout: 1000})
    }
}
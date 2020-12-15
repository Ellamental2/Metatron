const { MessageEmbed, Message } = require('discord.js');
const { stripIndents } = require('common-tags');
const { promptMessage } = require('../../functions');

module.exports = {
    name: "ban",
    category: "moderation",
    description: "Bans the member",
    usage: "<id | mention>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.cache.find(c => c.name === "admin-log") || message.channel;

        //no author permissions
        if(!message.member.hasPermission("BAN_MEMBERS")){
            return message.reply("⚠️ You do not have permission to ban members from this server. Please use the report command to report this member.")
                .then(m => {m.delete({timeout: 5000})}).then(message.delete({timeout: 1000}));
        }

        //no bot permissions
        if(!message.guild.me.hasPermission("BAN_MEMBERS")){
            return message.reply("⚠️ I do not have permission to ban members from this server. Please contact an admin.")
                .then(m => {m.delete({timeout: 5000})}).then(message.delete({timeout: 1000}));
        }

        //No mention
        if (!args[0]) {
            return message.reply("Please provide a user to ban.")
                .then(m => {m.delete({timeout: 5000})}).then(message.delete({timeout: 1000}));
        }

        //No mention
        if (!args[1]) {
            return message.reply("Please provide a reason to ban.")
                .then(m => {m.delete({timeout: 5000})}).then(message.delete({timeout: 1000}));
        }

        

        const toBan = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        //no member found
        if (!toBan){
            return message.reply("couldn't find that member, try again!").then(m => {m.delete({timeout:5000})}).then(message.delete({timeout: 1000}));
        }

        //stop kicking yourself
        if(message.author.id === toBan.id){
            return message.reply("You cannot ban yourself!").then(m => m.delete({timeout:5000})).then(message.delete({timeout: 1000}));
        }

        //kickable
        if(!toBan.kickable){
            return message.reply("I can't ban that person due to the role hierarchy").then(m => m.delete({timeout:5000})).then(message.delete({timeout: 1000}));
        }

        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**>> Banned member:** ${toBan} (${toBan.id})
                **> Banned by:** ${message.author} (${message.author.id})
                **> Reason:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor("This verification becomes invalid after 30s")
            .setDescription(`Do you want to ban ${toBan}?`)

        message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ['👍','👎']);

            if (emoji === '👍'){
                msg.delete();

                toBan.ban(args.slice(1).join(" "))
                    .catch(err => {
                        if(err) return message.channel.send("error banning user.").then(m => {
                            m.delete({timeout:5000}).then(message.delete({timeout:1000}));
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
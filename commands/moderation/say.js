module.exports = {
    name:"say",
    aliases:["bc","broadcast"],
    category:"moderation",
    description:"says your input via the bot",
    usage:"<input>",
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        if (!args.length) return (await message.reply ("Nothing to say?")).attachments(m => m.delete(5000));

        const roleColor = message.guild.me.displayHexColor;

        if(args[0].toLowerCase() === "embed") {
            const embed = new MessageEmbed()
                .setColor(roleColor)
                .setDescription(args.slice(1).join(" "));

            message.channel.send(embed);
        } else {
            message.channel.send(args.join(" "));
        }
    }
}
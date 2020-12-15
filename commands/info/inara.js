const { MessageEmbed } = require ("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "inara",
    aliases: ["i"],
    category: "info",
    description: "returns information on the Aisling's Angels Inara Squadron",
    usage: "[CMDR Name]",
    run: async (client, message, args) => {
        const embed = new MessageEmbed()
            .setTitle('Aisling\'s Angels')
            .setURL('https://inara.cz/squadron/170/')
            .setImage('https://inara.cz/data/wings/logo/170.png')

        message.channel.send(embed).then(m => m.delete({timeout:60000})).then(message.delete({timeout:1000}));
    }
}
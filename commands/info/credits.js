const { MessageEmbed } = require ("discord.js");
const { stripIndents } = require("common-tags");
const fetch = require ("node-fetch");

module.exports = {
    name: "credits",
    aliases: ["creds, credz"],
    category: "info",
    description: "Returns the number of credits owned by a given commander",
    usage: `<CMDR Name>`,
    run: async (client, message, args) => {
        console.log('fetch command');
        fetch('https://www.edsm.net/api-status-v1/elite-server', args.join(" ")).then(response => {
            message.channel.send(`CMDR ${args.join(" ")} has a current balance of ${response.credits.balance} as of ${response.credits.date}`)
        });
        
    }
}
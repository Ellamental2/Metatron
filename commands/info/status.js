const { MessageEmbed } = require ("discord.js");
const { stripIndents } = require("common-tags");
const { httpGet } = require("../../functions.js");

module.exports = {
    name: "status",
    aliases: ["lastupdate"],
    category: "info",
    description: "Returns the time and date that the EDSM server was last updated",
    run: async (client, message, args) => {
        // var responseText = "";
        // responseText = httpGet('https://www.edsm.net/api-status-v1/elite-server');
        // responseText = responseText.substring(1,responseText.length - 1);
        // responseText = responseText.replace(/"/g, '');
        // var params = responseText.split(',');
        // var lastUpdate = params[0].split(":");
        // var type = params[1].split(":");
        // var responsemessage = params[2].split(":");
        // var status = params[3].split(":");
        
        let response = await httpGet('https://www.edsm.net/api-status-v1/elite-server');
        console.log(response.data);

        var embed = new MessageEmbed()
            .setTitle('Status of EDSM')
            .addField('Status:', response.data.message)
            .addField('Data last updated', response.data.lastUpdate)
            .setFooter('this command is powered by the EDSM API')

        try {
        message.channel.send(embed).then(m=>delete({timeout:20000})).then(message.delete({timeout:20000}));
        } catch (e) {
            console.log(e);
        }
    }
}

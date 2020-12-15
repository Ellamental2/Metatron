const { MessageEmbed } = require ("discord.js");
const { stripIndents } = require("common-tags");
const { httpGet } = require("../../functions.js");

module.exports = {
    name: "system",
    aliases: ["sys","bodies"],
    category: "info",
    description: "Returns information about celestial bodies in a system",
    usage: "<system name>",
    run: async (client, message, args) => {
        var system = "";
        if (!args[0]) {
          system = {system: 'Chona'}
        } else {
          system = {system: args.join(" ")}
        }

        var system ={system: args.join(" ")}
        var params = {
            systemName:`${system}`
        }
        console.log('...');
        await httpGet('https://www.edsm.net/api-system-v1/bodies', params).then(response => {
            console.log(response);
        });
        
    }
}
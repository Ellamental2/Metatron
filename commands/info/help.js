const { MessageEmbed } = require ("discord.js");
const { stripIndents } = require("common-tags");
const prefix = process.env.PREFIX;

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "info",
    description: "Returns all commands, or one specific command info",
    usage: "[command | alias]",
    run: async (client, message, args) => {
        if (args[0]) {
            return getCommand(client, message, args[0]);
        } else {
            getAll(client, message);
        }
    }
}

function getAll(client, message) {
    const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setFooter("Thankyou for using Metatron - by CMDR Ellam")
        .setTitle("Metatron - Available Commands")

    const commands = (category) => {
        return client.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `- \'${prefix}${cmd.name}\'`)
            .join("\n");
    }

    const info = client.categories
        .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
        .reduce((string, category) => string + "\n" + category);
        
    try {
        return message.channel.send(embed.setDescription(info)).then(m => m.delete({timeout:20000})).then(message.delete({timeout:1000}));
    } catch (e) {
        console.log(e)
    }
}

function getCommand(client, message, input) {
    const embed = new MessageEmbed()
        .setFooter("Thankyou for using Metatron - by CMDR Ellam")
    
    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));
    let info = `No information found for the command **${input.toLowerCase}**`;
    
    if(!cmd){
        try{
            return message.channel.send(embed.setColor("RED").setDescription(info)).then(m => m.delete({timeout:5000})).then(message.delete({timeout:1000}));
        } catch (e) {
        console.log(e);
    }
    }        
    
    if (cmd.name) info = `**Command name** ${cmd.name}`;
    if (cmd.aliases) info += `\n**Aliases** ${cmd.aliases.map(a=> `\'${a}\'`).join(", ")}`;
    if (cmd.description) info += `\n**Description**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**Usage**: ${cmd.usage}`;
        embed.setFooter(`Syntax: <> = required, [] = optional`);
    }

    try {
        return message.channel.send(embed.setColor("RANDOM").setDescription(info)).then(m => m.delete({timeout:30000})).then(message.delete({timeout:1000}));
    } catch (e) {
        console.log(e);
    }
}
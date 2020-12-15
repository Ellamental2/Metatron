const { Client, MessageEmbed, Collection } = require('discord.js');
const { config } = require('dotenv');
require('custom-env').env();
const fs = require('fs');

const client = new Client({
    disableEveryone: true
});
const prefix = process.env.PREFIX;

console.log(prefix);

client.commands = new Collection();
client.aliases = new Collection();
client.categories =fs.readdirSync("./commands/");

config({
    path: __dirname + "/.env"
});

["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

client.once('ready', () => {
    console.log(`I'm online, my name is ${client.user.username}`);

    client.user.setPresence({
        game: {
            name: `Work in progress. Command prefix = "${prefix}"`,
            type: "WATCHING"
        }
    });
});

client.on('message', async message => {
    if (message.author.bot || !message.guild || !message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if(!cmd.length) return;

    let command = client.commands.get(cmd);
    if(!command) command = client.commands.get(client.aliases.get(cmd));

    if(command)
        command.run(client, message, args);
})

client.login(process.env.TOKEN);
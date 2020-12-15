module.exports = {
    name: "ping",
    category: "info",
    description: "Returns the latency.",
    run: async (client, message, args) => {
        const msg = await message.channel.send(":ping_pong: Pinging...");
        msg.edit(`:ping_pong: Pong\nLatency is ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms`);
    }
}
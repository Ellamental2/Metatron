module.exports = {
    name:"clear",
    category:"moderation",
    description:"clears a number of messages from a channel (max 99)",
    usage:"<number of messages to delete>",
    run: async (client, message, args) => {
        if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.reply('you do not have the appropriate permissions to use this command').then(m=>m.delete({timeout:20000})).then(message.delete({timeout:1000}));
        if(!args[0]) return message.reply('please specify a number of messages to be deleted').then(m=>m.delete({timeout:20000})).then(message.delete({timeout:1000}));
        if(isNaN(args[0]) || parseInt(args[0]) <= 0) return message.reply('please put a number only!').then(m=>m.delete({timeout:20000})).then(message.delete({timeout:1000}));
        if(parseInt(args[0]) > 99) return message.reply('Exceed maximum! you can only delete less than 100 messages at a time').then(m=>m.delete({timeout:20000})).then(message.delete({timeout:1000}))
        let deleteAmount;
        
        deleteAmount = parseInt(args[0]);
        try{            
            message.channel.bulkDelete(deleteAmount + 1, true)
        } catch(error){

        }
        message.channel.send(`**Successfully Deleted ${deleteAmount} Messages.**`).then(m => m.delete({timeout:20000}));
    }
}
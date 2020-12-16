const { MessageEmbed } = require ("discord.js");
const { stripIndents } = require("common-tags");
const { httpGet } = require("../../functions.js");
const apiKey= `&apiid=${process.env.APIKEY}`

module.exports = {
  name: "system",
  aliases: ["sys","bodies"],
  category: "info",
  description: "Returns information about celestial bodies in a system",
  usage: "<system name>",
  run: async (client, message, args) => {
    var theUrl = 'https://www.edsm.net/api-system-v1/bodies?systemName='
    var system = "";
    if (!args[0]) {
      system = "Chona"
    } else {
      system = args.join("%")
    }

    theUrl = `${theUrl}${system}${apiKey}`

    const embed = new MessageEmbed()
      .setTitle(system)
      .setColor("RANDOM")
    
    await httpGet(theUrl).then(response => {
      if(!response.data.bodies){
        embed.addField('System not found, please check spelling','error: system not found')
      } else {
        for(i=0;i<response.data.bodies.length;i++){
          if(response.data.bodies[i].type.toLowerCase() == "star" || response.data.bodies[i].type.toLowerCase() == "planet")
          embed.addField(response.data.bodies[i].name, `${response.data.bodies[i].subType}: Discovered on ${response.data.bodies[i].discovery.date} by CMDR ${response.data.bodies[i].discovery.commander}`)
        }
      }
        
    })
    return message.channel.send(embed)
      .then(m=>m.delete({timeout:60000})).then(message.delete({timeout:1000}));      
  }
}

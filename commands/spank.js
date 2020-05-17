const Discord = require("discord.js")
const superagent = require("superagent")


module.exports.run = async (bot, message, args) => {
    let msg = await message.channel.send("Generating...")

    let {body} = await superagent
    .get(`http://aws.random.cat/meow`)
    //console.log(body.file)
    if(!{body}) return message.channel.send("I broke! Try again.")

        let cEmbed = new Discord.RichEmbed()
        .setColor("random")
        .setAuthor(`TestBot CATS!`, message.guild.iconURL)
        .setImage(body.file)
        .setTimestamp()
        .setFooter(`TEST BOT`, bot.user.displayAvatarURL)

        message.channel.send({embed: cEmbed})

        msg.delete();
}


module.exports.config = {
    name: "spank",
    description: "sends a picture of a cat!",
    usage: "!spank",
    accessableby: "Members",
    aliases: ["catto"]
}

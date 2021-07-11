// Show bot info

const Discord = require('discord.js');

require('../../applesilicon/misc.js')();

exports.run = async (message, args) => {
    let serverembed = new Discord.MessageEmbed()
        .setAuthor(`Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
        .setColor(randomColor())
        .setTitle(`${global.bot.user.tag} - About`)
        .setDescription(`Made by the Unsupported Macs Community.`)
        .setThumbnail(global.bot.user.displayAvatarURL({ format: "png", dynamic: true }))
        .addField(`Version`, global.bot_version, true)
        .addField(`Last updated`, global.bot_updatedate, true)
        .addField(`Servers`, `${global.bot.guilds.cache.size}`, true)
        .setFooter(`Join our support server: https://discord.gg/ktHmcbpMNU`);
    message.channel.send(serverembed);
}

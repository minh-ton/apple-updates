const Discord = require('discord.js');
const ms = require("pretty-ms");

exports.run = (message, args) => {
    let isBotOwner = message.author.id == '589324103463338007';
    if (!isBotOwner) return;
    
    const embed = new Discord.MessageEmbed()
        .setColor("#228B22")
        .setDescription('**Bot Uptime: **' + ms(global.bot.uptime));
    message.channel.send(embed);
}


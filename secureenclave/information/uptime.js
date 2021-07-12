// Show bot uptime

const Discord = require('discord.js');
const ms = require("pretty-ms");

module.exports = {
    name: 'uptime',
    command: 'uptime',
    category: 'Information',
    usage: '`apple!uptime`',
    description: 'Shows the bot uptime.',
    async execute(message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor("#228B22")
            .setDescription('**Bot Uptime: **' + ms(global.bot.uptime));
        message.channel.send(embed);
    },
};

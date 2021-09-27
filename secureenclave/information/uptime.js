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
            .setDescription(`**Bot Uptime: **${ms(global.bot.uptime, { verbose: true })}\n**Bot Age: **${ms(Math.abs(new Date() - new Date('2021/06/09 21:48:09')), { verbose: true })}`);
        message.channel.send({ embeds: [embed] });
    },
};

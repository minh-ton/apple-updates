// Show bot uptime

const Discord = require('discord.js');
const ms = require("pretty-ms");
const { SlashCommandBuilder } = require('@discordjs/builders');

require('../../applesilicon/misc.js')();

module.exports = {
    name: 'uptime',
    command: 'uptime',
    category: 'Information',
    description: 'Shows the bot uptime.',
    data: new SlashCommandBuilder().setName("uptime").setDescription("Shows the bot uptime."),
    async execute(interaction) {
        const embed = new Discord.MessageEmbed()
            .setColor(randomColor())
            .setTitle(`${global.bot.user.tag} - Uptime`)
            .setThumbnail(global.bot.user.displayAvatarURL({ format: "png", dynamic: true }))
            .addField(`Bot Uptime`, ms(global.bot.uptime).toString(), true)
            .addField(`Bot Age`, ms(Math.abs(new Date() - new Date(global.bot.user.createdAt))), true)
            .addField(`Status`, (!global.BOT_STATUS) ? "Starting" : global.BOT_STATUS, true)
            .addField(`Memory Usage`, `${formatBytes(process.memoryUsage.rss())} / ${formatBytes(require('os').totalmem())}`, true)
            .addField(`CPU Usage`, `User: ${((global.CPU_USAGE.user / process.cpuUsage().user) * 100).toFixed(1)}% - System: ${((global.CPU_USAGE.system / process.cpuUsage().system) * 100).toFixed(1)}%`, true)
        await interaction.editReply({ embeds: [embed] });
    },
};

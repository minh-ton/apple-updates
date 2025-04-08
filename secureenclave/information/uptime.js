// Show bot uptime

const { EmbedBuilder } = require('discord.js');
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
        const embed = new EmbedBuilder()
            .setColor(randomColor())
            .setTitle(`${global.bot.user.tag} - Uptime`)
            .setThumbnail(global.bot.user.displayAvatarURL({ format: "png", dynamic: true }))
            .addFields(
                { name: `Bot Uptime`, value: ms(global.bot.uptime).toString(), inline: true },
                { name: `Bot Age`, value: ms(Math.abs(new Date() - new Date(global.bot.user.createdAt))), inline: true },
                { name: `Status`, value: (!global.BOT_STATUS) ? "Starting" : global.BOT_STATUS, inline: true },
                { name: `Memory Usage`, value: `${formatBytes(process.memoryUsage.rss())} / ${formatBytes(require('os').totalmem())}`, inline: true },
                { name: `CPU Usage`, value: `User: ${((global.CPU_USAGE.user / process.cpuUsage().user) * 100).toFixed(1)}% - System: ${((global.CPU_USAGE.system / process.cpuUsage().system) * 100).toFixed(1)}%`, inline: true }
            )
        await interaction.editReply({ embeds: [embed] });
    },
};

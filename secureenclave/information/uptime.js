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
            .setDescription(`**Bot Uptime: **${ms(global.bot.uptime, { verbose: true })}\n**Bot Age: **${ms(Math.abs(new Date() - new Date(global.bot.user.createdAt)), { verbose: true })}`);
        await interaction.editReply({ embeds: [embed] });
    },
};

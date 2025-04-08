// Check bot latency

const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

require('../../applesilicon/misc.js')();

module.exports = {
    name: 'ping',
    command: 'ping',
    category: 'Information',
    description: 'Checks the bot\'s connection.',
    data: new SlashCommandBuilder().setName("ping").setDescription("Check the bot's connection."),
    async execute(interaction) {
        const embed = new EmbedBuilder().setColor(randomColor());
        const time_past = new Date().getTime();
        await interaction.editReply({ embeds: [embed.setDescription("Ping?")] });
        const time_now = new Date().getTime();
        await interaction.editReply({ embeds: [embed.setDescription(`:bell: **Pong!** It took \`${time_now - time_past}ms\` for signals to reach me. My current heartbeat is \`${Math.round(global.bot.ws.ping)}ms\`.`)] });
    },
};

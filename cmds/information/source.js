// View bot's source code

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');

require('../../core/utils/utils.js')();

module.exports = {
    name: 'source',
    command: 'source',
    category: 'Information',
    description: 'Shows the bot\'s source code link.',
    data: new SlashCommandBuilder().setName("source").setDescription("Shows the bot's source code link."),
    async execute(interaction) {
        let repo_data = (await axios.get("https://api.github.com/repos/minh-ton/apple-updates", { 
            headers: { 'Authorization': `token ${process.env.github_token}` } 
        })).data;
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                    .setURL("https://github.com/Minh-Ton/apple-updates")
                    .setLabel('Source Code')
                    .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                    .setURL("https://discord.gg/ktHmcbpMNU")
                    .setLabel('Join support server')
                    .setStyle(ButtonStyle.Link));
        const source_embed = new EmbedBuilder()
            .setColor(randomColor())
            .setTitle(`${global.bot.user.tag} - Source Code`)
            .setURL("https://github.com/Minh-Ton/apple-updates")
            .setThumbnail(global.bot.user.displayAvatarURL({ format: "png", dynamic: true }))
            .setDescription(`Curious about how I work?\nClick [here](https://github.com/Minh-Ton/apple-updates) to view my source code on GitHub!`)
            .addFields(
                { name: "Stargazers", value: repo_data.stargazers_count.toString(), inline: true },
                { name: "Watchers", value: repo_data.subscribers_count.toString(), inline: true },
                { name: "Forks", value: repo_data.forks_count.toString(), inline: true }
            )
            .setFooter({ text: "Join our support server: https://discord.gg/ktHmcbpMNU" });
        await interaction.editReply({ embeds: [source_embed], components: [button] });
    },
};

// Show bot info

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');

require('../../core/utils/utils.js')();

module.exports = {
    name: 'about',
    command: 'about',
    category: 'Information',
    description: 'Displays bot information.',
    data: new SlashCommandBuilder().setName("about").setDescription("Displays bot information."),
    async execute(interaction) {
        let updated = (await axios.get("https://api.github.com/repos/minh-ton/apple-updates", { 
            headers: { 'Authorization': `token ${process.env.github_token}` } 
        })).data.pushed_at;
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                    .setURL("https://discord.gg/ktHmcbpMNU")
                    .setLabel('Join support server')
                    .setStyle(ButtonStyle.Link));
        let about_embed = new EmbedBuilder()
            .setColor(random_color())
            .setTitle(`${global.bot.user.tag} - About`)
            .setThumbnail(global.bot.user.displayAvatarURL({ format: "png", dynamic: true }))
            .addFields(
                { name: `Version`, value: require(path.join(__dirname, '../../package.json')).version, inline: true },
                { name: `Last Updated`, value: `<t:${Math.floor(new Date(updated).getTime() / 1000)}:D>`, inline: true },
                { name: `Servers`, value: `${global.bot.guilds.cache.size}`, inline: true }
            )
            .setFooter({ text: "Join our support server: https://discord.gg/ktHmcbpMNU" });
        await interaction.editReply({ embeds: [about_embed], components: [button] });
    },
}
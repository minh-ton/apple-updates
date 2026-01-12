// Show bot info

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

require('../../core/utils/utils.js')();

module.exports = {
    name: 'invite',
    command: 'invite',
    category: 'Information',
    description: 'Shows the bot invite link.',
    data: new SlashCommandBuilder().setName("invite").setDescription("Shows the bot invite link."),
    async execute(interaction) {
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                    .setURL("https://discord.com/api/oauth2/authorize?client_id=852378577063116820&permissions=8&scope=applications.commands%20bot")
                    .setLabel('Invite Software Updates')
                    .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                    .setURL("https://discord.gg/ktHmcbpMNU")
                    .setLabel('Join support server')
                    .setStyle(ButtonStyle.Link));
        let invite_embed = new EmbedBuilder()
            .setColor(random_color())
            .setThumbnail(global.bot.user.displayAvatarURL({ format: "png", dynamic: true }))
            .setTitle(`${global.bot.user.tag} - Invite`)
            .setURL("https://discord.com/api/oauth2/authorize?client_id=852378577063116820&permissions=8&scope=applications.commands%20bot")
            .setDescription(`Click [here](https://discord.com/api/oauth2/authorize?client_id=852378577063116820&permissions=8&scope=applications.commands%20bot) to invite the bot to your server.\n\nAfter inviting the bot to your server, make sure to run the \`setup\` command to configure it to your liking!`)
            .setFooter({ text: "Join our support server: https://discord.gg/ktHmcbpMNU" });
        await interaction.editReply({ embeds: [invite_embed], components: [button] });
    },
}
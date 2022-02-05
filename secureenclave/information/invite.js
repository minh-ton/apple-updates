// Show bot info

const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

require('../../applesilicon/misc.js')();

module.exports = {
    name: 'invite',
    command: 'invite',
    category: 'Information',
    description: 'Shows the bot invite link.',
    data: new SlashCommandBuilder().setName("invite").setDescription("Shows the bot invite link."),
    async execute(interaction) {
        const button = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                    .setURL("https://discord.com/api/oauth2/authorize?client_id=852378577063116820&permissions=2416438352&scope=applications.commands%20bot")
                    .setLabel('Invite Software Updates')
                    .setStyle('LINK'),
            new Discord.MessageButton()
                    .setURL("https://discord.gg/ktHmcbpMNU")
                    .setLabel('Join support server')
                    .setStyle('LINK'));
        let invite_embed = new Discord.MessageEmbed()
            .setColor(randomColor())
            .setTitle(`${global.bot.user.tag} - Invite`)
            .setURL("https://discord.com/api/oauth2/authorize?client_id=852378577063116820&permissions=2416438352&scope=applications.commands%20bot")
            .setDescription(`Click [here](https://discord.com/api/oauth2/authorize?client_id=852378577063116820&permissions=2416438352&scope=applications.commands%20bot) to invite the bot to your server.`)
            .setFooter({ text: "Join our support server: https://discord.gg/ktHmcbpMNU" });
        await interaction.editReply({ embeds: [invite_embed], components: [button] });
    },
}
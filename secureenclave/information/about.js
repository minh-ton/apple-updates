// Show bot info

const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

require('../../applesilicon/misc.js')();

module.exports = {
    name: 'about',
    command: 'about',
    category: 'Information',
    usage: '`apple!about`',
    description: 'Displays bot information.',
    data: new SlashCommandBuilder().setName("about").setDescription("Displays bot information."),
    async execute(interaction) {
        let serverembed = new Discord.MessageEmbed()
            .setColor(randomColor())
            .setTitle(`${global.bot.user.tag} - About`)
            .setThumbnail(global.bot.user.displayAvatarURL({ format: "png", dynamic: true }))
            .addField(`Version`, global.BOT_VERSION, true)
            .addField(`Last Updated`, global.BOT_UPDATED, true)
            .addField(`Servers`, `${global.bot.guilds.cache.size}`, true)
            .setFooter({ text: "Join our support server: https://discord.gg/ktHmcbpMNU" });
        await interaction.reply({ embeds: [serverembed] });
    },
}
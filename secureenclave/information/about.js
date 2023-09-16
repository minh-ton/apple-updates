// Show bot info

const Discord = require('discord.js');
const path = require('path');
const axios = require('axios');

require('../../applesilicon/misc.js')();

module.exports = {
    name: 'about',
    command: 'about',
    category: 'Information',
    description: 'Displays bot information.',
    data: new Discord.SlashCommandBuilder().setName("about").setDescription("Displays bot information."),
    async execute(interaction) {
        let updated = (await axios.get("https://api.github.com/repos/minh-ton/apple-updates", { 
            headers: { 'Authorization': `token ${process.env.github_token}` } 
        })).data.pushed_at;
        const button = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                    .setURL("https://discord.gg/ktHmcbpMNU")
                    .setLabel('Join support server')
                    .setStyle('LINK'));
        let about_embed = new Discord.MessageEmbed()
            .setColor(randomColor())
            .setTitle(`${global.bot.user.tag} - About`)
            .setThumbnail(global.bot.user.displayAvatarURL({ format: "png", dynamic: true }))
            .addField(`Version`, require(path.join(__dirname, '../../package.json')).version, true)
            .addField(`Last Updated`, `<t:${Math.floor(new Date(updated).getTime() / 1000)}:D>`, true)
            .addField(`Servers`, `${global.bot.guilds.cache.size}`, true)
            .setFooter({ text: "Join our support server: https://discord.gg/ktHmcbpMNU" });
        await interaction.editReply({ embeds: [about_embed], components: [button] });
    },
}
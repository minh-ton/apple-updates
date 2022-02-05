// Show bot info

const Discord = require('discord.js');
const path = require('path');
const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');

require('../../applesilicon/misc.js')();

function formatDate(date) {
    const month = ["January", "February", "March", "April", 
                    "May", "June", "July", "August", "September", 
                    "October", "November", "December"][date.getMonth()];
    const day = (date.getDate()).toString() + ((date.getDate() > 3 && date.getDate() < 21) ? ["st", "nd", "rd", "th"][date.getDate() % 10 - 1] : "th").toString();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}

module.exports = {
    name: 'about',
    command: 'about',
    category: 'Information',
    description: 'Displays bot information.',
    data: new SlashCommandBuilder().setName("about").setDescription("Displays bot information."),
    async execute(interaction) {
        let updated = new Date ((await axios.get("https://api.github.com/repos/minh-ton/apple-updates", { 
            headers: { 'Authorization': `token ${process.env.github_token}` } 
        })).data.pushed_at);
        const button = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                    .setURL("https://discord.gg/ktHmcbpMNU")
                    .setLabel('Join our support server')
                    .setStyle('LINK'));
        let about_embed = new Discord.MessageEmbed()
            .setColor(randomColor())
            .setTitle(`${global.bot.user.tag} - About`)
            .setThumbnail(global.bot.user.displayAvatarURL({ format: "png", dynamic: true }))
            .addField(`Version`, require(path.join(__dirname, '../../package.json')).version, true)
            .addField(`Last Updated`, formatDate(updated), true)
            .addField(`Servers`, `${global.bot.guilds.cache.size}`, true)
            .setFooter({ text: "Join our support server: https://discord.gg/ktHmcbpMNU" });
        await interaction.editReply({ embeds: [about_embed], components: [button] });
    },
}
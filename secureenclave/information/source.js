// View bot's source code

const Discord = require("discord.js");
const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');

require('../../applesilicon/misc.js')();

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
        const button = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                    .setURL("https://github.com/Minh-Ton/apple-updates")
                    .setLabel('Source Code')
                    .setStyle('LINK'),
            new Discord.MessageButton()
                    .setURL("https://discord.gg/ktHmcbpMNU")
                    .setLabel('Join support server')
                    .setStyle('LINK'));
        const source_embed = new Discord.MessageEmbed()
            .setColor(randomColor())
            .setTitle(`${global.bot.user.tag} - Source Code`)
            .setURL("https://github.com/Minh-Ton/apple-updates")
            .setThumbnail(global.bot.user.displayAvatarURL({ format: "png", dynamic: true }))
            .setDescription(`Curious about how I work?\nClick [here](https://github.com/Minh-Ton/apple-updates) to view my source code on GitHub!`)
            .addField("Stargazers", repo_data.stargazers_count.toString(), true)
            .addField("Watchers", repo_data.subscribers_count.toString(), true)
            .addField("Forks", repo_data.forks_count.toString(), true)
            .setFooter({ text: "Join our support server: https://discord.gg/ktHmcbpMNU" });
        await interaction.editReply({ embeds: [source_embed], components: [button] });
    },
};

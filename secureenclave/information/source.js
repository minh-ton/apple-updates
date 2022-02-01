// View bot's source code

const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

require('../../applesilicon/misc.js')();

module.exports = {
    name: 'source',
    command: 'source',
    category: 'Information',
    description: 'Shows the bot\'s source code link.',
    data: new SlashCommandBuilder().setName("source").setDescription("Shows the bot's source code link."),
    async execute(interaction) {
        const embed = new Discord.MessageEmbed()
            .setColor(randomColor())
            .setDescription(`<:src:907994041428377620> Curious about how I work? Check out my source code on GitHub: https://github.com/Minh-Ton/apple-updates`)
            .setImage("https://opengraph.githubassets.com/36d2fab628fde8d4997fd9dc53b7106661678748a67e53d417040cfeb58f6148/Minh-Ton/apple-updates")
            .setFooter({ text: "Join our support server: https://discord.gg/ktHmcbpMNU" });
        await interaction.editReply({ embeds: [embed] });
    },
};

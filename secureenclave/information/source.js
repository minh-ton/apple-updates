// View bot's source code

const Discord = require("discord.js");

require('../../applesilicon/misc.js')();

module.exports = {
    name: 'source',
    command: 'source',
    category: 'Information',
    usage: '`apple!source`',
    description: 'Shows the bot\'s source code link.',
    async execute(message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor(randomColor())
            .setDescription(`<:src:907994041428377620> Curious about how I work? Check out my source code on GitHub! \n> https://github.com/Minh-Ton/apple-updates`)
            .setFooter(`Join our support server: https://discord.gg/ktHmcbpMNU`);
        message.channel.send({ embeds: [embed] });
    },
};

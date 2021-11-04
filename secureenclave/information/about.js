// Show bot info

const Discord = require('discord.js');

require('../../applesilicon/misc.js')();

module.exports = {
    name: 'about',
    command: 'about',
    category: 'Information',
    usage: '`apple!about`',
    description: 'Displays bot information.',
    async execute(message, args) {
        let serverembed = new Discord.MessageEmbed()
            .setColor(randomColor())
            .setTitle(`${global.bot.user.tag} - About`)
            .setDescription(`Made by the Unsupported Macs Community.`)
            .setThumbnail(global.bot.user.displayAvatarURL({ format: "png", dynamic: true }))
            .addField(`Version`, global.BOT_VERSION, true)
            .addField(`Last updated`, global.BOT_UPDATED, true)
            .addField(`Servers`, `${global.bot.guilds.cache.size}`, true)
            .setFooter(`Join our support server: https://discord.gg/ktHmcbpMNU`);
        message.channel.send({ embeds: [serverembed] });
    },
}
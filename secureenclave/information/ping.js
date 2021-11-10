// Check bot latency

const Discord = require("discord.js");

require('../../applesilicon/misc.js')();

module.exports = {
    name: 'ping',
    command: 'ping',
    category: 'Information',
    usage: '`apple!ping`',
    description: 'Checks the bot\'s connection.',
    async execute(message, args) {
        const embed = new Discord.MessageEmbed().setColor(randomColor());
        const m = await message.channel.send({ embeds: [embed.setDescription("Ping?")] });
        m.edit({ embeds: [embed.setDescription(`:bell: **Pong!** It took \`${m.createdTimestamp - message.createdTimestamp}ms\` for signals to reach me. My current heartbeat is \`${Math.round(global.bot.ws.ping)}ms\`.`)] });
    },
};

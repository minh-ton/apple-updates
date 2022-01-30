// Show bot info

const Discord = require('discord.js');

require('../../applesilicon/misc.js')();

module.exports = {
    name: 'invite',
    command: 'invite',
    category: 'Information',
    usage: '`apple!invite`',
    description: 'Shows the bot invite link.',
    async execute(message, args) {
        let serverembed = new Discord.MessageEmbed()
            .setColor(randomColor())
            .setDescription(`<:discord:908005120783048744> Invite me to your servers by clicking the link below! \n> https://discordapp.com/oauth2/authorize?&client_id=852378577063116820&scope=bot+applications.commands&permissions=8`)
            .setFooter({ text: "Join our support server: https://discord.gg/ktHmcbpMNU" });
        message.channel.send({ embeds: [serverembed] });
    },
}
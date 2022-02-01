// Crash the bot

const Discord = require('discord.js');

require('../../applesilicon/embed.js')();

module.exports = {
    name: 'killall',
    command: 'killall',
    category: 'Owner',
    description: '**[Owner Only]** Restarts the bot.',
    async execute(message, args) {
        let isBotOwner = message.author.id == process.env.owner_id;
        if (!isBotOwner) return message.reply(error_alert('You can only cr4sh me unless you have special powers ¯\\_(ツ)_/¯'));

        global.bot.user.setStatus("invisible");

        const embed = new Discord.MessageEmbed()
            .setDescription(':skull: **Cr4shed successfully!**')
            .setTimestamp();

        message.reply({ embeds: [embed] }).then(() => {
            process.exit(1);
        });
    },
};

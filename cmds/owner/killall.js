// Crash the bot

const { EmbedBuilder } = require('discord.js');

require('../../core/embed.js')();

module.exports = {
    name: 'killall',
    command: 'killall',
    category: 'Owner',
    description: '**[Owner Only]** Restarts the bot.',
    async execute(message, args) {
        let isBotOwner = message.author.id == process.env.owner_id;
        if (!isBotOwner) return message.channel.send(error_alert('You can only cr4sh me unless you have special powers ¯\\_(ツ)_/¯'));

        global.bot.user.setStatus("invisible");

        const embed = new EmbedBuilder()
            .setDescription(':skull: **Cr4shed successfully!**')
            .setTimestamp();

        message.channel.send({ embeds: [embed] }).then(() => {
            process.exit(1);
        });
    },
};

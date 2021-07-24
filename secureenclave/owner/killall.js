// Crash the bot

require('../../applesilicon/embed.js')();

module.exports = {
    name: 'killall',
    command: 'killall',
    category: 'Owner',
    usage: '`apple!killall`',
    description: '**[Owner Only]** Restarts the bot.',
    async execute(message, args) {
        let isBotOwner = message.author.id == '589324103463338007';
        if (!isBotOwner) return message.channel.send(minor_error_embed('You can only cr4sh me unless you have special powers ¯\\_(ツ)_/¯'));

        global.bot.user.setStatus("invisible");
        message.channel.send('Cr4shed!').then(() => {
            process.exit(1);
        });
    },
};

// Crash the bot

module.exports = {
    name: 'killall',
    command: 'killall',
    category: 'Owner',
    usage: '`apple!killall`',
    description: '**[Owner Only]** Restarts the bot.',
    async execute(message, args) {
        let isBotOwner = message.author.id == '589324103463338007';
        if (!isBotOwner) return;

        global.bot.user.setStatus("invisible");
        message.channel.send('Cr4shed!').then(() => {
            process.exit(1);
        });
    },
};

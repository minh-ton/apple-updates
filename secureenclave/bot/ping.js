// Check bot latency

module.exports = {
    name: 'ping',
    command: 'ping',
    category: 'Information',
    usage: '`apple!ping`',
    description: 'Checks the bot\'s connection.',
    async execute(message, args) {
        const m = await message.channel.send("Ping?");
        m.edit(`:ping_pong: Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(global.bot.ws.ping)}ms.`);
    },
};

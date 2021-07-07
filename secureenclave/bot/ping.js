// Check bot latency

exports.run = async (message, args) => {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(global.bot.ws.ping)}ms`);
}

const ms = require("pretty-ms");

exports.run = (message, args) => {
    let isBotOwner = message.author.id == '589324103463338007';
    if (!isBotOwner) return;
    
    message.channel.send(`> **Bot Uptime**: ${ms(global.bot.uptime)}`);
}


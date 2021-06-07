const ms = require("pretty-ms");

exports.run = (bot, message, args) => {
    message.channel.send(`> **Bot Uptime**: ${ms(bot.uptime)}`);
}


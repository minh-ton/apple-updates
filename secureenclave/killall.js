exports.run = (bot, message, args) => {
    let isBotOwner = message.author.id == '589324103463338007';
    if (!isBotOwner) return;
    
    bot.user.setStatus("invisible");
    message.channel.send('Cr4shed!').then(() => {
        process.exit(1);
    });
}


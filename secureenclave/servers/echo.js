// Send bot announcements to servers

require('../../applesilicon/transceiver/embed.js')();

exports.run = (message, args) => {
    let isBotOwner = message.author.id == '589324103463338007';
    if (!isBotOwner) return;
    
    send_announcements(message.content.match(/[^"]+(?=(" ")|"$)/g)[0], message.content.match(/[^"]+(?=(" ")|"$)/g)[1]);
}

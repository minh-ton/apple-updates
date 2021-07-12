// Send bot announcements to servers

require('../../applesilicon/embed.js')();

module.exports = {
    name: 'echo',
    command: 'echo',
    category: 'Owner',
    usage: '`apple!echo <"title"> <"announcement">`',
    description: '**[Owner Only]** Sends bot\'s announcements.',
    async execute(message, args) {
        let isBotOwner = message.author.id == '589324103463338007';
        if (!isBotOwner) return message.channel.send(minor_error_embed('`apple!echo` is restricted to bot-owner only.'));

        send_announcements(message.content.match(/[^"]+(?=(" ")|"$)/g)[0], message.content.match(/[^"]+(?=(" ")|"$)/g)[1]);
    },
};
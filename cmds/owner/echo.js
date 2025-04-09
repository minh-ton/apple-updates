// Send bot announcements to servers

require('../../core/embed.js')();

module.exports = {
    name: 'echo',
    command: 'echo <"title"> <"announcement">',
    category: 'Owner',
    description: '**[Owner Only]** Sends bot\'s announcements.',
    async execute(message, args) {
        let isBotOwner = message.author.id == process.env.owner_id;
        if (!isBotOwner) return message.channel.send(error_alert('Dreaming of sending an announcement to thousands of people? Well you can\'t!'));

        send_announcements(message.content.match(/[^"]+(?=(" ")|"$)/g)[0], message.content.match(/[^"]+(?=(" ")|"$)/g)[1]);
    },
};
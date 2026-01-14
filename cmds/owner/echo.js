// Send bot announcements to servers

require('../../core/utils/error.js')();

module.exports = {
    name: 'echo',
    command: 'echo',
    category: 'Owner',
    description: '**[Owner Only]** Sends bot\'s announcements.',
    async execute(message, args) {
        let isBotOwner = message.author.id == process.env.owner_id;
        if (!isBotOwner) return message.channel.send(error_alert('Dreaming of sending an announcement to thousands of people? Well you can\'t!'));

        const commandMatch = message.content.match(/echo\s+([\s\S]*)/i);
        const content = commandMatch ? commandMatch[1].trim() : '';
        
        if (!content) {
            return message.channel.send(error_alert('Please provide announcement content after the echo command.'));
        }

        send_announcements(content);
    },
};
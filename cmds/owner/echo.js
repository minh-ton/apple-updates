// Send bot announcements to servers

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
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

        const previewEmbed = new EmbedBuilder()
            .setTitle('Announcement Preview')
            .setDescription(content)
            .setColor('#ffa500')
            .setFooter({ text: 'Click a button to confirm or cancel' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm')
                    .setLabel('Send')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger)
            );

        const previewMessage = await message.channel.send({ embeds: [previewEmbed], components: [row] });

        const filter = (interaction) => interaction.user.id === message.author.id;
        const collector = previewMessage.createMessageComponentCollector({ 
            componentType: ComponentType.Button, 
            filter, 
            max: 1, 
            time: 60000 
        });

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'confirm') {
                await interaction.update({ 
                    embeds: [previewEmbed.setColor('#00d768').setFooter({ text: 'Sending announcement...' })],
                    components: []
                });
                send_announcements(content);
                await message.channel.send('Announcement sent to all registered servers!');
            } else {
                await interaction.update({ 
                    embeds: [previewEmbed.setColor('#ff0000').setFooter({ text: 'Announcement cancelled' })],
                    components: []
                });
                await message.channel.send('Announcement cancelled.');
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                previewMessage.edit({ 
                    embeds: [previewEmbed.setColor('#808080').setFooter({ text: 'Timed out - no action taken' })],
                    components: []
                });
            }
        });
    },
};
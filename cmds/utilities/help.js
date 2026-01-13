// Get bot help / command help

const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

require('../../core/notification/staging.js')();
require('../../core/utils/utils.js')();

function help_embed(author) {
    const embed = new EmbedBuilder()
        .setTitle(`Software Updates - Help`)
        .setDescription(`To view more information on a command, use \`/help <command>\`. \nNeed more help? Join our support server: https://discord.gg/ktHmcbpMNU`)
        .addFields(
            { name: `Information`, value: '`about` `ping` `uptime` `invite` `source`' },
            { name: `Apple`, value: '`macos_installers` `ipsw` `latest_updates` `update_information`' },
            { name: `Utilities`, value: '`help` `setup`' }
        )
        .setColor(random_color());
    if (author == process.env.owner_id) embed.addFields({ name: `Owner`, value: '`killall` `bash` `echo` `eval`' });
    return embed;
}

module.exports = {
    name: 'help',
    command: 'help',
    category: 'Utilities',
    description: 'Gets help on a command.',
    usage: '`/help`: Shows a list of bot commands.\n`/help <command>`: Gets help on a command.',
    data: new SlashCommandBuilder().setName("help").setDescription("Gets help on a command.")
        .addStringOption(option => option.setName('command').setDescription('View more information on a command.').setRequired(false)
        .addChoices(
            { name: "about", value: "about" }, 
            { name: "ping", value: "ping" },
            { name: "uptime", value: "uptime" }, 
            { name: "invite", value: "invite" },
            { name: "source", value: "source" }, 
            { name: "ipsw", value: "ipsw" },
            { name: "latest_updates", value: "latest_updates" },
            { name: "macos_installers", value: "macos_installers" },
            { name: "update_information", value: "update_information" },
            { name: "help", value: "help" }, 
            { name: "setup", value: "setup" },
        )),
    async execute(interaction) {
        let color = random_color();

        if (!interaction.options.getString('command')) {
            const embed = new EmbedBuilder().setDescription(':wave: **Hey there! If you haven\'t configured this bot, use the `setup`\n command to get started!**').setColor(color);
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) await interaction.editReply({ embeds: [help_embed(interaction.member.id)] });
            else await interaction.editReply({ embeds: [help_embed(interaction.member.id), embed] });
            return;
        }

        const cmd = global.bot.commands.get(interaction.options.getString('command'));

        const embed = new EmbedBuilder()
            .setTitle(`\`${cmd.command}\``)
            .addFields(
                { name: 'Description', value: cmd.description },
                { name: `Category`, value: cmd.category }
            )
            .setColor(color);
        if (cmd.usage) embed.addFields({ name: 'Usage', value: cmd.usage });
        await interaction.editReply({ embeds: [embed] });
    },
};
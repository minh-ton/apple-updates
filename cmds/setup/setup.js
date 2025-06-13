const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

require("./helper/roles.js")();
require("./helper/updates.js")();
require("../../core/embed.js")();

module.exports = {
    name: 'setup',
    command: 'setup',
    category: 'Utilities',
    cooldown: 5,
    ephemeral: false,
    description: 'Configures the bot to your liking!',
    usage: '`/setup`: Configures the bot.\n`/setup role add`: Adds a notification role.\n`/setup role remove`: Removes a notification role.\n`/setup role list`: Lists configures notification roles.',
    data: new SlashCommandBuilder().setName("setup").setDescription("Configures the bot to your liking!")
        .addStringOption(option => option.setName("option").setDescription("Configures notification roles").setRequired(false)
            .addChoices(
                { name: 'role add', value: 'role add' },
                { name: 'role remove', value: 'role remove' },
                { name: 'role list', value: 'role list' },
            )),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) return interaction.editReply(error_alert("You do not have the `MANAGE SERVER` permission to use this command!"));
        if (!interaction.guild.members.me.permissions.has([
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.AddReactions,
            PermissionFlagsBits.UseExternalEmojis,
            PermissionFlagsBits.ManageMessages
        ])) return interaction.editReply(error_alert("I do not have the necessary permissions to work properly! \n\n ***Please make sure I have the following permissions:*** \n- View Channels\n- Add Reactions\n- Use External Emojis\n- Manage Messages"));

        try {
            if (interaction.options.getString('option') != undefined && interaction.options.getString('option').includes("role")) await setup_roles(interaction);
            else await setup_updates(interaction);
        } catch (e) {
            console.error(e);
            return interaction.editReply(error_alert("An unknown error occurred while running **setup** command.", e));
        }
    },
};

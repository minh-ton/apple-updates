const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

require("./helper/roles.js")();
require("./helper/updates.js")();
require("../../applesilicon/embed.js")();

module.exports = {
    name: 'setup',
    command: 'setup',
    category: 'Utilities',
    cooldown: 5,
    description: 'Configures the bot to your liking!',
    usage: '`/setup`: Configures the bot.\n`/setup role add`: Adds a notification role.\n`/setup role remove`: Removes a notification role.\n`/setup role list`: Lists configures notification roles.',
    data: new SlashCommandBuilder().setName("setup").setDescription("Configures the bot to your liking!")
        .addStringOption(option => option.setName("option").setDescription("Configures notification roles").setRequired(false)
            .addChoice("role add", "role add").addChoice("role remove", "role remove").addChoice("role list", "role list")),
    async execute(interaction) {
        if (!interaction.member.permissions.has("MANAGE_GUILD")) return interaction.editReply(error_alert("You do not have the `MANAGE SERVER` permission to use this command!"));
        if (!interaction.member.guild.me.permissions.has(["VIEW_CHANNEL", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS", "MANAGE_MESSAGES"])) return interaction.editReply(error_alert("I do not have the necessary permissions to work properly! \n\n ***Please make sure I have the following permissions:*** \n- View Channels\n- Add Reactions\n- Use External Emojis\n- Manage Messages"));

        try {
            if (interaction.options.getString('option') != undefined && interaction.options.getString('option').includes("role")) setup_roles(interaction);
            else setup_updates(interaction);
        } catch (e) {
            return interaction.editReply(error_alert("An unknown error occured while running **setup** command."));
        }
    },
};

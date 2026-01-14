const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

require("./helper/roles.js")();
require("./helper/updates.js")();
require("../../core/utils/error.js")();

const active_setups = new Map();

function is_setup_locked(guild_id) {
    if (!active_setups.has(guild_id)) return false;
    
    const lock_time = active_setups.get(guild_id);
    if (Date.now() - lock_time > 5 * 60 * 1000) {
        active_setups.delete(guild_id);
        return false;
    }
    return true;
}

function lock_setup(guild_id) {
    active_setups.set(guild_id, Date.now());
}

function unlock_setup(guild_id) {
    active_setups.delete(guild_id);
}

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
        if (!interaction.guild) {
            return interaction.editReply(error_alert("This command can only be used in a server!"));
        }

        if (!interaction.member || !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.editReply(error_alert("You do not have the `MANAGE SERVER` permission to use this command!"));
        }
        
        const bot_member = interaction.guild.members.me || await interaction.guild.members.fetch(interaction.client.user.id).catch(() => null);
        if (!bot_member || !bot_member.permissions.has(PermissionFlagsBits.ViewChannel)) {
            return interaction.editReply(error_alert("I do not have the necessary permissions to work properly! \n\n ***Please make sure I have the following permissions:*** \n- View Channels"));
        }

        if (is_setup_locked(interaction.guild.id)) {
            return interaction.editReply(error_alert("A setup command is already in progress in this server. Please wait for it to complete before starting a new one."));
        }

        try {
            lock_setup(interaction.guild.id);

            if (interaction.options.getString('option') != undefined && interaction.options.getString('option').includes("role")) {
                await setup_roles(interaction);
            } else {
                await setup_updates(interaction);
            }
        } catch (e) {
            console.error(e);
            return interaction.editReply(error_alert("An unknown error occurred while running **setup** command.", e));
        } finally {
            unlock_setup(interaction.guild.id);
        }
    },
};

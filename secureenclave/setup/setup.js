const Discord = require('discord.js');

require("./helper/roles.js")();
require("./helper/updates.js")();
require("../../applesilicon/embed.js")();

module.exports = {
    name: 'setup',
    command: 'setup',
    category: 'Utilities',
    usage: '`apple!setup`',
    cooldown: 5,
    description: 'Configures the bot to your liking!',
    async execute(message, args) {
        if (!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send(error_alert("You do not have the \"MANAGE SERVER\" permission to use this command!"));
        if (!message.guild.me.permissions.has(["VIEW_CHANNEL", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS", "MANAGE_MESSAGES"])) return message.channel.send(error_alert("I do not have the necessary permissions to work properly! \n\n ***Please make sure I have the following permissions:*** \n- View Channels\n- Add Reactions\n- Use External Emojis\n- Manage Messages"));

        if (args[0] == "role") setup_roles(message, args).catch(function (error) { return message.channel.send(error_alert(error)) });
        else setup_updates(message, args).catch(function (error) { return message.channel.send(error_alert(error)) });
    },
};

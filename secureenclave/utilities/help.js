// Get bot help / command help

const Discord = require('discord.js');

require('../../applesilicon/embed.js')();
require('../../applesilicon/misc.js')();

function help_embed() {
    const embed = new Discord.MessageEmbed()
        .setTitle(`Software Updates - Help`)
        .setDescription(`To view more information on a command, type \`apple!help <command>\`. \nNeed more help? Join our support server: https://discord.gg/ktHmcbpMNU`)
        .addField(`Information`, '`about` `ping` `uptime` `sysctl` `invite`')
        .addField(`Owner`, '`killall` `bash` `database` `echo` `eval`')
        .addField(`Utilities`, '`help` `setup`')
        .addField(`Apple`, '`latest`')
        .setColor(randomColor());
    return embed;
}

module.exports = {
    name: 'help',
    command: 'help',
    category: 'Utilities',
    usage: '`apple!help`: Show a list of bot commands\n`apple!help <command>`: Get help on a command.',
    description: 'Gets help on a command.',
    async execute(message, args) {
        let color = randomColor();

        if (!args[0]) {
            message.channel.send({ embeds: [help_embed()] });
            if (!message.member.permissions.has("MANAGE_GUILD")) return;
            const embed = new Discord.MessageEmbed().setDescription(':wave: **Hey there! If you haven\'t configured this bot, just type `apple!setup` to set it up! Don\'t worry, the process is very simple and user-friendly!**').setColor(color);
            return message.channel.send({ embeds: [embed] });
        }

        const cmd = global.bot.commands.get(args[0].toLowerCase());
        if (!cmd) return message.channel.send(minor_error_embed('That command does not exist. You can view the commands list by typing `apple!help`.'));

        const embed = new Discord.MessageEmbed()
            .setTitle(`\`${cmd.command}\``)
            .addField('Description', cmd.description)
            .addField(`Category`, cmd.category)
            .addField('Example & Usage', cmd.usage)
            .setColor(color);
        message.channel.send({ embeds: [embed] });
    },
};
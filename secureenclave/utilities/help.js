// Get bot help / command help

const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

require('../../applesilicon/embed.js')();
require('../../applesilicon/misc.js')();

function help_embed(author) {
    const embed = new Discord.MessageEmbed()
        .setTitle(`Software Updates - Help`)
        .setDescription(`To view more information on a command, use \`/help <command>\`. \nNeed more help? Join our support server: https://discord.gg/ktHmcbpMNU`)
        .addField(`Information`, '`about` `ping` `uptime` `invite` `source`')
        .addField(`Apple`, '`latest` `ipsw` `info`')
        .addField(`Utilities`, '`help` `setup`')
        .setColor(randomColor());
    if (author == process.env.owner_id) embed.addField(`Owner`, '`killall` `bash` `echo` `eval` `sysctl`');
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
            .addChoice("about", "about").addChoice("ping", "ping").addChoice("uptime", "uptime")
            .addChoice("invite", "invite").addChoice("source", "source").addChoice("latest", "latest")
            .addChoice("ipsw", "ipsw").addChoice("info", "info").addChoice("help", "help").addChoice("setup", "setup")),
    async execute(interaction) {
        let color = randomColor();

        if (!interaction.options.getString('command')) {
            const embed = new Discord.MessageEmbed().setDescription(':wave: **Hey there! If you haven\'t configured this bot, just use the `setup` command to set it up! Don\'t worry, the process is very simple and user-friendly!**').setColor(color);
            if (!interaction.member.permissions.has("MANAGE_GUILD")) await interaction.editReply({ embeds: [help_embed(interaction.member.id)] });
            else await interaction.editReply({ embeds: [help_embed(interaction.member.id), embed] });
            return;
        }

        const cmd = global.bot.commands.get(interaction.options.getString('command'));

        const embed = new Discord.MessageEmbed()
            .setTitle(`\`${cmd.command}\``)
            .addField('Description', cmd.description)
            .addField(`Category`, cmd.category)
            .setColor(color);
        if (cmd.usage) embed.addField('Usage', cmd.usage);
        await interaction.editReply({ embeds: [embed] });
    },
};
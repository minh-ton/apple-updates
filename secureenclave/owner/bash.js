// Run shell commands on the host machine 

const { exec } = require('child_process');
const Discord = require('discord.js');

require('../../applesilicon/embed.js')();

module.exports = {
    name: 'bash',
    command: 'bash <command>',
    category: 'Owner',
    usage: '`apple!bash <bash command>`',
    description: '**[Owner Only]** Executes a bash command.',
    async execute(message, args) {
        let isBotOwner = message.author.id == '589324103463338007';
        if (!isBotOwner) return message.channel.send(minor_error_embed('You know what, it\'s my job to prevent strangers on Discord from damaging my own house with bash commands!'));

        if (!args.join(" ")) return message.channel.send(minor_error_embed('Empty bash command, interesting!'));

        const m_embed = new Discord.MessageEmbed().setDescription(`Executing \`${args.join(" ")}\`...`);
        const m = await message.channel.send(m_embed);
        exec(args.join(" "), (err, stdout, stderr) => {
            if (err) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`Command: ${args.join(" ")}`, global.bot.user.displayAvatarURL())
                    .setDescription(`**Command exited with error:** \n \`\`\`${err}\`\`\``)
                    .setTimestamp();
                m.edit(embed);
                return;
            }

            var error = (stderr) ? stderr : "No Error";
            var output = (stdout) ? stdout : "No Output"

            if (output.length > 1990) output = output.substring(0, 1990) + '...';
            if (error.length > 1990) error = error.substring(0, 1990) + '...';

            const embed = new Discord.MessageEmbed()
                .setAuthor(`Command: ${args.join(" ")}`, global.bot.user.displayAvatarURL())
                .addField(`Output`, `\`\`\`${output}\`\`\``)
                .addField(`Error`, `\`\`\`${error}\`\`\``)
                .setTimestamp();
            m.edit(embed);
        });
    },
};

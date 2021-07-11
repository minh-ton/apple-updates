// Run shell commands on the host machine 

const { exec } = require('child_process');
const Discord = require('discord.js');

module.exports = {
    name: 'bash',
    command: 'bash',
    category: 'Owner',
    usage: '`apple!bash <shell command>`',
    description: '**[Owner Only]** Executes a shell command.',
    async execute(message, args) {
        let isBotOwner = message.author.id == '589324103463338007';
        if (!isBotOwner) return;

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

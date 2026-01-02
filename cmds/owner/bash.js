// Run shell commands on the host machine 

const { exec } = require('child_process');
const { EmbedBuilder } = require('discord.js');

require('../../core/notification/staging.js')();

module.exports = {
    name: 'bash',
    command: 'bash <command>',
    category: 'Owner',
    description: '**[Owner Only]** Executes a bash command.',
    async execute(message, args) {
        let isBotOwner = message.author.id == process.env.owner_id;
        if (!isBotOwner) return message.channel.send(error_alert('You know what, it\'s my job to prevent strangers on Discord from damaging my own house with bash commands!'));

        if (!args.join(" ")) return message.channel.send(error_alert('Empty bash command, interesting!'));

        const m_embed = new EmbedBuilder().setDescription(`Executing \`${args.join(" ")}\`...`);
        const m = await message.channel.send({ embeds: [m_embed] });
        exec(args.join(" "), (err, stdout, stderr) => {
            if (err) {
                const embed = new EmbedBuilder()
                    .setDescription(`**Command exited with error:** \n \`\`\`${err}\`\`\``)
                    .setTimestamp();
                m.edit({ embeds: [embed] });
                return;
            }

            var error = (stderr) ? stderr : "No Error";
            var output = (stdout) ? stdout : "No Output"

            if (output.length > 1000) output = output.substring(0, 1000) + '...';
            if (error.length > 1000) error = error.substring(0, 1000) + '...';

            const embed = new EmbedBuilder()
                .addFields(
                    { name: `Output`, value: `\`\`\`${output}\`\`\`` },
                    { name: `Error`, value: `\`\`\`${error}\`\`\`` }
                )
                .setTimestamp();
            m.edit({ embeds: [embed] });
        });
    },
};

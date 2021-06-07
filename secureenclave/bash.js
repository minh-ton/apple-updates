const { exec } = require('child_process');
const Discord = require('discord.js');

exports.run = async (bot, message, args) => {
    const m_embed = new Discord.MessageEmbed().setDescription(`Executing \`${args.join(" ")}\`...`);
    const m = await message.channel.send(m_embed);
    exec(args.join(" "), (err, stdout, stderr) => {
        if (err) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Command: ${args.join(" ")}`, `https://i.imgur.com/d1lcrpg.png`)
                .setDescription(`**Command exited with error:** \n \`${err}\``)
                .setTimestamp();
            m.edit(embed);
            return;
        }

        var error = (stderr) ? stderr : "No Error";
        var output = (stdout) ? stdout : "No Output"

        if (output.length > 1990) output = output.substring(0, 1990) + '...';
        if (error.length > 1990) error = error.substring(0, 1990) + '...';

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Command: ${args.join(" ")}`, `https://i.imgur.com/d1lcrpg.png`)
            .setDescription(`**Output:** \`\`\`${output}\`\`\` \n **Error:** \`\`\`${error}\`\`\``)
            .setTimestamp();
        m.edit(embed);
    });
}

// Get device ipsw files

const Discord = require("discord.js");
const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');

require('../../applesilicon/misc.js')();
require('../../applesilicon/embed.js')();

module.exports = {
    name: 'ipsw',
    command: 'ipsw',
    category: 'Apple',
    description: 'Gets the latest signed ipsw files.',
    usage: '`/ipsw <device identifier>`',
    data: new SlashCommandBuilder().setName("ipsw").setDescription("Gets the latest signed ipsw files.")
        .addStringOption(option => option.setName("identifier").setDescription("Specify device identifier").setRequired(true)),
    async execute(interaction) {
        let identifier = interaction.options.getString('identifier');

        var ipsw; try {
            ipsw = await axios.get(`https://api.ipsw.me/v4/device/${identifier}?type=ipsw`);
        } catch(error) {
            return interaction.editReply(error_alert('Ugh, an unknown error happened!'));
        }

        const data = [];

        for (let item in ipsw.data.firmwares) 
            if (ipsw.data.firmwares[item].signed == true) {
                const url = ipsw.data.firmwares[item].url;
                const filename = new URL(url).pathname.split('/').pop();
                const build = ipsw.data.firmwares[item].buildid;
                const version = ipsw.data.firmwares[item].version;

                data.push(`[${filename}](${url}) (Version ${version} - Build ${build})`);
            }
        
        let embed = new Discord.MessageEmbed()
            .setTitle(`Signed IPSW files for ${ipsw.data.name}`)
            .setDescription(data.join('\n'))
            .setColor(randomColor())
            .setTimestamp();
        interaction.editReply({ embeds: [embed] });
    },
};

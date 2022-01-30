// Get device ipsw files

const Discord = require("discord.js");
const axios = require('axios');

require('../../applesilicon/misc.js')();
require('../../applesilicon/embed.js')();

module.exports = {
    name: 'ipsw',
    command: 'ipsw',
    category: 'Apple',
    usage: '`apple!ipsw <device identifier>`',
    description: 'Gets the latest signed ipsw files.',
    async execute(message, args) {
        if (!args[0]) return message.channel.send(error_alert('Hmm I think the correct usage for this command is `apple!ipsw <device identifier>`'));

        var ipsw; try {
            ipsw = await axios.get(`https://api.ipsw.me/v4/device/${args[0]}?type=ipsw`);
        } catch(error) {
            return message.channel.send(error_alert('Ugh, an unknown error happened!'));
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
        message.channel.send({ embeds: [embed] })
    },
};

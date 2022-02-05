// Get device ipsw files

const Discord = require("discord.js");
const axios = require('axios');
const MiniSearch = require('minisearch')
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
        .addStringOption(option => option.setName("model").setDescription("Specify device model, e.g. iPhone 13 Pro Max").setRequired(true)),
    async execute(interaction) {
        let identifier = interaction.options.getString('model');

        try {
            const devices = `https://gist.githubusercontent.com/adamawolf/3048717/raw/4407bc61de88444a232f1dca6bd6b8e444698f83/Apple_mobile_device_types.txt`;
            const device_table = [];

            let device_data = await axios.get(devices);
            let device_data_clean = device_data.data.replace(/^\s*[\r\n]/gm, "");
            let device_table_raw = device_data_clean.split("\n");

            for (let query in device_table_raw) {
                let device = device_table_raw[query].split(":");
                device_table.push({ id: parseInt(query) + 1, name: device[1].trim(), identifier: device[0].trim() });
            }

            let search = new MiniSearch({
                fields: ['name', 'identifier'],
                storeFields: ['name', 'identifier'],
                searchOptions: { boost: { name: 2 } }
            });

            search.addAll(device_table);

            let results = search.search(identifier);

            if (!results || results.length < 1) {
                let suggestion = search.autoSuggest(identifier, { fuzzy: 0.2 });
                if (suggestion != undefined && suggestion.length > 0 && suggestion.suggestion != undefined) {
                    return interaction.editReply(error_alert(`Did you mean \`${suggestion[0].suggestion}\`?`));
                } else {
                    return interaction.editReply(error_alert('That device model does not exist!'));
                }
            }

            let ipsw = await axios.get(`https://api.ipsw.me/v4/device/${results[0].identifier}?type=ipsw`);

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

        } catch (error) {
            return interaction.editReply(error_alert('Ugh, an unknown error happened!'));
        }
    },
};

// Get device ipsw files

const Discord = require("discord.js");
const axios = require('axios');
const MiniSearch = require('minisearch')
const uniqid = require('uniqid'); 
const { SlashCommandBuilder } = require('@discordjs/builders');

require('../../applesilicon/misc.js')();
require('../../applesilicon/embed.js')();

async function display_results(results, index) {
    let ipsw = await axios.get(`https://api.ipsw.me/v4/device/${results[index].identifier}?type=ipsw`);

    const data = [];

    for (let item in ipsw.data.firmwares) { 
        if (ipsw.data.firmwares[item].signed == true) {
            const url = ipsw.data.firmwares[item].url;
            const filename = new URL(url).pathname.split('/').pop();
            const build = ipsw.data.firmwares[item].buildid;
            const version = ipsw.data.firmwares[item].version;

            data.push(`[${filename}](${url}) (Version ${version} - Build ${build})`);
        }
    }
    
    let embed = new Discord.MessageEmbed()
        .setTitle(`Signed IPSW files for ${ipsw.data.name}`)
        .setDescription(`${data.join('\n')}\n\n*This command will timeout after 3 minutes.*`)
        .setColor(randomColor())
        .setTimestamp();

    return embed;
}

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
                device_table.push({ id: parseInt(query) + 1, name: device[1].trim().replace('(', '').replace(')', '').replace('+', ' ').replace('-', ' ').replace(',', '').replace('inch', ''), identifier: device[0].trim() });
            }

            let search = new MiniSearch({
                fields: ['name', 'identifier'],
                storeFields: ['name', 'identifier'],
                searchOptions: { boost: { name: 5 } }
            });

            search.addAll(device_table);

            let results = search.search(identifier);

            var index = 0;

            const next_id = uniqid('next-');
            const prev_id = uniqid('prev-');
            const cancel_id = uniqid('cancel-');
            const ids = [next_id, prev_id, cancel_id];            

            const filter = ch => {
                ch.deferUpdate();
                return ch.member.id == interaction.member.id && ids.includes(ch.customId);
            }

            const row = new Discord.MessageActionRow().addComponents(
                new Discord.MessageButton()
                    .setCustomId(prev_id)
                    .setLabel('Previous Result')
                    .setStyle('SECONDARY'),
                new Discord.MessageButton()
                    .setCustomId(next_id)
                    .setLabel('Next Result')
                    .setStyle('SECONDARY'),
                new Discord.MessageButton()
                    .setCustomId(cancel_id)
                    .setLabel('Cancel')
                    .setStyle('SECONDARY'),
            );

            await interaction.editReply({ embeds: [await display_results(results, index)], components: [row] });
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 180000 });

            collector.on('collect', async action => {
                if (action.customId == next_id && index < results.length - 1) index++;
                if (action.customId == prev_id && index > 0) index--;
                if (action.customId == cancel_id) collector.stop(), index = -1;
                if (index >= 0) await interaction.editReply({ embeds: [await display_results(results, index)], components: [row] });
            });

            collector.on('end', async action => {
                await interaction.editReply({ embeds: [new Discord.MessageEmbed().setDescription("<:apple_x:869128016494751755> This command has been cancelled.").setColor("#FF0000")], components: [] });
            });

        } catch (error) {
            console.log(error);
            return interaction.editReply(error_alert('Ugh, an unknown error happened!'));
        }
    },
};

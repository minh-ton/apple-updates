// Get device ipsw files

const Discord = require("discord.js");
const axios = require('axios');
const MiniSearch = require('minisearch')
const uniqid = require('uniqid'); 
const wait = require('util').promisify(setTimeout);
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
        .setDescription(`${data.join('\n')}`)
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
            const devices = `https://api.ipsw.me/v4/devices`;
            const device_table = [];

            let device_data = await axios.get(devices);

            for (let query in device_data.data) {
                let device = device_data.data[query];
                device_table.push({ id: parseInt(query) + 1, name: device["name"], identifier: device["identifier"] });
            }

            let search = new MiniSearch({
                fields: ['name', 'identifier'],
                storeFields: ['name', 'identifier'],
                searchOptions: { boost: { name: 5 } }
            });

            search.addAll(device_table);

            let results = search.search(identifier);

            var index = 0, embed = undefined;

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

            await interaction.editReply({ embeds: [embed = await display_results(results, index)], components: [row] });
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 180000 });

            collector.on('collect', async action => {
                if (action.customId == next_id && index < results.length - 1) index++;
                if (action.customId == prev_id && index > 0) index--;
                if (action.customId == cancel_id) return collector.stop();
                if (index >= 0) {
                    embed = await display_results(results, index).catch(() => { collector.stop() });
                    await interaction.editReply({ embeds: [embed], components: [] });
                    await wait(1000);
                    await interaction.editReply({ embeds: [embed], components: [row] });
                }
            });

            collector.on('end', async action => {
                await interaction.editReply({ embeds: [embed], components: [] });
            });

        } catch (error) {
            return interaction.editReply(error_alert('Ugh, an unknown error occurred.', error));
        }
    },
};

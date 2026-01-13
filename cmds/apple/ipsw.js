// Get device ipsw files

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const axios = require('axios');
const MiniSearch = require('minisearch')
const crypto = require('crypto');
const wait = require('util').promisify(setTimeout);
const { SlashCommandBuilder } = require('@discordjs/builders');

require('../../core/utils/utils.js')();
require('../../core/utils/error.js')();

async function display_results(results, index, interaction) {
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
    
    let embed = new EmbedBuilder()
        .setTitle(`Signed IPSW files for ${ipsw.data.name}`)
        .setDescription(`${data.join('\n')}`)
        .setColor(random_color())
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });

    return embed;
}

module.exports = {
    name: 'ipsw',
    command: 'ipsw',
    category: 'Apple',
    ephemeral: false,
    description: 'Gets the latest signed ipsw files for a device.',
    usage: '`/ipsw <device identifier>`',
    data: new SlashCommandBuilder().setName("ipsw").setDescription("Gets the latest signed ipsw files for a device.")
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

            const next_id = crypto.randomUUID();
            const prev_id = crypto.randomUUID();
            const cancel_id = crypto.randomUUID();
            const ids = [next_id, prev_id, cancel_id];            

            const filter = ch => {
                ch.deferUpdate();
                return ch.member.id == interaction.member.id && ids.includes(ch.customId);
            }

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(prev_id)
                    .setLabel('Previous')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(cancel_id)
                    .setLabel('Done')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(next_id)
                    .setLabel('Next')
                    .setStyle(ButtonStyle.Primary),
            );

            await interaction.editReply({ embeds: [embed = await display_results(results, index, interaction)], components: [row] });
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 180000 });

            collector.on('collect', async action => {
                if (action.customId == next_id && index < results.length - 1) index++;
                if (action.customId == prev_id && index > 0) index--;
                if (action.customId == cancel_id) return collector.stop();
                if (index >= 0) {
                    embed = await display_results(results, index, interaction).catch(() => { collector.stop() });
                    await interaction.editReply({ embeds: [embed], components: [] });
                    await wait(1000);
                    await interaction.editReply({ embeds: [embed], components: [row] });
                }
            });

            collector.on('end', async action => {
                await interaction.editReply({ embeds: [embed], components: [] });
            });

        } catch (error) {
            return await interaction.editReply(error_alert('Ugh, an unknown error occurred.', error));
        }
    },
};

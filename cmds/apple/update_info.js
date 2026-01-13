// Gets info for an update

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const firebase = require("firebase-admin");
const formatBytes = require('pretty-bytes');
const axios = require('axios');
const crypto = require('crypto');
const wait = require('util').promisify(setTimeout);
const { SlashCommandBuilder } = require('@discordjs/builders');

let db = firebase.firestore();

const database = db.collection('other').doc('information');

require('../../core/utils/utils.js')();
require('../../core/utils/error.js')();

let multi_icons = ['ios', 'ipados', 'watchos', 'macos', 'tvos'];

function isBeta(build, remote) {
    let check = build.length > 6 && build.toUpperCase() != build;
    if (remote != undefined && remote == false) return false;
    if (remote != undefined && remote == true && !check) return true;
    return check;
}

function timeToEpoch(time) {
    return Math.floor(new Date(time).getTime() / 1000);
}

async function get_info(cname, data, index) {
    var info = {};

    let beta = isBeta(data[index]["build"], data[index]["beta"]);

    let title = `${cname.toLowerCase().replace('os', 'OS').replace('ipad', 'iPad')} ${data[index]["version"]} ${(beta) ? "Beta" : ""}`;
    let update_id = (data[index]["updateid"]) ? format_documentation_id(data[index]["updateid"], data[index]["version"], cname) : "Beta";
    let version = `${data[index]["version"]} ${(beta) ? update_id : ""}`;
    let build = data[index]["build"];
    let size = (data[index]["size"]) ? formatBytes(data[index]["size"]) : "N/A";
    let changelog = (data[index]["changelog"]) ? data[index]["changelog"] : "Release note is not available.";
    let postdate = ((typeof data[index]["postdate"]) == "string") ? timeToEpoch(data[index]['postdate']) : timeToEpoch(data[index]['postdate'].toDate());
    let thumbnail = (multi_icons.includes(cname.toLowerCase())) ? get_thumbnail(cname.toLowerCase() + version.split(".")[0]) : get_thumbnail(cname.toLowerCase());

    var package = undefined;

    if (data[index]["package"]) {
        try {
            const response = await axios.head(data[index]["package"], { timeout: 5000 });
            let status = (response.status === 404) ? "Expired" : formatBytes(data[index]["packagesize"]);
            package = `[InstallAssistant.pkg](${data[index]["package"]}) (${status})`;
        } catch (error) {
            let status = (error.response && error.response.status === 404) ? "Expired" : "Unavailable";
            package = `[InstallAssistant.pkg](${data[index]["package"]}) (${status})`;
        }
    }

    info.beta = beta;
    info.title = title;
    info.version = version;
    info.build = build;
    info.size = size;
    info.changelog = changelog;
    info.postdate = postdate;
    info.thumbnail = thumbnail;
    info.package = package;

    return info;
}

async function display(cname, query, index, interaction) {
    let data = query;
    let info = await get_info(cname, data, index);

    const embed = new EmbedBuilder()
        .setTitle(info.title)
        .addFields(
            { name: "Version", value: info.version, inline: true },
            { name: "Build", value: info.build, inline: true },
            { name: "Size", value: info.size, inline: true },
            { name: "Release Date", value: `<t:${info.postdate}:D>`, inline: true }
        )
        .setDescription(info.changelog)
        .setThumbnail(info.thumbnail)
        .setColor(random_color())
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });

    if (info.package) embed.addFields({ name: "Package", value: info.package, inline: true });

    return embed;
}

async function create_buttons(cname, data, index, ids) {
    let next_id = ids[0];
    let prev_id = ids[1];
    let cancel_id = ids[2];

    if (data.length == 1) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(cancel_id)
                .setLabel('Done')
                .setStyle(ButtonStyle.Success),
        );

        return row;
    } else if (index == 0) {
        let info_next = await get_info(cname, data, index + 1);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(cancel_id)
                .setLabel('Done')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(next_id)
                .setLabel(`${info_next.version}`)
                .setStyle(ButtonStyle.Primary),
        );

        return row;

    } else if (index == data.length - 1) {
        let info_prev = await get_info(cname, data, index - 1);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(prev_id)
                .setLabel(info_prev.version)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(cancel_id)
                .setLabel('Done')
                .setStyle(ButtonStyle.Success),
        );

        return row;
    } else {
        let info_next = await get_info(cname, data, index + 1);
        let info_prev = await get_info(cname, data, index - 1);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(prev_id)
                .setLabel(info_prev.version)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(cancel_id)
                .setLabel('Done')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(next_id)
                .setLabel(info_next.version)
                .setStyle(ButtonStyle.Primary),
        );

        return row;
    }
}

module.exports = {
    name: 'update_information',
    command: 'update_information',
    category: 'Apple',
    description: 'Gets information about an update.',
    ephemeral: false,
    usage: '`/update_information <os> <build | version>`',
    data: new SlashCommandBuilder().setName("update_information").setDescription("Gets information about an update.")
        .addStringOption(option => option.setName('os').setDescription('Specify the operating system, e.g. iOS').setRequired(true)
        .addChoices(
            { name: 'iOS', value: 'ios' },
            { name: 'iPadOS', value: 'ipados' },
            { name: 'watchOS', value: 'watchos' },
            { name: 'tvOS', value: 'tvos' },
            { name: 'macOS', value: 'macos' },
            { name: 'audioOS', value: 'audioos' }))
        .addStringOption(option => option.setName('version').setDescription("Specify the version, e.g. 14.8.1").setRequired(true)),

    async execute(interaction) {
        const os_name = interaction.options.getString('os');
        const search_query = interaction.options.getString('version');

        try {
            let version_query_public = await database.collection(os_name.toLowerCase() + "_public").where('version', '==', search_query).get();
            let version_query_beta = await database.collection(os_name.toLowerCase() + "_beta").where('version', '==', search_query).get();

            if (version_query_public.empty && version_query_beta.empty) return interaction.editReply(error_alert('No results found.'));
            
            const query_data = [];
            if (!version_query_public.empty) version_query_public.forEach(doc => { query_data.push(doc.data()) });
            if (!version_query_beta.empty) version_query_beta.forEach(doc => { query_data.push(doc.data()) });

            query_data.sort(function(x, y) {
                return (isBeta(x["build"], x["beta"]) - isBeta(y["build"]), y["beta"]);
            });

            const next_id = crypto.randomUUID();
            const prev_id = crypto.randomUUID();
            const cancel_id = crypto.randomUUID();
            const ids = [next_id, prev_id, cancel_id];            

            const filter = ch => {
                ch.deferUpdate();
                return ch.member.id == interaction.member.id && ids.includes(ch.customId);
            }

            var index = 0, embed = undefined, row = undefined;

            embed = await display(os_name, query_data, index, interaction);
            row = await create_buttons(os_name, query_data, index, ids)

            await interaction.editReply({ embeds:[embed], components: [row] });

            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 180000 });

            collector.on('collect', async action => {
                if (action.customId == next_id) index++;
                if (action.customId == prev_id) index--;
                if (action.customId == cancel_id) return collector.stop();

                embed = await display(os_name, query_data, index, interaction);
                row = await create_buttons(os_name, query_data, index, ids)

                await interaction.editReply({ embeds: [embed], components: [] });
                await wait(1000);
                await interaction.editReply({ embeds: [embed], components: [await create_buttons(os_name, query_data, index, ids)] });
            });

            collector.on('end', async action => {
                await interaction.editReply({ embeds: [embed], components: [] });
            });
        } catch(error) {
            return await interaction.editReply(error_alert('Ugh, an unknown error occurred.', error));
        }
    },
};

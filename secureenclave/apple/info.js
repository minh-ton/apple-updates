// Gets info for an update

const Discord = require("discord.js");
const firebase = require("firebase-admin");
const checker = require('url-status-code')
const { SlashCommandBuilder } = require('@discordjs/builders');

let db = firebase.firestore();

const database = db.collection('other').doc('information');

require('../../applesilicon/misc.js')();
require('../../applesilicon/embed.js')();

const os = {
    "audioos": "audioOS",
    "tvos": "tvOS",
    "watchos": "watchOS",
    "ios": "iOS",
    "ipados": "iPadOS",
    "macos": "macOS"
}

const macos_names = {
    "11": "Big Sur",
    "12": "Monterey"
};

function isBeta(build, remote) {
    let check = build.length > 6 && build.toUpperCase() != build;
    if (remote != undefined && remote == false) return false;
    if (remote != undefined && remote == true && !check) return true;
    return check;
}

function timeToEpoch(time) {
    return Math.floor(new Date(time).getTime() / 1000);
}

async function search_build_embed(cname, query, interaction) {
    let data = query[0];
    
    const embed = new Discord.MessageEmbed()
        .setTitle(`${os[cname.toLowerCase()]} ${data["version"].split(".")[0]}${(cname.toLowerCase() == "macos") ? " " + macos_names[data["version"].split(".")[0]] : ""} ${isBeta(data["build"], data["beta"]) ? "Beta" : ""}`)
        .addField(`Version`, data["version"].toString() + (isBeta(data["build"], data["beta"]) ? ` ${(data["updateid"]) ? formatUpdatesName(data["updateid"], data["version"], cname) : "Beta"}` : ""), true)
        .addField(`Build`, data["build"].toString(), true)
        .setColor(randomColor())
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });
    if (cname.toLowerCase() == "ios" || cname.toLowerCase() == "ipados" || cname.toLowerCase() == "macos") embed.setThumbnail(getThumbnail(cname.toLowerCase() + data["version"].split(".")[0]));
    else embed.setThumbnail(getThumbnail(cname.toLowerCase()));

    if (data["size"]) embed.addField(`Size`, formatBytes(data["size"]), true);
    if (data["changelog"]) embed.setDescription(data["changelog"].toString());
    if (data["postdate"]) {
        if ((typeof data["postdate"]) == "string") embed.addField(`Release Date`, `<t:${timeToEpoch(data['postdate'])}:D>`, true);
        else if ((typeof data["postdate"]) == "object") embed.addField(`Release Date`, `<t:${timeToEpoch(data['postdate'].toDate())}:D>`, true);
    }

    if (data["package"]) {
        let url_status = await checker(data["package"]);
        embed.addField("Package", `[InstallAssistant.pkg](${data["package"]}) (${(url_status == "404") ? "Expired" : formatBytes(data["packagesize"])})`, true);
    }

    return { embeds: [embed] };
}

async function search_version_embed(cname, query, keyword, option, interaction) {
    let data = query;

    const embed = new Discord.MessageEmbed().setColor(randomColor()).setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });
    if (cname.toLowerCase() == "ios" || cname.toLowerCase() == "ipados" || cname.toLowerCase() == "macos") embed.setThumbnail(getThumbnail(cname.toLowerCase() + keyword.split(".")[0]));
    else embed.setThumbnail(getThumbnail(cname.toLowerCase()));

    data.sort(function(x, y) {
        return (isBeta(x["build"], x["beta"]) - isBeta(y["build"]), y["beta"]);
    });

    var all_beta = true;
    for (let result in data) {
        if (!isBeta(data[result]["build"], data[result]["beta"])) {
            all_beta = false;
            break;
        }
    }

    if ((data.length > 1 && option == true) || all_beta == true) {
        embed.setTitle(`${os[cname.toLowerCase()]} ${keyword} Search Results`);
        for (let result in data) {
            var info = `‣ **Version**: ${data[result]["version"]} ${isBeta(data[result]["build"], data[result]["beta"]) ? `${(data[result]["updateid"]) ? formatUpdatesName(data[result]["updateid"], data[result]["version"], cname) : "Beta"}` : ""}\n‣ **Build**: ${data[result]["build"]}\n`;
            if (data[result]["size"]) info += `‣ **Size**: ${formatBytes(data[result]["size"])}\n`;

            if (data[result]["postdate"]) {
                if ((typeof data[result]["postdate"]) == "string") info += `‣ **Release Date**: <t:${timeToEpoch(data[result]['postdate'])}:D>\n`;
                else if ((typeof data[result]["postdate"]) == "object") info += `‣ **Release Date**: <t:${timeToEpoch(data[result]['postdate'].toDate())}:D>\n`;
            }
            
            if (data[result]["package"]) {
                let url_status = await checker(data[result]["package"]);
                info += `‣ **Package**: [InstallAssistant.pkg](${data[result]["package"]}) (${(url_status == "404") ? "Expired" : formatBytes(data[result]["packagesize"])})\n`;
            }
            embed.addField(`No. #${parseInt(result) + 1}`, info);
        }
    } else {
        embed.setTitle(`${os[cname.toLowerCase()]} ${data[0]["version"].split(".")[0]}${(cname.toLowerCase() == "macos") ? " " + macos_names[data[0]["version"].split(".")[0]] : ""} ${isBeta(data[0]["build"], data[0]["beta"]) ? "Beta" : ""}`)
            .addField(`Version`, data[0]["version"].toString() + (isBeta(data[0]["build"], data[0]["beta"]) ? ` ${(data[0]["updateid"]) ? formatUpdatesName(data[0]["updateid"], data[0]["version"], cname) : "Beta"}` : ""), true)
            .addField(`Build`, data[0]["build"].toString(), true);

        if (data[0]["size"]) embed.addField(`Size`, formatBytes(data[0]["size"]), true);
        if (data[0]["changelog"]) embed.setDescription(data[0]["changelog"].toString());
        if (data[0]["postdate"]) {
            if ((typeof data[0]["postdate"]) == "string") embed.addField(`Release Date`, `<t:${timeToEpoch(data[0]['postdate'])}:D>`, true);
            else if ((typeof data[0]["postdate"]) == "object") embed.addField(`Release Date`, `<t:${timeToEpoch(data[0]['postdate'].toDate())}:D>`, true);
        }

        if (data[0]["package"]) {
            let url_status = await checker(data[0]["package"]);
            embed.addField("Package", `[InstallAssistant.pkg](${data[0]["package"]}) (${(url_status == "404") ? "Expired" : formatBytes(data[0]["packagesize"])})`, true);
        }
    }

    return { embeds: [embed] };
}

module.exports = {
    name: 'info',
    command: 'info',
    category: 'Apple',
    description: 'Gets information about an update.',
    ephemeral: false,
    usage: '`/info <os> <build | version>`',
    data: new SlashCommandBuilder().setName("info").setDescription("Gets information about an update.")
        .addStringOption(option => option.setName('os').setDescription('Specify the operating system, e.g. iOS').setRequired(true)
            .addChoice("macOS", "macos").addChoice("iOS", "ios").addChoice("iPadOS", "ipados")
            .addChoice("watchOS", "watchos").addChoice("tvOS", "tvos").addChoice("audioOS", "audioos"))
        .addStringOption(option => option.setName('query').setDescription("Specify the build / version, e.g. 14.8.1").setRequired(true))
        .addBooleanOption(option => option.setName("option").setDescription("Select 'True' to show all matching results").setRequired(false)),
    async execute(interaction) {
        const os_name = interaction.options.getString('os');
        const search_query = interaction.options.getString('query');
        const search_option = interaction.options.getBoolean('option');

        let build_query_public = await database.collection(os_name.toLowerCase() + "_public").doc(search_query).get();
        let build_query_beta = await database.collection(os_name.toLowerCase() + "_beta").doc(search_query).get();
        let version_query_public = await database.collection(os_name.toLowerCase() + "_public").where('version', '==', search_query).get();
        let version_query_beta = await database.collection(os_name.toLowerCase() + "_beta").where('version', '==', search_query).get();

        if (build_query_public.exists || build_query_beta.exists) {
            const query_data = [];
            if (build_query_public.exists) query_data.push(build_query_public.data());
            if (build_query_beta.exists) query_data.push(build_query_beta.data());
            return interaction.editReply(await search_build_embed(os_name, query_data, interaction));
        } else if (!version_query_public.empty || !version_query_beta.empty) {
            const query_data = [];
            if (!version_query_public.empty) version_query_public.forEach(doc => { query_data.push(doc.data()) });
            if (!version_query_beta.empty) version_query_beta.forEach(doc => { query_data.push(doc.data()) });
            return interaction.editReply(await search_version_embed(os_name, query_data, search_query, search_option, interaction));
        } else {
            return interaction.editReply(error_alert('No results found.'));
        }
    },
};

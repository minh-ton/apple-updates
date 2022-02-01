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

function isBeta(build) {
    if (build.length > 6 && build.toUpperCase() != build) return true; // May break in the future
    return false;
}

async function search_build_embed(cname, data) {
    let embed = new Discord.MessageEmbed()
        // Todo: Store macOS version names in an object?
        .setTitle(`${os[cname.toLowerCase()]} ${data["version"].split(".")[0]}${(cname.toLowerCase() == "macos") ? (data["version"].split(".")[0] == "12" ? " Monterey" : " Big Sur") : ""} ${isBeta(data["build"]) ? "Beta" : ""}`)
        .addField(`Version`, data["version"].toString() + (isBeta(data["build"]) ? ` ${(data["updateid"]) ? formatUpdatesName(data["updateid"], data["version"], cname) : "Beta"}` : ""), true)
        .addField(`Build`, data["build"].toString(), true)
        .setColor(randomColor())
        .setTimestamp();
    if (cname.toLowerCase() == "ios" || cname.toLowerCase() == "ipados" || cname.toLowerCase() == "macos") embed.setThumbnail(getThumbnail(cname.toLowerCase() + data["version"].split(".")[0]));
    else embed.setThumbnail(getThumbnail(cname.toLowerCase()));

    if (data["size"]) embed.addField(`Size`, formatBytes(data["size"]), true);
    if (data["changelog"]) embed.setDescription(data["changelog"].toString());

    if (data["package"]) {
        let url_status = await checker(data["package"]);
        embed.addField("Package", `[InstallAssistant.pkg](${data["package"]}) (${(url_status == "404") ? "Expired" : formatBytes(data["packagesize"])})`);
    }
    return { embeds: [embed] };
}

async function search_version_embed(cname, query, keyword, option) {
    let data = [];
    query.forEach(doc => { data.push(doc.data()) });

    const embed = new Discord.MessageEmbed().setColor(randomColor()).setTimestamp();
    if (cname.toLowerCase() == "ios" || cname.toLowerCase() == "ipados" || cname.toLowerCase() == "macos") embed.setThumbnail(getThumbnail(cname.toLowerCase() + keyword.split(".")[0]));
    else embed.setThumbnail(getThumbnail(cname.toLowerCase()));

    data.sort(function(x, y) {
        return (isBeta(x["build"]) == isBeta(y["build"])) ? 0 : isBeta(x["build"]) ? 1 : -1;
    });

    if (data.length > 1 && option == true) {
        embed.setTitle(`${os[cname.toLowerCase()]} ${keyword} Search Results`);
        for (let result in data) {
            var info = `‣ **Version**: ${data[result]["version"]} ${isBeta(data[result]["build"]) ? `${(data[result]["updateid"]) ? formatUpdatesName(data[result]["updateid"], data[result]["version"], cname) : "Beta"}` : ""}\n‣ **Build**: ${data[result]["build"]}\n`;
            if (data[result]["size"]) info += `‣ **Size**: ${formatBytes(data[result]["size"])}\n`;
            
            if (data[result]["package"]) {
                let url_status = await checker(data[result]["package"]);
                info += `‣ **Package**: [InstallAssistant.pkg](${data[result]["package"]}) (${(url_status == "404") ? "Expired" : formatBytes(data[result]["packagesize"])})\n`;
            }
            embed.addField(`No. #${parseInt(result) + 1}`, info);
        }
    } else {
        embed.setTitle(`${os[cname.toLowerCase()]} ${data[0]["version"].split(".")[0]}${(cname.toLowerCase() == "macos") ? (data[0]["version"].split(".")[0] == "12" ? " Monterey" : " Big Sur") : ""} ${isBeta(data[0]["build"]) ? "Beta" : ""}`)
            .addField(`Version`, data[0]["version"].toString() + (isBeta(data[0]["build"]) ? ` ${(data[0]["updateid"]) ? formatUpdatesName(data[0]["updateid"], data[0]["version"], cname) : "Beta"}` : ""), true)
            .addField(`Build`, data[0]["build"].toString(), true);

        if (data[0]["size"]) embed.addField(`Size`, formatBytes(data[0]["size"]), true);
        if (data[0]["changelog"]) embed.setDescription(data[0]["changelog"].toString());

        if (data[0]["package"]) {
            let url_status = await checker(data[0]["package"]);
            embed.addField("Package", `[InstallAssistant.pkg](${data[0]["package"]}) (${(url_status == "404") ? "Expired" : formatBytes(data[0]["packagesize"])})`);
        }
    }

    return { embeds: [embed] };
}

module.exports = {
    name: 'info',
    command: 'info',
    category: 'Apple',
    description: 'Gets information about an update.',
    usage: '`apple!info <os> <build | version>`',
    data: new SlashCommandBuilder().setName("info").setDescription("Gets information about an update.")
        .addStringOption(option => option.setName('os').setDescription('Specify the operating system').setRequired(true)
            .addChoice("macOS", "macos").addChoice("iOS", "ios").addChoice("iPadOS", "ipados")
            .addChoice("watchOS", "watchos").addChoice("tvOS", "tvos").addChoice("audioOS", "audioos"))
        .addStringOption(option => option.setName('query').setDescription("Specify the build / version").setRequired(true))
        .addBooleanOption(option => option.setName("option").setDescription("Toggle to show all matching results").setRequired(false)),
    async execute(interaction) {
        const os_name = interaction.options.getString('os');
        const search_query = interaction.options.getString('query');
        const search_option = interaction.options.getBoolean('option');

        if (!os[os_name.toLowerCase()]) return interaction.editReply(error_alert('Invalid OS name.'));

        let build_query = await database.collection(os_name.toLowerCase()).doc(search_query).get();
        let version_query = await database.collection(os_name.toLowerCase()).where('version', '==', search_query).get();

        if (build_query.exists) {
            let build_data = build_query.data();
            return interaction.editReply(await search_build_embed(os_name, build_data));
        } else if (!version_query.empty) {
            return interaction.editReply(await search_version_embed(os_name, version_query, search_query, search_option));
        } else {
            return interaction.editReply(error_alert('No matches found.'))
        }
    },
};

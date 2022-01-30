// Search for update info

const Discord = require("discord.js");
const firebase = require("firebase-admin");
const checker = require('url-status-code')

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
        .addField(`Version`, data["version"].toString() + (isBeta(data["build"]) ? " Beta" : ""), true)
        .addField(`Build`, data["build"].toString(), true)
        .setColor(randomColor())
        .setTimestamp();
    if (cname.toLowerCase() == "ios" || cname.toLowerCase() == "ipados" || cname.toLowerCase() == "macos") embed.setThumbnail(getThumbnail(cname.toLowerCase() + data["version"].split(".")[0]));
    else embed.setThumbnail(getThumbnail(cname.toLowerCase()));

    if (data["size"]) embed.addField(`Size`, formatBytes(data["size"]), true);
    if (data["changelog"]) embed.setDescription(data["changelog"].toString());

    let url_status = await checker(data["package"]);
    if (data["package"]) embed.addField("Package", `[InstallAssistant.pkg](${data["package"]}) (${(url_status == "404") ? "Expired" : formatBytes(data["packagesize"])})`);
    return { embeds: [embed] };
}

async function search_version_embed(cname, query, keyword) {
    let data = [];
    query.forEach(doc => { data.push(doc.data()) });

    const embed = new Discord.MessageEmbed().setColor(randomColor()).setTimestamp();
    if (cname.toLowerCase() == "ios" || cname.toLowerCase() == "ipados" || cname.toLowerCase() == "macos") embed.setThumbnail(getThumbnail(cname.toLowerCase() + keyword.split(".")[0]));
    else embed.setThumbnail(getThumbnail(cname.toLowerCase()));

    if (data.length > 1) {
        embed.setTitle(`${os[cname.toLowerCase()]} ${keyword} Search Results`);
        for (let result in data) {
            var info = `‣ **Version**: ${data[result]["version"]} ${isBeta(data[result]["build"]) ? "Beta" : ""}\n‣ **Build**: ${data[result]["build"]}\n`;
            if (data[result]["size"]) info += `‣ **Size**: ${formatBytes(data[result]["size"])}\n`;
            
            let url_status = await checker(data[result]["package"]);
            if (data[result]["package"]) info += `‣ **Package**: [InstallAssistant.pkg](${data[result]["package"]}) (${(url_status == "404") ? "Expired" : formatBytes(data[result]["packagesize"])})\n`;
            embed.addField(`No. #${parseInt(result) + 1}`, info);
        }
    } else {
        embed.setTitle(`${os[cname.toLowerCase()]} ${data[0]["version"].split(".")[0]}${(cname.toLowerCase() == "macos") ? (data[0]["version"].split(".")[0] == "12" ? " Monterey" : " Big Sur") : ""} ${isBeta(data[0]["build"]) ? "Beta" : ""}`)
            .addField(`Version`, data[0]["version"].toString() + (isBeta(data[0]["build"]) ? " Beta" : ""), true)
            .addField(`Build`, data[0]["build"].toString(), true);

        if (data[0]["size"]) embed.addField(`Size`, formatBytes(data[0]["size"]), true);
        if (data[0]["changelog"]) embed.setDescription(data[0]["changelog"].toString());

        let url_status = await checker(data[0]["package"]);
        if (data[0]["package"]) embed.addField("Package", `[InstallAssistant.pkg](${data[0]["package"]}) (${(url_status == "404") ? "Expired" : formatBytes(data[0]["packagesize"])})`);
    }

    return { embeds: [embed] };
}

module.exports = {
    name: 'search',
    command: 'search',
    category: 'Apple',
    usage: '`apple!search <os> <build | version>`',
    description: 'Gets information about an update.',
    async execute(message, args) {
        if (!args[0]) return message.channel.send(error_alert('Hmm I think the correct usage for this command is `apple!search <build | version>`'));
        if (!os[args[0].toLowerCase()]) return message.channel.send(error_alert('Invalid OS name.'));

        let build_query = await database.collection(args[0].toLowerCase()).doc(args[1]).get();
        let version_query = await database.collection(args[0].toLowerCase()).where('version', '==', args[1]).get();

        if (build_query.exists) {
            let build_data = build_query.data();
            return message.channel.send(await search_build_embed(args[0], build_data));
        } else if (!version_query.empty) {
            return message.channel.send(await search_version_embed(args[0], version_query, args[1]));
        } else {
            return message.channel.send(error_alert('No matches found.'))
        }
    },
};

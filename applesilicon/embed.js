// Send new OS updates

const Discord = require('discord.js');
const config = require("../bootrom/config.json");
const client = new Discord.WebhookClient(config.id, config.token);
// Just a webhook, not a bot...

require('./misc.js')();

module.exports = function () {

    // Send macOS public InstallAssistant.pkg link
    this.send_macos_pkg_public = function (pkgurl, version, build) {
        const embed = new Discord.MessageEmbed()
            .setDescription(`macOS **${version} (${build})** Full Installer Package:\n> ${pkgurl}`)
            .setAuthor(`Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
            .setThumbnail(getthumbnail("macOS"))
            .setColor(randomColor())
            .setTimestamp();
        client.send(embed);
        client.send(`<@&757663043126820991> Full Installer for **macOS ${version} (${build})** is available!`);
    };

    // Send macOS beta InstallAssistant.pkg link
    this.send_macos_pkg_beta = function (pkgurl, version, build) {
        const embed = new Discord.MessageEmbed()
            .setDescription(`macOS **${version} Beta (${build})** Full Installer Package:\n> ${pkgurl}`)
            .setAuthor(`Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
            .setThumbnail(getthumbnail("macOS"))
            .setColor(randomColor())
            .setTimestamp();
        client.send(embed);
        client.send(`<@&757663043126820991> Full Installer for **macOS ${version} Beta (${build})** is available!`);
    };

    // Send new macOS beta releases
    this.send_macos_beta = function (version, build, size, updateid) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`New macOS Beta Release!`)
            .setAuthor(`Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
            .addField(`Version`, `macOS ${version} (${updateid})`, true)
            .addField(`Build`, build, true)
            .addField(`Size`, formatBytes(size), true)
            .setThumbnail(getthumbnail("macOS"))
            .setColor(randomColor())
            .setTimestamp();
        client.send(embed);
        client.send(`<@&757663043126820991> macOS ${version} (${updateid}) has been released!`);
    };

    // Send new macOS public releases
    this.send_macos_public = function (version, build, size) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`New macOS Public Release!`)
            .setAuthor(`Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
            .addField(`Version`, `macOS ${version}`, true)
            .addField(`Build`, build, true)
            .addField(`Size`, formatBytes(size), true)
            .setThumbnail(getthumbnail("macOS"))
            .setColor(randomColor())
            .setTimestamp();
        client.send(embed);
        client.send(`<@&757663043126820991> macOS ${version} has been released!`);
    };

    // Send other OS updates
    this.send_other_updates = function (os, version, build, size) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`New ${os} Public Release!`)
            .setAuthor(`Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
            .addField(`Version`, `${version}`, true)
            .addField(`Build`, build, true)
            .addField(`Size`, formatBytes(size), true)
            .setThumbnail(getthumbnail(os))
            .setColor(randomColor())
            .setTimestamp();
        client.send(embed);
        if (os.toLowerCase() === "ios") client.send(`<@&742679465276211312> ${version} has been released!`);
    };

    // Send other OS beta updates
    this.send_other_beta_updates = function (os, version, build, size, updateid) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`New ${os} Beta Release!`)
            .setAuthor(`Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
            .addField(`Version`, `${version} (${updateid})`, true)
            .addField(`Build`, build, true)
            .addField(`Size`, formatBytes(size), true)
            .setThumbnail(getthumbnail(os))
            .setColor(randomColor())
            .setTimestamp();
        client.send(embed);
        if (os.toLowerCase() === "ios") client.send(`<@&742679465276211312> ${version} ${updateid} has been released!`);
    };

    // Send announcements
    this.send_announcements = function (title, message) {
        const embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setAuthor(`Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
            .setColor(randomColor())
            .setDescription(message)
            .setThumbnail(`https://i.imgur.com/d1lcrpg.png`)
            .setTimestamp();
        client.send(embed);
    }
}
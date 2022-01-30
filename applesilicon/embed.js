// Create update embeds

const Discord = require('discord.js');
const brightColor = require('randomcolor');

require('./misc.js')();
require('./send.js')();

module.exports = function () {
    // Send macOS public InstallAssistant.pkg link
    this.send_macos_pkg_public = function (pkgurl, version, build) {
        const embed = new Discord.MessageEmbed()
            .setDescription(`macOS **${version} (${build})** Full Installer Package:\n> ${pkgurl}`)
            .setThumbnail(getThumbnail("pkg"))
            .setColor(brightColor())
            .setTimestamp();
        send_to_servers('pkg', embed, `${version} (${build})`);
    };

    // Send macOS beta InstallAssistant.pkg link
    this.send_macos_pkg_beta = function (pkgurl, version, build) {
        const embed = new Discord.MessageEmbed()
            .setDescription(`macOS **${version} Beta (${build})** Full Installer Package:\n> ${pkgurl}`)
            .setThumbnail(getThumbnail("pkg"))
            .setColor(brightColor())
            .setTimestamp();
        send_to_servers('pkg', embed, `${version} Beta (${build})`);
    };

    // Send new macOS beta releases
    this.send_macos_beta = function (version, build, size, updateid, changelog) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`New macOS Beta Release!`) 
            .addField(`Version`, `${version} (${updateid})`, true)
            .addField(`Build`, build, true)
            .addField(`Size`, formatBytes(size), true)
            .setThumbnail(getThumbnail("macOS" + version.toString().substring(0, 2)))
            .setColor(brightColor())
            .setTimestamp();
        send_to_servers('macos', embed, `${version} (${updateid} - Build ${build})`);
    };

    // Send new macOS public releases
    this.send_macos_public = function (version, build, size, changelog) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`New macOS Public Release!`) 
            .addField(`Version`, `${version}`, true)
            .addField(`Build`, build, true)
            .addField(`Size`, formatBytes(size), true)
            .setThumbnail(getThumbnail("macOS" + version.toString().substring(0, 2)))
            .setDescription(changelog)
            .setColor(brightColor())
            .setTimestamp();
        send_to_servers('macos', embed, `${version} (${build})`);
    };

    // Send other OS updates
    this.send_other_updates = function (os, version, build, size, changelog) {
        const thumb = (os.toLowerCase() == "ios" || os.toLowerCase() == "ipados") ? getThumbnail(os + version.toString().substring(0, 2)) : getThumbnail(os);
        const embed = new Discord.MessageEmbed()
            .setTitle(`New ${os} Public Release!`)
            .addField(`Version`, `${version}`, true)
            .addField(`Build`, build, true)
            .addField(`Size`, formatBytes(size), true)
            .setThumbnail(thumb)
            .setDescription(changelog)
            .setColor(brightColor())
            .setTimestamp();
        send_to_servers(os, embed, `${version} (${build})`);
    };

    // Send other OS beta updates
    this.send_other_beta_updates = function (os, version, build, size, updateid) {
        const thumb = (os.toLowerCase() == "ios" || os.toLowerCase() == "ipados") ? getThumbnail(os + version.toString().substring(0, 2)) : getThumbnail(os);
        const embed = new Discord.MessageEmbed()
            .setTitle(`New ${os} Beta Release!`) 
            .addField(`Version`, `${version} (${updateid})`, true)
            .addField(`Build`, build, true)
            .addField(`Size`, formatBytes(size), true)
            .setThumbnail(thumb)
            .setColor(brightColor())
            .setTimestamp();
        send_to_servers(os, embed, `${version} (${updateid} - Build ${build})`);
    };

    // Send announcements
    this.send_announcements = function (title, message) {
        const embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(brightColor())
            .setDescription(message)
            .setThumbnail(global.bot.user.displayAvatarURL())
            .setTimestamp();
        send_to_servers("bot", embed);
    };

    this.error_alert = function (message) {
        const embed = new Discord.MessageEmbed().setDescription("<:apple_x:869128016494751755> " + message).setColor("#FF0000");
        return { embeds: [embed] };
    }
}
// Create update embeds

const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const formatBytes = require('pretty-bytes');

let multi_icons = ['ios', 'ipados', 'watchos', 'macos', 'tvos'];

require('../utils/utils.js')();
require('./notify.js')();

function isBeta(build) { return build.length > 6 && build.toUpperCase() !== build; }

module.exports = function () {
    this.send_macos_installer = function (pkgurl, version, build, size, beta) {
        const versionLabel = beta ? `${version} ${isBeta(build) ? "(Beta)" : "(RC)"}` : version;
        const notificationText = beta ? `${version} Beta (${build})` : `${version} (${build})`;
        
        const embed = new EmbedBuilder()
            .setTitle(`New macOS Full Installer Package!`)
            .addFields(
                { name: `Version`, value: versionLabel, inline: true },
                { name: `Build`, value: build, inline: true },
                { name: `Size`, value: formatBytes(size), inline: true }
            )
            .setDescription(`**Installer Package**: [InstallAssistant.pkg](${pkgurl})`)
            .setThumbnail(getThumbnail("pkg"))
            .setColor(randomColor())
            .setTimestamp();
        notify_all_servers('pkg', embed, notificationText);
    };

    this.send_os_updates = function (os, version, build, size, beta, updateid = null, changelog = null) {
        const isMacOS = os.toLowerCase() === 'macos';
        const releaseType = beta ? 'Beta' : 'Public';
        const versionLabel = beta ? `${version} (${updateid})` : version;
        const notificationText = beta ? `${version} (${updateid} - Build ${build})` : `${version} (${build})`;
        
        let thumbnail;
        if (isMacOS) {
            thumbnail = getThumbnail("macOS" + version.split('.')[0]);
        } else {
            thumbnail = multi_icons.includes(os.toLowerCase()) 
                ? getThumbnail(os + version.split('.')[0]) 
                : getThumbnail(os);
        }
        
        const embed = new EmbedBuilder()
            .setTitle(`New ${os} ${releaseType} Release!`)
            .addFields(
                { name: `Version`, value: versionLabel, inline: true },
                { name: `Build`, value: build, inline: true },
                { name: `Size`, value: formatBytes(size), inline: true }
            )
            .setThumbnail(thumbnail)
            .setColor(randomColor())
            .setTimestamp();
        
        if (!beta && changelog) embed.setDescription(changelog);
        
        notify_all_servers(os, embed, notificationText);
    };

    this.send_announcements = function (title, message) {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor(randomColor())
            .setDescription(message)
            .setThumbnail(global.bot.user.displayAvatarURL())
            .setTimestamp();
        notify_all_servers("bot", embed);
    };

    this.error_alert = function (message, report) {
        const embeds = [];
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                    .setURL("https://discord.gg/ktHmcbpMNU")
                    .setLabel('Join support server to ask for help')
                    .setStyle(ButtonStyle.Link));

        const alert = new EmbedBuilder().setDescription("<:apple_x:869128016494751755> " + message).setColor("#FF0000");
        embeds.push(alert);

        if (report != undefined) {
            const error_report = new EmbedBuilder()
                .setDescription(`Please report this incident in the support server:\n\`\`\`${report}\`\`\``)
                .setColor("#FF0000");
            embeds.push(error_report);
        }

        return { embeds: embeds, components: [button] };
    }
}
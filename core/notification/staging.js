// Create update embeds

const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const formatBytes = require('pretty-bytes');

let multi_icons = ['ios', 'ipados', 'watchos', 'macos', 'tvos'];

require('../utils/utils.js')();
require('./notify.js')();

function is_beta_build(build) { 
    return build.length > 6 && build.toUpperCase() !== build; 
}

module.exports = function () {
    this.send_macos_installer = function (pkg_url, version, build, size, is_beta) {
        const version_label = is_beta ? `${version} ${is_beta_build(build) ? "(Beta)" : "(RC)"}` : version;
        const notification_text = is_beta ? `${version} Beta (${build})` : `${version} (${build})`;
        
        const embed = new EmbedBuilder()
            .setTitle(`New macOS Full Installer Package!`)
            .addFields(
                { name: `Version`, value: version_label, inline: true },
                { name: `Build`, value: build, inline: true },
                { name: `Size`, value: formatBytes(size), inline: true }
            )
            .setDescription(`**Installer Package**: [InstallAssistant.pkg](${pkg_url})`)
            .setThumbnail(getThumbnail("pkg"))
            .setColor(randomColor())
            .setTimestamp();
        notify_all_servers('pkg', embed, notification_text);
    };

    this.send_os_updates = function (os, version, build, size, is_beta, update_id = null, changelog = null) {
        const release_type = is_beta ? 'Beta' : 'Public';
        const version_label = is_beta ? `${version} (${update_id})` : version;
        const notification_text = is_beta ? `${version} (${update_id} - Build ${build})` : `${version} (${build})`;
        
        const thumbnail = multi_icons.includes(os.toLowerCase()) ? getThumbnail(os + version.split('.')[0]) : getThumbnail(os);
        
        const embed = new EmbedBuilder()
            .setTitle(`New ${os == 'audioOS' ? 'HomePod Software' : os} ${release_type} Release!`)
            .addFields(
                { name: `Version`, value: version_label, inline: true },
                { name: `Build`, value: build, inline: true },
                { name: `Size`, value: formatBytes(size), inline: true }
            )
            .setThumbnail(thumbnail)
            .setColor(randomColor())
            .setTimestamp();
        
        if (!is_beta && changelog) embed.setDescription(changelog);
        
        notify_all_servers(os, embed, notification_text);
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

    // TODO: Move this to somewhere else
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
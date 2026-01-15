// Create update embeds

const { EmbedBuilder } = require('discord.js');
const formatBytes = require('pretty-bytes');

require('../utils/utils.js')();
require('./notify.js')();

module.exports = function () {
    this.send_macos_installer = async function (pkg_url, version, build, size, is_beta) {
        const version_label = is_beta ? `${version} ${is_beta_build(build) ? "(Beta)" : "(RC)"}` : version;
        const notification_text = is_beta ? `${version} Beta (${build})` : `${version} (${build})`;
        
        const embed = new EmbedBuilder()
            .setTitle(`New macOS Installer Package!`)
            .addFields(
                { name: `Version`, value: version_label, inline: true },
                { name: `Build`, value: build, inline: true },
                { name: `Size`, value: formatBytes(size), inline: true }
            )
            .setDescription(`**Installer Package**: [InstallAssistant.pkg](${pkg_url})`)
            .setThumbnail(await get_os_icon("pkg"))
            .setColor(random_color())
            .setTimestamp();
        notify_all_servers('pkg', embed, notification_text, is_beta);
    };

    this.send_os_updates = async function (os, version, build, size, is_beta, update_id = null, changelog = null) {
        const release_type = is_beta ? 'Beta' : 'Public';
        const version_label = is_beta ? `${version} (${update_id})` : version;
        const notification_text = is_beta ? `${version} (${update_id} - Build ${build})` : `${version} (${build})`;

        const embed = new EmbedBuilder()
            .setTitle(`New ${get_os_displayname(os)} ${release_type} Release!`)
            .addFields(
                { name: `Version`, value: version_label, inline: true },
                { name: `Build`, value: build, inline: true },
                { name: `Size`, value: formatBytes(size), inline: true }
            )
            .setThumbnail(await get_os_icon(os, version.split('.')[0]))
            .setColor(random_color())
            .setTimestamp();
        
        if (!is_beta && changelog) embed.setDescription(changelog);
        
        notify_all_servers(os, embed, notification_text, is_beta);
    };

    this.send_announcements = function (message) {
        const embed = new EmbedBuilder()
            .setColor(random_color())
            .setDescription(message)
            .setTimestamp();
        notify_all_servers("bot", embed);
    };
}
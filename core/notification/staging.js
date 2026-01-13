// Create update embeds

const { EmbedBuilder } = require('discord.js');
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
            .setTitle(`New macOS Installer Package!`)
            .addFields(
                { name: `Version`, value: version_label, inline: true },
                { name: `Build`, value: build, inline: true },
                { name: `Size`, value: formatBytes(size), inline: true }
            )
            .setDescription(`**Installer Package**: [InstallAssistant.pkg](${pkg_url})`)
            .setThumbnail(get_thumbnail("pkg"))
            .setColor(random_color())
            .setTimestamp();
        notify_all_servers('pkg', embed, notification_text);
    };

    this.send_os_updates = function (os, version, build, size, is_beta, update_id = null, changelog = null) {
        const release_type = is_beta ? 'Beta' : 'Public';
        const version_label = is_beta ? `${version} (${update_id})` : version;
        const notification_text = is_beta ? `${version} (${update_id} - Build ${build})` : `${version} (${build})`;
        
        const thumbnail = multi_icons.includes(os) ? get_thumbnail(os + version.split('.')[0]) : get_thumbnail(os);
        
        const embed = new EmbedBuilder()
            .setTitle(`New ${os == 'audioos' ? 'HomePod Software' : os.replace('os', 'OS').replace('pad', 'Pad')} ${release_type} Release!`) // Hacky title formatting fix
            .addFields(
                { name: `Version`, value: version_label, inline: true },
                { name: `Build`, value: build, inline: true },
                { name: `Size`, value: formatBytes(size), inline: true }
            )
            .setThumbnail(thumbnail)
            .setColor(random_color())
            .setTimestamp();
        
        if (!is_beta && changelog) embed.setDescription(changelog);
        
        notify_all_servers(os, embed, notification_text);
    };

    this.send_announcements = function (title, message) {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor(random_color())
            .setDescription(message)
            .setThumbnail(global.bot.user.displayAvatarURL())
            .setTimestamp();
        notify_all_servers("bot", embed);
    };
}
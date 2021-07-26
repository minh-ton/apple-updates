// Get latest updates

const Discord = require('discord.js');

require('../../applesilicon/updates.js')();
require('../../applesilicon/embed.js')();
require('../../applesilicon/misc.js')();

function get_links(xml_update) {
    let links = [];
    for (let update in xml_update) {
        let pkgurl = xml_update[update]['xml_pkg'];
        let version = xml_update[update]['xml_version'];
        let build = xml_update[update]['xml_build'];
        let size = xml_update[update]['xml_size'];

        links.push(`macOS ${version} (Build ${build} - Size ${formatBytes(size)}): [InstallAssistant.pkg](${pkgurl})`)
    }
    return links;
}

module.exports = {
    name: 'latest',
    command: 'latest',
    category: 'Apple',
    usage: '`apple!latest`',
    cooldown: 15,
    description: 'Gets the latest Apple OS updates.',
    async execute(message, args) {
        try {
            let m = await message.channel.send(`Getting the latest Apple updates...`);

            let assets = await get_os_assets(m);

            let macos_beta = assets['macos_beta'];
            let macos_beta_new = assets['macos_beta_new'];
            let macos_public = assets['macos_public'];
            let ios_beta = assets['ios_beta'];
            let ios_beta_new = assets['ios_beta_new'];
            let ios_public = assets['ios_public'];
            let watchos_beta = assets['watchos_beta'];
            let watchos_beta_new = assets['watchos_beta_new'];
            let watchos_public = assets['watchos_public'];
            let audioos_beta = assets['audioos_beta'];
            let audioos_beta_new = assets['audioos_beta_new'];
            let audioos_public = assets['audioos_public'];
            let tvos_beta = assets['tvos_beta'];
            let tvos_beta_new = assets['tvos_beta_new'];
            let tvos_public = assets['tvos_public'];
            let pkg_beta = assets['pkg_beta'];
            let pkg_beta_new = assets['pkg_beta_new'];
            let pkg_public = assets['pkg_public']

            const embed = new Discord.MessageEmbed()
                .setTitle("Latest Apple OS Updates")
                .addField('macOS',
                    `macOS ${macos_beta['mac_version']} (Build ${macos_beta['mac_build']} - ${formatUpdatesName(macos_beta['mac_updateid'], macos_beta['mac_version'], "macOS")} - Size ${formatBytes(macos_beta['mac_size'])})
                macOS ${macos_beta_new['mac_version']} (Build ${macos_beta_new['mac_build']} - ${formatUpdatesName(macos_beta_new['mac_updateid'], macos_beta_new['mac_version'], "macOS")} - Size ${formatBytes(macos_beta_new['mac_size'])})
                macOS ${macos_public['mac_version']} (Build ${macos_public['mac_build']} - Public Release - Size ${formatBytes(macos_public['mac_size'])})
            `, false)
                .addField('iOS',
                    `iOS ${ios_beta['os_version']} (Build ${ios_beta['os_build']} - ${formatUpdatesName(ios_beta['os_updateid'], ios_beta['os_version'], "iOS")} - Size ${formatBytes(ios_beta['os_size'])})
                iOS ${ios_beta_new['os_version']} (Build ${ios_beta_new['os_build']} - ${formatUpdatesName(ios_beta_new['os_updateid'], ios_beta_new['os_version'], "iOS")} - Size ${formatBytes(ios_beta['os_size'])})
                iOS ${ios_public['os_version']} (Build ${ios_public['os_build']} - Public Release - Size ${formatBytes(ios_beta['os_size'])})
            `, false)
                .addField('iPadOS',
                    `iPadOS ${ios_beta['os_version']} (Build ${ios_beta['os_build']} - ${formatUpdatesName(ios_beta['os_updateid'], ios_beta['os_version'], "iOS")} - Size ${formatBytes(ios_beta['os_size'])})
                iPadOS ${ios_beta_new['os_version']} (Build ${ios_beta_new['os_build']} - ${formatUpdatesName(ios_beta_new['os_updateid'], ios_beta_new['os_version'], "iOS")} - Size ${formatBytes(ios_beta['os_size'])})
                iPadOS ${ios_public['os_version']} (Build ${ios_public['os_build']} - Public Release - Size ${formatBytes(ios_beta['os_size'])})
            `, false)
                .addField('watchOS',
                    `watchOS ${watchos_beta['os_version']} (Build ${watchos_beta['os_build']} - ${formatUpdatesName(watchos_beta['os_updateid'], watchos_beta['os_version'], "watchOS")} - Size ${formatBytes(watchos_beta['os_size'])})
                watchOS ${watchos_beta_new['os_version']} (Build ${watchos_beta_new['os_build']} - ${formatUpdatesName(watchos_beta_new['os_updateid'], watchos_beta_new['os_version'], "watchOS")} - Size ${formatBytes(watchos_beta_new['os_size'])})
                watchOS ${watchos_public['os_version']} (Build ${watchos_public['os_build']} - Public Release - Size ${formatBytes(watchos_public['os_size'])})
            `, false)
                .addField('tvOS',
                    `tvOS ${tvos_beta['os_version']} (Build ${tvos_beta['os_build']} - ${formatUpdatesName(tvos_beta['os_updateid'], tvos_beta['os_version'], "tvOS")} - Size ${formatBytes(tvos_beta['os_size'])})
                tvOS ${tvos_beta_new['os_version']} (Build ${tvos_beta_new['os_build']} - ${formatUpdatesName(tvos_beta_new['os_updateid'], tvos_beta_new['os_version'], "tvOS")} - Size ${formatBytes(tvos_beta_new['os_size'])})
                tvOS ${tvos_public['os_version']} (Build ${tvos_public['os_build']} - Public Release - Size ${formatBytes(tvos_public['os_size'])})
            `, false)
                .addField('audioOS',
                    `audioOS ${audioos_beta['os_version']} (Build ${audioos_beta['os_build']} - ${formatUpdatesName(audioos_beta['os_updateid'], audioos_beta['os_version'], "audioOS")} - Size ${formatBytes(audioos_beta['os_size'])})
                audioOS ${audioos_beta_new['os_version']} (Build ${audioos_beta_new['os_build']} - ${formatUpdatesName(audioos_beta_new['os_updateid'], audioos_beta_new['os_version'], "audioOS")} - Size ${formatBytes(audioos_beta_new['os_size'])})
                audioOS ${audioos_public['os_version']} (Build ${audioos_public['os_build']} - Public Release - Size ${formatBytes(audioos_public['os_size'])})
            `, false)
                .setColor(randomColor());

            let public_array = get_links(pkg_public);
            let beta_array = get_links(pkg_beta).concat(get_links(pkg_beta_new).filter((item) => get_links(pkg_beta).indexOf(item) < 0)).filter((i) => public_array.indexOf(i) < 0);

            const continued = new Discord.MessageEmbed()
                .setDescription(`**macOS Full Installer Packages**\n
            **Public Release Installers:**
            ${public_array.join('\n')}\n
            **Beta Release Installers:**
            ${beta_array.join('\n')}
            `)
                .setColor(randomColor())
                .setTimestamp();

            await m.delete();
            message.channel.send(embed);
            message.channel.send(continued);
        } catch (error) {
            return message.channel.send(minor_error_embed(error));
        }
    },
};

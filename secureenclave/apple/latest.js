// Send macOS Installers

const Discord = require("discord.js");
const catalogs = require("../../bootrom/catalogs.json");
const { SlashCommandBuilder } = require('@discordjs/builders');

require('../../applesilicon/main/manager.js')();
require('../../applesilicon/embed.js')();
require('../../applesilicon/misc.js')();

let macos_public_catalog = catalogs.macos_11_public;
let macos_beta_catalog = catalogs.macos_11_beta;
let macos_new_public_catalog = catalogs.macos_12_public;
let macos_new_beta_catalog = catalogs.macos_12_beta;

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
    cooldown: 60,
    description: 'Gets the latest macOS Full Installer Packages.',
    data: new SlashCommandBuilder().setName("latest").setDescription("Gets the latest macOS Full Installer Packages."),
    async execute(interaction) {
        try {
            const processing = new Discord.MessageEmbed().setColor(randomColor());
            await interaction.editReply({ embeds: [processing.setDescription("Hang on, I'm fetching data from Apple...")] });

            let pkg_beta = await get_pkg_assets(macos_beta_catalog, 'beta_pkg');
            let pkg_beta_new = await get_pkg_assets(macos_new_beta_catalog, 'beta_pkg');
            let pkg_public_new = await get_pkg_assets(macos_new_public_catalog, 'public_pkg');

            let public_array = get_links(pkg_public_new);
            let beta_array = get_links(pkg_beta).concat(get_links(pkg_beta_new).filter((item) => get_links(pkg_beta).indexOf(item) < 0)).filter((i) => public_array.indexOf(i) < 0);

            const embed = new Discord.MessageEmbed()
                .setTitle("macOS Full Installer Packages")
                .setDescription(`**Public Release Installers:**\n${public_array.join('\n')}\n\n**Beta Release Installers:**\n${beta_array.join('\n')}`)
                .setColor(randomColor())
                .addField('Catalogs', `[macOS 11 Big Sur Public Release Catalog](${macos_public_catalog})\n[macOS 11 Big Sur Developer Beta Catalog](${macos_beta_catalog})\n[macOS 12 Monterey Public Release Catalog](${macos_new_public_catalog})\n[macOS 12 Monterey Developer Beta Catalog](${macos_new_beta_catalog})`)
                .setTimestamp();
            interaction.editReply({ embeds: [embed] });
        } catch (error) {
            return interaction.editReply(error_alert(error));
        }
    },
};

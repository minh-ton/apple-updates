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

function isBeta(build) {
    if (build.length > 6 && build.toUpperCase() != build) return true; // May break in the future
    return false;
}

function get_links(xml_update) {
    let beta = []; let public = [];
    for (let update in xml_update) {
        let pkgurl = xml_update[update]['xml_pkg'];
        let version = xml_update[update]['xml_version'];
        let build = xml_update[update]['xml_build'];
        let size = xml_update[update]['xml_size'];

        if (isBeta(build)) beta.push(`macOS ${version} (Build ${build} - Size ${formatBytes(size)}): [InstallAssistant.pkg](${pkgurl})`);
        else public.push(`macOS ${version} (Build ${build} - Size ${formatBytes(size)}): [InstallAssistant.pkg](${pkgurl})`);
    }
    return [beta, public];
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

            let pkg_catalog = await get_pkg_assets(macos_new_beta_catalog, 'beta_pkg');

            let installers = get_links(pkg_catalog);

            const embed = new Discord.MessageEmbed()
                .setTitle("macOS Full Installer Packages")
                .setDescription(`**Public Release Installers:**\n${installers[1].join('\n')}\n\n**Beta Release Installers:**\n${installers[0].join('\n')}`)
                .setColor(randomColor())
                .addField('Catalogs', `[macOS 11 Big Sur Public Release Catalog](${macos_public_catalog})\n[macOS 11 Big Sur Developer Beta Catalog](${macos_beta_catalog})\n[macOS 12 Monterey Public Release Catalog](${macos_new_public_catalog})\n[macOS 12 Monterey Developer Beta Catalog](${macos_new_beta_catalog})`)
                .setTimestamp();
            interaction.editReply({ embeds: [embed] });
        } catch (error) {
            return interaction.editReply(error_alert("Ugh, an unknown error occurred.", error));
        }
    },
};

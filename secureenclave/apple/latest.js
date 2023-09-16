// Send macOS Installers

const Discord = require("discord.js");
const catalogs = require("../../bootrom/catalogs.json");

require('../../applesilicon/main/manager.js')();
require('../../applesilicon/embed.js')();
require('../../applesilicon/misc.js')();

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
    ephemeral: false,
    description: 'Gets the latest macOS Full Installer Packages.',
    data: new Discord.SlashCommandBuilder().setName("latest").setDescription("Gets the latest macOS Full Installer Packages."),
    async execute(interaction) {
        try {
            const processing = new Discord.MessageEmbed().setColor(randomColor());
            await interaction.editReply({ embeds: [processing.setDescription("Hang on, I'm fetching data from Apple...")] });

            let installers = get_links(await get_pkg_assets(catalogs.macos_beta, 'beta_pkg'));
            let installers13 = get_links(await get_pkg_assets(catalogs.macos_beta_13, 'beta_pkg'));
            let installers12 = get_links(await get_pkg_assets(catalogs.macos_beta_12, 'beta_pkg'));
            let installers11 = get_links(await get_pkg_assets(catalogs.macos_beta_11, 'beta_pkg'));

            let installers_beta = `${installers11[0].sort().join('\n')}
                                    ${installers12[0].sort().join('\n')}
                                    ${installers13[0].sort().join('\n')}
                                    ${installers[0].sort()}`;
            
            let embed_color = randomColor();

            let items_count = Math.floor(installers[1].length / 2);

            const public1 = new Discord.MessageEmbed()
                .setTitle("macOS Full Installer Packages")
                .setDescription(`**Public Release Installers:**\n${installers[1].sort().slice(0, items_count).join('\n')}`)
                .setColor(embed_color);

            const public2 = new Discord.MessageEmbed()
                .setDescription(`${installers[1].sort().slice(items_count, installers[1].length).join('\n')}`)
                .setColor(embed_color);

            const beta = new Discord.MessageEmbed()
                .setDescription(`**Beta Release Installers:**\n${installers_beta}`)
                .setColor(embed_color)
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });
            
            interaction.editReply({ embeds: [public1, public2, beta] });
        } catch (error) {
            return interaction.editReply(error_alert("Ugh, an unknown error occurred.", error));
        }
    },
};

const { EmbedBuilder } = require("discord.js");
const formatBytes = require('pretty-bytes');
const { SUCATALOG_CONFIGS } = require("../../core/constants.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

require('../../core/fetch/fetch.js')();
require('../../core/utils/error.js')();
require('../../core/utils/utils.js')();

function is_beta_build(build) {
    if (build.length > 6 && build.toUpperCase() != build) return true;
    return false;
}

function parse_version(version_str) {
    const parts = version_str.split('.').map(p => parseInt(p));
    return {
        major: parts[0] || 0,
        minor: parts[1] || null,
        patch: parts[2] || null
    };
}

function compare_versions(v1, v2) {
    const p1 = parse_version(v1);
    const p2 = parse_version(v2);
    
    if (p1.major !== p2.major) return p1.major - p2.major;
    if (p1.minor !== p2.minor) return (p1.minor || 0) - (p2.minor || 0);
    return (p1.patch || 0) - (p2.patch || 0);
}

function matches_version_filter(version, filter) {
    const v = parse_version(version);
    const f = parse_version(filter);
    
    if (v.major !== f.major) return false;
    if (f.minor !== null && v.minor !== f.minor) return false;
    if (f.patch !== null && v.patch !== f.patch) return false;
    
    return true;
}

function get_latest_per_major(installers) {
    const major_versions = {};
    
    for (const installer of installers) {
        const type = installer.is_beta ? 'beta' : 'public';
        const parsed = parse_version(installer.version);
        const major = parsed.major;
        
        if (!major_versions[major]) major_versions[major] = { beta: null, public: null };
        if (!major_versions[major][type] || compare_versions(installer.version, major_versions[major][type].version) > 0)
            major_versions[major][type] = installer;
    }
    
    const result = [];
    for (const major in major_versions) {
        if (major_versions[major].public) result.push(major_versions[major].public);
        if (major_versions[major].beta) result.push(major_versions[major].beta);
    }
    
    return result.sort((a, b) => compare_versions(a.version, b.version));
}

module.exports = {
    name: 'macos_installers',
    command: 'macos_installers',
    category: 'Apple',
    cooldown: 60,
    ephemeral: false,
    description: 'Gets the latest macOS Installer Packages.',
    data: new SlashCommandBuilder().setName("macos_installers").setDescription("Gets the latest macOS Installer Packages.")
        .addStringOption(option =>
            option.setName('version').setDescription('macOS version (e.g., 15, 15.2, or 15.2.1)').setRequired(false)),
    async execute(interaction) {
        try {
            const processing = new EmbedBuilder().setColor(random_color());
            await interaction.editReply({ embeds: [processing.setDescription("Hang on, I'm fetching data from Apple...")] });

            const version_filter = interaction.options.getString('version');
            
            let catalogs = SUCATALOG_CONFIGS.macos;
            const base_catalogs = catalogs.slice(0, 2);
 
            catalogs = version_filter ? catalogs.filter(c => c.target_version === parse_version(version_filter).major) : base_catalogs;
            
            let all_installers = [];
            
            for (const catalog of catalogs) {
                const catalog_data = await get_sucatalog_installers(catalog.catalog_url);
                for (const item of catalog_data) {
                    all_installers.push({
                        version: item.xml_version,
                        build: item.xml_build,
                        size: item.xml_size,
                        url: item.xml_pkg,
                        is_beta: is_beta_build(item.xml_build)
                    });
                }
            }
            
            let filtered_installers = all_installers;
            let no_match = false;
            
            if (version_filter) {
                filtered_installers = all_installers.filter(inst => matches_version_filter(inst.version, version_filter));
                
                if (filtered_installers.length === 0) {
                    no_match = true;
                    
                    for (const catalog of base_catalogs) {
                        const catalog_data = await get_sucatalog_installers(catalog.catalog_url);
                        for (const item of catalog_data) {
                            all_installers.push({
                                version: item.xml_version,
                                build: item.xml_build,
                                size: item.xml_size,
                                url: item.xml_pkg,
                                is_beta: is_beta_build(item.xml_build)
                            });
                        }
                    }

                    const latest_major = Math.max(...all_installers.map(inst => parse_version(inst.version).major));
                    const latest_installers = all_installers.filter(inst => parse_version(inst.version).major === latest_major);

                    let latest_beta = null;
                    let latest_public = null;
                    
                    for (const inst of latest_installers) {
                        if (inst.is_beta) {
                            if (!latest_beta || compare_versions(inst.version, latest_beta.version) > 0) latest_beta = inst;
                        } else {
                            if (!latest_public || compare_versions(inst.version, latest_public.version) > 0) latest_public = inst;
                        }
                    }
                    
                    filtered_installers = [];
                    if (latest_public) filtered_installers.push(latest_public);
                    if (latest_beta) filtered_installers.push(latest_beta);
                }
            } else {
                filtered_installers = get_latest_per_major(all_installers);
            }
            
            filtered_installers.sort((a, b) => compare_versions(a.version, b.version));
            
            const seen_builds = new Set();
            const unique_installers = [];
            for (const inst of filtered_installers) {
                if (!seen_builds.has(inst.build)) {
                    seen_builds.add(inst.build);
                    unique_installers.push(inst);
                }
            }
            
            let description = '';
            for (const inst of unique_installers) {
                const line = `macOS ${inst.version} ${inst.is_beta ? "Beta" : ""} (Build ${inst.build} - Size ${formatBytes(inst.size)}): [InstallAssistant.pkg](${inst.url})\n`;
                
                if ((description + line).length > 4000) {
                    const lines = description.split('\n');
                    if (lines.length > 3) {
                        lines.splice(3, 1);
                        description = lines.join('\n');
                    }
                }
                
                description += line;
            }
            
            const embed = new EmbedBuilder()
                .setTitle(no_match ? "No Matches Found" : version_filter ? `macOS Installers for version ${version_filter}` : 'Latest macOS Installers')
                .setDescription((no_match ? "**Here's some latest installers instead:**\n" : "") + description.trim())
                .setColor(random_color())
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            return interaction.editReply(error_alert("Ugh, an unknown error occurred.", error));
        }
    },
};
